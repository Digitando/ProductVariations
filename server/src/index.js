const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const sharp = require('sharp');
const Stripe = require('stripe');
const {
  sanitizeUser,
  registerUser,
  authenticateCredentials,
  authenticateGoogle,
  createToken,
  optionalAuth,
  requireAuth,
  findUserById,
  generateReferralCode,
} = require('./auth');
const { getSessions, saveSessions, getUsers, saveUsers } = require('./storage');
const { sendWelcomeEmail } = require('./mailer');
const promptCatalog = require('../../shared/promptCatalog.cjs');

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

const stripeClient = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })
  : null;

const COINS_PER_CURRENCY_UNIT = 5;
const SUPPORTED_PURCHASE_CURRENCIES = new Set(['eur']);
const SQUARE_OUTPUT_SIZE = 1024;
const DEFAULT_STRIPE_DECIMAL_FACTOR = 100;
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

function normalizeCurrency(input) {
  return String(input || '').trim().toLowerCase();
}

function calculatePurchase(amount, currency) {
  const numericAmount = Number(amount);
  if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
    throw new Error('Purchase amount must be a positive whole number.');
  }

  const normalizedCurrency = normalizeCurrency(currency);
  if (!SUPPORTED_PURCHASE_CURRENCIES.has(normalizedCurrency)) {
    throw new Error('Unsupported currency.');
  }

  const coins = numericAmount * COINS_PER_CURRENCY_UNIT;
  const unitAmount = numericAmount * DEFAULT_STRIPE_DECIMAL_FACTOR;

  return { coins, amount: unitAmount, currency: normalizedCurrency };
}

if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set. API routes will fail until configured.');
}

if (!stripeClient) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Coin purchases will be disabled until configured.');
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

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}));
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(optionalAuth);
app.use(['/auth/register', '/auth/login', '/auth/google'], authLimiter);
app.use('/api/', apiLimiter);

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

async function getUserStoreEntry(userId) {
  if (!userId) {
    return { users: [], user: null, index: -1 };
  }

  // Ensure defaults are applied before we load the full list for mutation.
  await findUserById(userId);
  const users = await getUsers();
  const index = users.findIndex((candidate) => candidate.id === userId);
  const user = index === -1 ? null : users[index];

  if (user) {
    if (typeof user.coins !== 'number' || Number.isNaN(user.coins)) {
      user.coins = 0;
    }
    if (!Array.isArray(user.processedPayments)) {
      user.processedPayments = [];
    }
    if (!Array.isArray(user.referrals)) {
      user.referrals = [];
    }
  }

  return { users, user, index };
}

function computeRequiredCoins(variationRequests = []) {
  const count = Array.isArray(variationRequests) ? variationRequests.length : 0;
  return Math.max(count, 1);
}

async function loadImageBuffer(reference) {
  if (!reference) {
    throw new Error('Image reference is empty');
  }

  if (reference.startsWith('data:')) {
    const commaIndex = reference.indexOf(',');
    const base64 = commaIndex >= 0 ? reference.slice(commaIndex + 1) : reference;
    return Buffer.from(base64, 'base64');
  }

  const response = await axios.get(reference, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

async function convertToSquareDataUri(reference) {
  const buffer = await loadImageBuffer(reference);
  const image = sharp(buffer, { failOnError: false });
  const metadata = await image.metadata();
  const width = metadata.width || SQUARE_OUTPUT_SIZE;
  const height = metadata.height || SQUARE_OUTPUT_SIZE;
  const cropSize = Math.max(1, Math.min(width, height));
  const targetSize = Math.min(SQUARE_OUTPUT_SIZE, cropSize);

  let pipeline = sharp(buffer, { failOnError: false });
  if (width !== height && width && height) {
    const left = Math.max(0, Math.floor((width - cropSize) / 2));
    const top = Math.max(0, Math.floor((height - cropSize) / 2));
    pipeline = pipeline.extract({ left, top, width: cropSize, height: cropSize });
  }

  const squareBuffer = await pipeline
    .resize(targetSize, targetSize, { fit: 'cover', withoutEnlargement: true })
    .png()
    .toBuffer();

  return `data:image/png;base64,${squareBuffer.toString('base64')}`;
}

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
    const { name, email, password, referralCode, acceptPrivacy, marketingOptIn } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!acceptPrivacy) {
      return res.status(400).json({ error: 'Privacy consent is required to create an account.' });
    }

    const user = await registerUser({
      name,
      email,
      password,
      referralCode,
      acceptPrivacy,
      marketingOptIn,
    });
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
    const { credential, acceptPrivacy, marketingOptIn } = req.body || {};
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required.' });
    }

    const user = await authenticateGoogle({ credential, acceptPrivacy, marketingOptIn });
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
    'Create product variations of the provided reference image. Treat the upload as authoritative: preserve the product\'s silhouette, materials, colours, and branding. Do not introduce alternate products, packaging, or text overlays. Maintain garment accuracy. Ensure the final output is a square (1:1) frame suitable for e-commerce listings.';

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
    'You are an e-commerce photo retoucher. Use the supplied reference image as the definitive product. Preserve its silhouette, materials, colours, and branding. Only adjust camera angle, lighting, background, or lightweight supporting props. Return exactly one finished square (1:1) image ready for online catalogues.';

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

