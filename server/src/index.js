const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const {
  sanitizeUser,
  registerUser,
  authenticateCredentials,
  authenticateGoogle,
  createToken,
  optionalAuth,
  requireAuth,
} = require('./auth');
const { getSessions, saveSessions } = require('./storage');
const { sendWelcomeEmail } = require('./mailer');
const promptCatalog = require('../../shared/promptCatalog.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set. API routes will fail until configured.');
}

const UPLOAD_DIR = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const CLIENT_DIST_DIR = path.resolve(__dirname, '../../client/dist');
const CLIENT_INDEX_FILE = path.join(CLIENT_DIST_DIR, 'index.html');
const CLIENT_FAVICON_FILE = path.join(CLIENT_DIST_DIR, 'favicon.ico');
const hasClientBuild = fs.existsSync(CLIENT_INDEX_FILE);
const hasClientFavicon = hasClientBuild && fs.existsSync(CLIENT_FAVICON_FILE);

if (!hasClientBuild) {
  console.warn(
    'Client build assets not found. Static site responses will return 404 until the client is built.'
  );
}

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}));
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(optionalAuth);

if (hasClientBuild) {
  app.use(express.static(CLIENT_DIST_DIR, { index: false, maxAge: '1h' }));
}

if (hasClientBuild) {
  if (hasClientFavicon) {
    app.get('/favicon.ico', (_req, res) => {
      res.sendFile(CLIENT_FAVICON_FILE);
    });
  } else {
    app.get('/favicon.ico', (_req, res) => {
      res.status(204).set('Cache-Control', 'public, max-age=60').end();
    });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.png';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const openRouterClient = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    ...(OPENROUTER_API_KEY ? { Authorization: `Bearer ${OPENROUTER_API_KEY}` } : {}),
    ...(process.env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL } : {}),
    ...(process.env.OPENROUTER_SITE_NAME ? { 'X-Title': process.env.OPENROUTER_SITE_NAME } : {}),
  },
});

const PROMPTS_BY_ID = promptCatalog.promptsById || {};
const DEFAULT_PROMPT_SEQUENCE = (() => {
  const defaultCategory = typeof promptCatalog.getCategory === 'function' ? promptCatalog.getCategory('male', 'upper') : null;
  if (defaultCategory?.defaultPromptIds?.length) {
    return defaultCategory.defaultPromptIds.slice(0, 5);
  }
  return Object.keys(PROMPTS_BY_ID).slice(0, 5);
})();

function translateUpstreamError(error) {
  const rawMessage =
    error?.response?.data?.error?.message || error?.response?.data?.error || error?.message || 'Request failed';

  if (typeof rawMessage === 'string' && /user not found/i.test(rawMessage)) {
    return 'OpenRouter rejected the configured API key (user not found). Update OPENROUTER_API_KEY and redeploy.';
  }

  return rawMessage || 'Request failed';
}

function sendAuthResponse(res, user) {
  const token = createToken(user);
  if (!token) {
    return res.status(500).json({ error: 'JWT_SECRET is not configured on the server.' });
  }

  return res.json({
    token,
    user: sanitizeUser(user),
  });
}

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await registerUser({ name, email, password });
    sendWelcomeEmail({ to: user.email, name: user.name }).catch((error) => {
      console.warn('Welcome email was not sent', error?.message || error);
    });
    return sendAuthResponse(res, user);
  } catch (error) {
    console.error('Registration failed', error.message || error);
    res.status(400).json({ error: error.message || 'Registration failed.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await authenticateCredentials({ email, password });
    return sendAuthResponse(res, user);
  } catch (error) {
    console.error('Login failed', error.message || error);
    res.status(401).json({ error: error.message || 'Login failed.' });
  }
});

app.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required.' });
    }

    const user = await authenticateGoogle(credential);
    return sendAuthResponse(res, user);
  } catch (error) {
    console.error('Google authentication failed', error.message || error);
    res.status(401).json({ error: error.message || 'Google authentication failed.' });
  }
});

app.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

function normalizeBase64Payload(input) {
  if (typeof input !== 'string') {
    return '';
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith('http')) {
    return '';
  }

  const commaIndex = trimmed.indexOf(',');
  const base64 = commaIndex >= 0 ? trimmed.slice(commaIndex + 1) : trimmed;
  return base64.replace(/\s/g, '');
}

