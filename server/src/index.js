const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

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
const hasClientBuild = fs.existsSync(CLIENT_INDEX_FILE);

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

if (hasClientBuild) {
  app.use(express.static(CLIENT_DIST_DIR, { index: false, maxAge: '1h' }));
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

const PROMPT_TEMPLATES = [
  // 1 — STUDIO EDITORIALS
  {
    id: '1',
    group: 'Studio Editorials',
    name: 'Studio_Model_FrontPose',
    prompt:
      'Create a premium studio editorial photo showing my garment on a European male model standing front facing with strong posture. Crop from chin to mid thigh. Background is seamless white or light grey. Lighting is soft and even with a gentle rim to separate the figure. Fabric texture sharp and natural. No text, logos, or watermarks.',
  },
  {
    id: '2',
    group: 'Studio Editorials',
    name: 'Studio_Model_SeatedChair',
    prompt:
      'Generate a high fashion studio photo of my garment on a European male model seated casually on a minimalist chair. Focus on torso and arms. Crop from waist up. Background is seamless white or light grey. Hands lightly adjusting cuff or collar. Lighting soft and natural to reveal fabric texture. No pants or shoes visible. No text, logos, or watermarks.',
  },
  {
    id: '3',
    group: 'Studio Editorials',
    name: 'Studio_Model_LeaningWall',
    prompt:
      'Create a cinematic studio editorial of my garment on a European male model leaning against a smooth neutral wall. Background is seamless white or light grey. Crop waist up. Use directional light across fabric to show weave and folds. Torso fills most of the frame. No text, logos, or watermarks.',
  },
  {
    id: '4',
    group: 'Studio Editorials',
    name: 'Studio_Model_AdjustingCollar',
    prompt:
      'Generate a studio editorial image of my garment on a European male model adjusting the collar or neckline. Crop to upper torso and shoulders only. Background is seamless light grey. Lighting is soft and balanced with even frontal illumination and a subtle rim. Fabric texture is clear and sharp. Hands look natural. No text, logos, or watermarks.',
  },
  {
    id: '5',
    group: 'Studio Editorials',
    name: 'Studio_Model_StepForward',
    prompt:
      'Create a premium studio editorial of my garment on a European male model stepping forward with confidence. Crop from chest to thigh. Do not show pants or shoes. Background is seamless white or light grey. Use soft key light with an additional rim. The torso fills most of the frame. Fabric details are sharp and clear. No text, logos, or watermarks.',
  },
  // 2 — LIFESTYLE EDITORIALS
  {
    id: '6',
    group: 'Lifestyle Editorials',
    name: 'Lifestyle_Model_StreetNeutral',
    prompt:
      'Generate a lifestyle editorial of my garment on a European male model standing on a minimalist modern street. Neutral toned paving and soft grey architecture blurred behind. Open shade daylight with shallow depth of field. Background muted so garment color stands out. Crop chest up. No text, logos, or watermarks.',
  },
  {
    id: '7',
    group: 'Lifestyle Editorials',
    name: 'Lifestyle_Model_BalconyMinimal',
    prompt:
      'Create a lifestyle editorial of my garment on a European male model leaning on a clean balcony railing. Crop from chest to waist so garment fills the frame. Use golden hour light with shallow depth of field. City background blurred and muted so garment is hero. Fabric folds and fit sharp and detailed. No text, logos, or watermarks.',
  },
  {
    id: '8',
    group: 'Lifestyle Editorials',
    name: 'Lifestyle_Model_MinimalArchitecture',
    prompt:
      'Generate a fashion editorial of my garment on a European male model against sleek minimalist architecture. Clean white concrete or travertine wall behind. Soft natural daylight with gentle shadows. Crop waist up. Garment structure and fit emphasized. No text, logos, or watermarks.',
  },
  {
    id: '9',
    group: 'Lifestyle Editorials',
    name: 'Lifestyle_Model_SeatedSteps',
    prompt:
      'Create a lifestyle editorial of my garment on a European male model seated casually on wide neutral stone steps. Crop torso only. Soft overcast daylight with shallow depth of field. Neutral stone tones muted to emphasize garment. Hands interact with cuff or lapel. No text, logos, or watermarks.',
  },
  {
    id: '10',
    group: 'Lifestyle Editorials',
    name: 'Lifestyle_Model_WindowLight',
    prompt:
      'Generate a lifestyle editorial of my garment on a European male model near a large modern window with neutral interior background. Soft daylight filters in with subtle rim light. Crop chest up. Light highlights folds and fabric texture. Interior colors muted so garment is focus. No text, logos, or watermarks.',
  },
  // 3 — STUDIO CLOSE-UPS
  {
    id: '11',
    group: 'Studio Close-ups',
    name: 'Studio_Closeup_CollarTexture',
    prompt:
      'Create a studio close up of my garment on a European male model focused on collar and neckline. Background is seamless white or light grey. Raking light reveals stitching and fabric texture. True to life color. No text, logos, or watermarks.',
  },
  {
    id: '12',
    group: 'Studio Close-ups',
    name: 'Studio_Closeup_FabricFold',
    prompt:
      'Generate a studio close up of my garment sleeve area on a European male model. Show natural folds and fabric texture. Background is seamless white or light grey. Lighting soft and controlled. Macro sharpness on fabric grain. No text, logos, or watermarks.',
  },
  {
    id: '13',
    group: 'Studio Close-ups',
    name: 'Studio_Closeup_ButtonDetail',
    prompt:
      'Create a studio image of my garment on a European male model cropped mid chest with focus on buttons, zippers, or stitching. Background is seamless white or light grey. Soft cinematic light shows detail without glare. Fabric grain intact. No text, logos, or watermarks.',
  },
  {
    id: '14',
    group: 'Studio Close-ups',
    name: 'Studio_Closeup_ShoulderStructure',
    prompt:
      'Generate a close up of my garment on a European male model cropped tightly on shoulder line and seam construction. Background is seamless white or light grey. Soft directional light with gentle negative fill. Material texture crisp. No text, logos, or watermarks.',
  },
  {
    id: '15',
    group: 'Studio Close-ups',
    name: 'Studio_Closeup_CuffDetail',
    prompt:
      'Create a studio close up of my garment sleeve cuff on a European male model. Show stitching, material texture, and tailoring quality. Background is seamless white or light grey. Soft cinematic light. Fabric sharp and detailed. No text, logos, or watermarks.',
  },
  // 4 — PRODUCT-ONLY HERO SHOTS
  {
    id: '16',
    group: 'Product Hero Shots',
    name: 'Product_Hero_Suspended',
    prompt:
      'Create a luxury studio image of my male garment displayed on a minimal mannequin torso. The garment is the only focus. Garment is shown front facing with natural drape and structure. Background is seamless neutral white or light grey. Lighting is soft and even with gentle rim to highlight fabric texture and craftsmanship. No accessories, no props, no text, logos, or watermarks.',
  },
  {
    id: '17',
    group: 'Product Hero Shots',
    name: 'Product_Closeup_Stitching',
    prompt:
      'Create an extreme close up studio shot of my garment showing stitching and seam construction. Use soft directional light to highlight thread detail and layers. Background neutral seamless. No text, logos, or watermarks.',
  },
  {
    id: '18',
    group: 'Product Hero Shots',
    name: 'Product_Closeup_FabricWeave',
    prompt:
      'Generate a macro image of my garment fabric showing weave and texture in sharp detail. Raking light reveals depth without glare. Background minimal and neutral. No text, logos, or watermarks.',
  },
  {
    id: '19',
    group: 'Product Hero Shots',
    name: 'Product_Closeup_Fastening',
    prompt:
      'Create a close up studio shot of my garment focusing on a button, zipper, or fastening element. Show stitching and finishing details. Lighting balanced to avoid reflections. Background neutral seamless. No text, logos, or watermarks.',
  },
  {
    id: '20',
    group: 'Product Hero Shots',
    name: 'Product_Closeup_CuffEdge',
    prompt:
      'Generate a macro shot of my garment sleeve cuff or garment edge. Highlight tailoring, stitching, and craftsmanship. Use soft cinematic light with controlled reflections. Background neutral seamless. No text, logos, or watermarks.',
  },
];

const PROMPT_MAP = PROMPT_TEMPLATES.reduce((acc, template) => {
  acc[template.id] = template;
  return acc;
}, {});

const DEFAULT_PROMPT_SEQUENCE = ['1', '2', '3', '4', '5'];

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
    const template = PROMPT_MAP[id];
    if (template && !seen.has(template.id)) {
      resolved.push(template);
      seen.add(template.id);
    }
  };

  promptIds.forEach(pushTemplate);
  DEFAULT_PROMPT_SEQUENCE.forEach(pushTemplate);
  PROMPT_TEMPLATES.forEach((template) => pushTemplate(template.id));

  return resolved.slice(0, 5);
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
    const message = error.response?.data?.error?.message || error.message || 'Image generation failed';
    res.status(status).json({ error: message });
  }
});

const descriptionResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'product_descriptions',
    schema: {
      type: 'object',
      properties: {
        descriptions: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            required: ['headline', 'tagline', 'body', 'tone'],
            properties: {
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
};

app.post('/api/generate-descriptions', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    const { referenceImage, referenceImageFallback, prompts: rawPrompts } = req.body;

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

    const promptIds = extractPromptIds(rawPrompts);
    const selectedTemplates = resolvePromptTemplates(promptIds);

    const sceneSummaryLine = selectedTemplates.length
      ? `Reference styling cues: ${selectedTemplates
          .map((template) => `${template.group} — ${template.name}`)
          .join('; ')}.`
      : 'Describe the product exactly as it appears in the reference photo, highlighting colour, materials, finish, and likely use context.';

    const instructionLines = [
      'Use the attached product reference photo to craft three concise, conversion-oriented e-commerce descriptions.',
      sceneSummaryLine,
      'Each description must include:',
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

    const messageContent = data?.choices?.[0]?.message?.content;
    if (!Array.isArray(messageContent) || !messageContent.length) {
      throw new Error('Model returned no description content');
    }

    const textBlock = messageContent.find(
      (item) => (item.type === 'output_text' || item.type === 'text') && item.text
    );
    if (!textBlock) {
      throw new Error('Unexpected description format from model');
    }

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
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
    const message = error.response?.data?.error?.message || error.message || 'Description generation failed';
    res.status(status).json({ error: message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (hasClientBuild) {
  const SPA_ROUTE_PREFIXES = ['/api', '/uploads', '/health'];

  app.get('*', (req, res, next) => {
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
