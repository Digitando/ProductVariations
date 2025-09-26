const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { getUsers, saveUsers } = require('./storage');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Authentication tokens will be insecure until configured.');
}

const TOKEN_EXPIRY = '7d';
let googleClient = null;

const REFERRAL_CODE_LENGTH = 8;
const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function generateReferralCode(users = []) {
  const existing = new Set(
    users
      .map((user) => (user.referralCode || '').toUpperCase())
      .filter(Boolean),
  );

  let code = '';
  do {
    code = Array.from({ length: REFERRAL_CODE_LENGTH }, () =>
      REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)],
    ).join('');
  } while (existing.has(code));

  existing.add(code);
  return code;
}

function ensureUserDefaults(user, users) {
  if (!user) {
    return false;
  }

  let mutated = false;

  if (typeof user.coins !== 'number' || Number.isNaN(user.coins)) {
    user.coins = 0;
    mutated = true;
  }

  if (!user.referralCode) {
    user.referralCode = generateReferralCode(users);
    mutated = true;
  }

  if (!Array.isArray(user.referrals)) {
    user.referrals = [];
    mutated = true;
  }

  if (!Array.isArray(user.processedPayments)) {
    user.processedPayments = [];
    mutated = true;
  }

  if (!user.createdAt) {
    user.createdAt = new Date().toISOString();
    mutated = true;
  }

  if (typeof user.marketingOptIn !== 'boolean') {
    user.marketingOptIn = false;
    mutated = true;
  }

  if (!user.privacyAcceptedAt) {
    user.privacyAcceptedAt = user.createdAt || new Date().toISOString();
    mutated = true;
  }

  return mutated;
}

function getGoogleClient() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return null;
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  return googleClient;
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function createToken(payload) {
  if (!JWT_SECRET) {
    return null;
  }

  return jwt.sign({ sub: payload.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function readToken(token) {
  if (!JWT_SECRET) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_error) {
    return null;
  }
}

async function findUserByEmail(email) {
  const users = await getUsers();
  const normalized = normalizeEmail(email);
  const user = users.find((candidate) => normalizeEmail(candidate.email) === normalized);
  if (ensureUserDefaults(user, users)) {
    await saveUsers(users);
  }
  return user;
}

async function findUserById(id) {
  const users = await getUsers();
  const user = users.find((candidate) => candidate.id === id) || null;
  if (ensureUserDefaults(user, users)) {
    await saveUsers(users);
  }
  return user;
}

async function registerUser({ name, email, password, referralCode, acceptPrivacy, marketingOptIn }) {
  const users = await getUsers();
  const normalizedEmail = normalizeEmail(email);
  const existing = users.find((user) => normalizeEmail(user.email) === normalizedEmail);
  if (existing) {
    throw new Error('An account already exists with that email.');
  }

  if (!acceptPrivacy) {
    throw new Error('Privacy consent is required.');
  }

  const hashedPassword = await hashPassword(password);
  const timestamp = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    name: name || email.split('@')[0],
    email,
    password: hashedPassword,
    provider: 'credentials',
    createdAt: timestamp,
    lastLoginAt: timestamp,
    coins: 2,
    referrals: [],
    processedPayments: [],
    referredBy: null,
    privacyAcceptedAt: timestamp,
    marketingOptIn: Boolean(marketingOptIn),
  };

  ensureUserDefaults(user, users);

  const trimmedReferral = typeof referralCode === 'string' ? referralCode.trim().toUpperCase() : '';
  if (trimmedReferral) {
    const referrer = users.find(
      (candidate) => candidate.referralCode && candidate.referralCode.toUpperCase() === trimmedReferral,
    );

    if (referrer && normalizeEmail(referrer.email) !== normalizedEmail) {
      ensureUserDefaults(referrer, users);
      user.coins += 2;
      user.referredBy = referrer.id;
      referrer.coins += 4;
      referrer.referrals.push({
        userId: user.id,
        email: user.email,
        awardedAt: timestamp,
      });
    }
  }

  users.push(user);
  await saveUsers(users);
  return user;
}

async function authenticateCredentials({ email, password }) {
  const users = await getUsers();
  const normalizedEmail = normalizeEmail(email);
  const userIndex = users.findIndex((candidate) => normalizeEmail(candidate.email) === normalizedEmail);
  if (userIndex === -1) {
    throw new Error('Invalid email or password.');
  }

  const user = users[userIndex];
  if (!user.password) {
    throw new Error('Invalid email or password.');
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid email or password.');
  }

  ensureUserDefaults(user, users);
  user.lastLoginAt = new Date().toISOString();
  await saveUsers(users);

  return user;
}

async function authenticateGoogle({ credential, acceptPrivacy, marketingOptIn }) {
  const client = getGoogleClient();
  if (!client) {
    throw new Error('Google sign-in is not configured. Set GOOGLE_CLIENT_ID.');
  }

  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new Error('Invalid Google credential.');
  }

  const email = payload.email;
  if (!email) {
    throw new Error('Google account does not expose an email address.');
  }

  const users = await getUsers();
  const normalizedEmail = normalizeEmail(email);
  let user = users.find(
    (candidate) => candidate.googleId === payload.sub || normalizeEmail(candidate.email) === normalizedEmail,
  );

  const timestamp = new Date().toISOString();

  if (!user) {
    if (!acceptPrivacy) {
      throw new Error('Privacy consent is required.');
    }
    user = {
      id: crypto.randomUUID(),
      name: payload.name || email,
      email,
      provider: 'google',
      googleId: payload.sub,
      createdAt: timestamp,
      lastLoginAt: timestamp,
      avatar: payload.picture || '',
      coins: 2,
      referrals: [],
      processedPayments: [],
      referredBy: null,
      privacyAcceptedAt: timestamp,
      marketingOptIn: Boolean(marketingOptIn),
    };
    ensureUserDefaults(user, users);
    users.push(user);
  } else {
    ensureUserDefaults(user, users);
    user.googleId = payload.sub;
    user.provider = 'google';
    user.avatar = payload.picture || user.avatar || '';
    user.lastLoginAt = timestamp;
    if (!user.privacyAcceptedAt && acceptPrivacy) {
      user.privacyAcceptedAt = timestamp;
    }
    if (typeof marketingOptIn === 'boolean') {
      user.marketingOptIn = marketingOptIn;
    }
  }

  await saveUsers(users);

  return user;
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, processedPayments, referrals, ...rest } = user;
  const sanitized = {
    ...rest,
    coins: typeof user.coins === 'number' && !Number.isNaN(user.coins) ? user.coins : 0,
    referralCode: user.referralCode || '',
    referredBy: user.referredBy || null,
    referralCount: Array.isArray(referrals) ? referrals.length : 0,
    marketingOptIn: Boolean(user.marketingOptIn),
    privacyAcceptedAt: user.privacyAcceptedAt || null,
  };
  return sanitized;
}

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return next();
  }

  const decoded = readToken(token);
  if (!decoded?.sub) {
    return next();
  }

  findUserById(decoded.sub)
    .then((user) => {
      if (user) {
        req.user = sanitizeUser(user);
      }
      next();
    })
    .catch(() => next());
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  next();
}

module.exports = {
  sanitizeUser,
  registerUser,
  authenticateCredentials,
  authenticateGoogle,
  createToken,
  optionalAuth,
  requireAuth,
  findUserById,
  generateReferralCode,
};
