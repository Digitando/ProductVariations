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
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

async function findUserById(id) {
  const users = await getUsers();
  return users.find((user) => user.id === id) || null;
}

async function registerUser({ name, email, password }) {
  const users = await getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account already exists with that email.');
  }

  const hashedPassword = await hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    name: name || email.split('@')[0],
    email,
    password: hashedPassword,
    provider: 'credentials',
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveUsers(users);
  return user;
}

async function authenticateCredentials({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new Error('Invalid email or password.');
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error('Invalid email or password.');
  }

  return user;
}

async function authenticateGoogle(credential) {
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
  let user = users.find((candidate) => candidate.googleId === payload.sub || candidate.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: payload.name || email,
      email,
      provider: 'google',
      googleId: payload.sub,
      createdAt: new Date().toISOString(),
      avatar: payload.picture || '',
    };
    users.push(user);
    await saveUsers(users);
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.provider = 'google';
    user.avatar = payload.picture || user.avatar || '';
    await saveUsers(users);
  }

  return user;
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
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
};