app.post('/api/generate-images', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const promptIds = extractPromptIds(req.body.prompts || req.body.styles);
    const variationRequests = buildVariationRequests({ promptIds });

    const coinsRequired = computeRequiredCoins(variationRequests);
    const { users, user, index } = await getUserStoreEntry(req.user.id);
    if (!user || index === -1) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if ((user.coins || 0) < coinsRequired) {
      await fsp.unlink(req.file.path).catch(() => {});
      return res.status(402).json({ error: `You need ${coinsRequired} coin(s) but only have ${user.coins}.` });
    }

    const assetBaseUrl = getAssetBaseUrl(req);
    const imageUrl = `${assetBaseUrl}/uploads/${req.file.filename}`;
    const base64Fallback = await fsp.readFile(req.file.path, { encoding: 'base64' });

    const images = await Promise.all(
      variationRequests.map(async ({ prompt }, index) => {
        const rawImage = await generateVariationImage({
          prompt: `Variation ${index + 1}: ${prompt}`,
          imageUrl,
          base64Fallback,
        });
        return convertToSquareDataUri(rawImage);
      })
    );

    user.coins -= coinsRequired;
    users[index] = user;
    await saveUsers(users);

    req.user = sanitizeUser(user);

    res.json({
      images,
      sourceImage: imageUrl,
      prompts: variationRequests.map(({ template }) => template),
      coins: user.coins,
      coinsCharged: coinsRequired,
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

app.post('/api/generate-descriptions', requireAuth, async (req, res) => {
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

app.get('/api/coins/balance', requireAuth, async (req, res) => {
  try {
    const { user } = await getUserStoreEntry(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ coins: user.coins || 0 });
  } catch (error) {
    console.error('Failed to fetch coin balance', error);
    res.status(500).json({ error: 'Unable to fetch coin balance.' });
  }
});

app.post('/api/coins/create-payment-intent', requireAuth, async (req, res) => {
  if (!stripeClient) {
    return res.status(503).json({ error: 'Stripe is not configured yet.' });
  }

  try {
    const { amount, currency } = req.body || {};
    const purchase = calculatePurchase(amount, currency || 'eur');
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: purchase.amount,
      currency: purchase.currency,
      metadata: {
        userId: req.user.id,
        coins: String(purchase.coins),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      coins: purchase.coins,
      amount: purchase.amount,
      currency: purchase.currency,
    });
  } catch (error) {
    console.error('Failed to create payment intent', error);
    const message = error?.message || 'Failed to create payment intent.';
    res.status(400).json({ error: message });
  }
});

app.post('/api/coins/redeem', requireAuth, async (req, res) => {
  if (!stripeClient) {
    return res.status(503).json({ error: 'Stripe is not configured yet.' });
  }

  try {
    const { paymentIntentId } = req.body || {};
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId is required.' });
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      return res.status(404).json({ error: 'Payment intent not found.' });
    }

    const ownerId = paymentIntent.metadata?.userId;
    if (ownerId !== req.user.id) {
      return res.status(403).json({ error: 'This payment does not belong to your account.' });
    }

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment has not completed yet.' });
    }

    const coinsAwarded = Number(paymentIntent.metadata?.coins || 0);
    if (!Number.isFinite(coinsAwarded) || coinsAwarded <= 0) {
      return res.status(400).json({ error: 'Coin amount missing from payment metadata.' });
    }

    const { users, user, index } = await getUserStoreEntry(req.user.id);
    if (!user || index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const alreadyProcessed = Array.isArray(user.processedPayments)
      ? user.processedPayments.some((entry) => entry.paymentIntentId === paymentIntentId)
      : false;

    if (alreadyProcessed || paymentIntent.metadata?.redeemed === 'true') {
      req.user = sanitizeUser(user);
      return res.json({ coins: user.coins || 0, coinsAwarded: 0 });
    }

    user.coins = (user.coins || 0) + coinsAwarded;
    user.processedPayments.push({
      paymentIntentId,
      coins: coinsAwarded,
      currency: paymentIntent.currency,
      amount: paymentIntent.amount,
      createdAt: new Date().toISOString(),
    });
    users[index] = user;
    await saveUsers(users);

    await stripeClient.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...paymentIntent.metadata,
        redeemed: 'true',
      },
    });

    req.user = sanitizeUser(user);

    res.json({ coins: user.coins, coinsAwarded });
  } catch (error) {
    console.error('Failed to redeem coins', error);
    const status = error?.statusCode || error?.status || 500;
    const message = error?.message || 'Failed to redeem payment.';
    res.status(status).json({ error: message });
  }
});

app.post('/api/referral-code/refresh', requireAuth, async (req, res) => {
  try {
    const { users, user, index } = await getUserStoreEntry(req.user.id);
    if (!user || index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const nextCode = generateReferralCode(users);
    user.referralCode = nextCode;
    users[index] = user;
    await saveUsers(users);

    req.user = sanitizeUser(user);

    res.json({ referralCode: nextCode });
  } catch (error) {
    console.error('Failed to refresh referral code', error);
    res.status(500).json({ error: 'Unable to refresh referral code.' });
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