function extractPromptIds(raw) {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw.map((value) => String(value)).filter(Boolean);
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((value) => String(value)).filter(Boolean);
      }
    } catch (_error) {
      // fall back to comma-separated string test
    }

    return raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
}

function resolvePromptTemplates(promptIds) {
  const resolved = [];
  const seen = new Set();

  const pushTemplate = (id) => {
    const template = PROMPTS_BY_ID[id];
    if (template && !seen.has(template.id)) {
      resolved.push(template);
      seen.add(template.id);
    }
  };

  promptIds.forEach(pushTemplate);
  
  // If no prompts selected, use defaults
  if (resolved.length === 0) {
    DEFAULT_PROMPT_SEQUENCE.forEach(pushTemplate);
  }

  // No longer limit to 5 - return all selected prompts
  return resolved;
}

function buildVariationRequests({ promptIds }) {
  const templates = resolvePromptTemplates(promptIds);
  const baseInstruction =
    'Create product variations of the provided reference image. Treat the upload as authoritative: preserve the product\'s silhouette, materials, colours, and branding. Do not introduce alternate products, packaging, or text overlays. Maintain garment accuracy.';

  return templates.map((template) => ({
    template,
    prompt: `${baseInstruction} Apply the ${template.name} styling: ${template.prompt}`,
  }));
}

function getAssetBaseUrl(req) {
  if (process.env.PUBLIC_ASSET_BASE_URL) {
    return process.env.PUBLIC_ASSET_BASE_URL.replace(/\/$/, '');
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto?.split(',')[0];
  const scheme = (protocol || req.protocol || 'http').replace(/:$/, '');
  const host = req.get('host');
  return `${scheme}://${host}`;
}

async function generateVariationImage({ prompt, imageUrl, base64Fallback }) {
  const systemInstruction =
    'You are an e-commerce photo retoucher. Use the supplied reference image as the definitive product. Preserve its silhouette, materials, colours, and branding. Only adjust camera angle, lighting, background, or lightweight supporting props. Return exactly one finished image.';

  const userText = `${prompt}\nUse the provided reference image as the base. Preserve the product's silhouette, materials, colours, and branding. Do not introduce alternative products, new logos, or any text overlays.`;

  const urlMessages = [
    {
      role: 'system',
      content: systemInstruction,
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: userText,
        },
        {
          type: 'image_url',
          image_url: { url: imageUrl },
        },
      ],
    },
  ];

  try {
    const { data } = await openRouterClient.post('/chat/completions', {
      model: 'google/gemini-2.5-flash-image-preview',
      messages: urlMessages,
    });
    return extractImageFromResponse(data);
  } catch (error) {
    if (error.response?.status === 400 && base64Fallback) {
      console.warn('Variation request failed with image_url; retrying with base64 payload');
      const base64Messages = [
        {
          role: 'system',
          content: systemInstruction,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userText,
            },
            {
              type: 'image',
              image_base64: base64Fallback,
            },
          ],
        },
      ];

      const { data } = await openRouterClient.post('/chat/completions', {
        model: 'google/gemini-2.5-flash-image-preview',
        messages: base64Messages,
      });
      return extractImageFromResponse(data);
    }

    throw error;
  }
}

function extractImageFromResponse(data) {
  const choice = data?.choices?.[0];
  const message = choice?.message;
  if (!message) {
    throw new Error('No message returned from image model');
  }

  const imageFromImages = Array.isArray(message.images)
    ? message.images.find((item) => item?.image_base64 || item?.image_url?.url)
    : null;

  if (imageFromImages?.image_base64) {
    return `data:image/png;base64,${imageFromImages.image_base64}`;
  }

  if (imageFromImages?.image_url?.url) {
    return imageFromImages.image_url.url;
  }

  const contentBlocks = Array.isArray(message.content) ? message.content : [];
  const imageBlock = contentBlocks.find((item) => {
    if (!item || typeof item !== 'object') return false;
    const type = item.type || '';
    return type === 'output_image' || type === 'image' || type === 'image_url';
  });

  if (imageBlock?.image_base64) {
    return `data:image/png;base64,${imageBlock.image_base64}`;
  }

  if (imageBlock?.image_url?.url) {
    return imageBlock.image_url.url;
  }

  throw new Error('Model response did not include an output image');
}

app.post('/api/generate-images', upload.single('image'), async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const promptIds = extractPromptIds(req.body.prompts || req.body.styles);
    const variationRequests = buildVariationRequests({ promptIds });

    const assetBaseUrl = getAssetBaseUrl(req);
    const imageUrl = `${assetBaseUrl}/uploads/${req.file.filename}`;
    const base64Fallback = await fsp.readFile(req.file.path, { encoding: 'base64' });

    const images = await Promise.all(
      variationRequests.map(({ prompt }, index) =>
        generateVariationImage({
          prompt: `Variation ${index + 1}: ${prompt}`,
          imageUrl,
          base64Fallback,
        })
      )
    );

    res.json({
      images,
      sourceImage: imageUrl,
      prompts: variationRequests.map(({ template }) => template),
    });
  } catch (error) {
    const status = error.response?.status || 500;
    console.error(
      'Image generation failed',
      status,
      error.response?.data || error.message
    );
    const message = translateUpstreamError(error);
    res.status(status).json({ error: message });
  }
});

const createDescriptionResponseFormat = (descriptionCount) => ({
  type: 'json_schema',
  json_schema: {
    name: 'product_descriptions',
    schema: {
      type: 'object',
      properties: {
        descriptions: {
          type: 'array',
          minItems: descriptionCount,
          maxItems: descriptionCount,
          items: {
            type: 'object',
            required: ['title', 'headline', 'tagline', 'body', 'tone'],
            properties: {
              title: { type: 'string' },
              headline: { type: 'string' },
              tagline: { type: 'string' },
              body: { type: 'string' },
              tone: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
      },
      required: ['descriptions'],
      additionalProperties: false,
    },
  },
});

app.post('/api/generate-descriptions', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    const { referenceImage, referenceImageFallback, prompts: rawPrompts, imageCount } = req.body;

    const referenceImageUrl =
      typeof referenceImage === 'string' && referenceImage.trim().startsWith('http')
        ? referenceImage.trim()
        : '';

    const referenceImageBase64 = referenceImageUrl
      ? normalizeBase64Payload(referenceImageFallback)
      : normalizeBase64Payload(referenceImage) || normalizeBase64Payload(referenceImageFallback);

    if (!referenceImageUrl && !referenceImageBase64) {
      return res.status(400).json({ error: 'referenceImage is required' });
    }

    // Determine number of descriptions based on image count
    const numImages = imageCount || 1;
    let descriptionCount = 1;
    if (numImages >= 10) {
      descriptionCount = 3;
    } else if (numImages >= 4) {
      descriptionCount = 2;
    }

    const promptIds = extractPromptIds(rawPrompts);
    const selectedTemplates = resolvePromptTemplates(promptIds);

    const sceneSummaryLine = selectedTemplates.length
      ? `Reference styling cues: ${selectedTemplates
          .map((template) => `${template.group} — ${template.name}`)
          .join('; ')}.`
      : 'Describe the product exactly as it appears in the reference photo, highlighting colour, materials, finish, and likely use context.';

    const instructionLines = [
      `Use the attached product reference photo to craft ${descriptionCount} concise, conversion-oriented e-commerce descriptions.`,
      sceneSummaryLine,
      'Each description must include:',
      '- A product title (max 8 words) suitable for e-commerce listings.',
      '- A short headline (max 10 words).',
      '- A tagline (max 15 words). Use an empty string if it is not needed.',
      '- A body paragraph (max 120 words) written for online shopping.',
      'Base every claim on visual evidence from the image or the selected prompt cues. Do not invent specifications you cannot verify.',
      'Write in clear, modern US English and keep each description distinct.',
    ];

    const promptWithImageCue = instructionLines.join('\n');

    const mediaAttachment = referenceImageUrl
      ? {
          type: 'image_url',
          image_url: { url: referenceImageUrl },
        }
      : {
          type: 'image',
          image_base64: referenceImageBase64,
        };

    const baseMessages = [
      {
        role: 'system',
        content:
          'You are a product marketing copywriter. Ground every description in the supplied product photo and optional prompt cues. Focus on sensory appeal, visual cues, and emotional benefits.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: promptWithImageCue,
          },
          mediaAttachment,
        ],
      },
    ];

    const descriptionResponseFormat = createDescriptionResponseFormat(descriptionCount);
    
    let data;
    try {
      ({ data } = await openRouterClient.post('/chat/completions', {
        model: 'openai/gpt-5-nano',
        response_format: descriptionResponseFormat,
        messages: baseMessages,
      }));
    } catch (modelError) {
      const fallbackBase64 = referenceImageBase64 || normalizeBase64Payload(referenceImageFallback);
      if (referenceImageUrl && fallbackBase64 && modelError.response?.status === 400) {
        console.warn('Description model rejected image_url; retrying with base64 payload');
        ({ data } = await openRouterClient.post('/chat/completions', {
          model: 'openai/gpt-5-nano',
          response_format: descriptionResponseFormat,
          messages: [
            baseMessages[0],
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: promptWithImageCue,
                },
                {
                  type: 'image',
                  image_base64: fallbackBase64,
                },
              ],
            },
          ],
        }));
      } else if (modelError.response?.status === 400) {
        console.warn('Description model rejected the image; retrying without media attachment');
        ({ data } = await openRouterClient.post('/chat/completions', {
          model: 'openai/gpt-5-nano',
          response_format: descriptionResponseFormat,
          messages: [
            baseMessages[0],
            {
              role: 'user',
              content: `${promptWithImageCue}\nThe photo reference could not be attached; describe the product using only the prompt cues.`,
            },
          ],
        }));
      } else {
        throw modelError;
      }
    }

    const message = data?.choices?.[0]?.message;
    let contentText = '';

    if (Array.isArray(message?.content) && message.content.length) {
      const textBlock = message.content.find(
        (item) => (item.type === 'output_text' || item.type === 'text') && item.text
      );
      if (textBlock?.text) {
        contentText = textBlock.text;
      }
    } else if (typeof message?.content === 'string') {
      contentText = message.content;
    } else if (typeof message?.content?.[0]?.text === 'string') {
      // Handle nested content arrays with direct text field
      contentText = message.content[0].text;
    }

    if (!contentText) {
      throw new Error('Model returned no description content');
    }

    let parsed;
    try {
      parsed = JSON.parse(contentText);
    } catch (parseError) {
      console.error('Description JSON parse error', parseError);
      throw new Error('Failed to parse description output');
    }

    res.json(parsed);
  } catch (error) {
    const status = error.response?.status || 500;
    console.error(
      'Description generation failed',
      status,
      error.response?.data || error.message
    );
    const message = translateUpstreamError(error);
    res.status(status).json({ error: message });
  }
});

app.get('/api/sessions', requireAuth, async (req, res) => {
  try {
    const sessions = await getSessions();
    const userSessions = sessions.filter((session) => session.userId === req.user.id);
    res.json({ sessions: userSessions });
  } catch (error) {
    console.error('Failed to fetch sessions', error);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

app.post('/api/sessions', requireAuth, async (req, res) => {
  try {
    const {
      prompts = [],
      sourceImage = '',
      generatedImages = [],
      descriptions = [],
    } = req.body || {};

    const session = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      prompts: Array.isArray(prompts) ? prompts.slice(0, 10) : [],
      sourceImage: typeof sourceImage === 'string' ? sourceImage : '',
      generatedImages: Array.isArray(generatedImages) ? generatedImages.slice(0, 10) : [],
      descriptions: Array.isArray(descriptions) ? descriptions.slice(0, 10) : [],
    };

    const sessions = await getSessions();
    sessions.unshift(session);

    // Retain only the most recent 200 sessions across all users to avoid unbounded growth.
    const trimmed = sessions.slice(0, 200);
    await saveSessions(trimmed);

    res.status(201).json({ session });
  } catch (error) {
    console.error('Failed to save session', error);
    res.status(500).json({ error: 'Failed to save session.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (hasClientBuild) {
  const SPA_ROUTE_PREFIXES = ['/api', '/uploads', '/health'];

  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const pathToMatch = req.path || '';
    if (SPA_ROUTE_PREFIXES.some((prefix) => pathToMatch === prefix || pathToMatch.startsWith(`${prefix}/`))) {
      return next();
    }

    res.sendFile(CLIENT_INDEX_FILE);
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
