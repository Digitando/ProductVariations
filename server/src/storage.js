const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

async function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    await fsp.mkdir(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    await fsp.writeFile(USERS_FILE, '[]', 'utf8');
  }

  if (!fs.existsSync(SESSIONS_FILE)) {
    await fsp.writeFile(SESSIONS_FILE, '[]', 'utf8');
  }
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read ${path.basename(filePath)}`, error);
    return fallback;
  }
}

async function writeJson(filePath, data) {
  const serialized = JSON.stringify(data, null, 2);
  await fsp.writeFile(filePath, `${serialized}\n`, 'utf8');
}

async function getUsers() {
  await ensureDataFiles();
  return readJson(USERS_FILE, []);
}

async function saveUsers(users) {
  await ensureDataFiles();
  await writeJson(USERS_FILE, users);
}

async function getSessions() {
  await ensureDataFiles();
  return readJson(SESSIONS_FILE, []);
}

async function saveSessions(sessions) {
  await ensureDataFiles();
  await writeJson(SESSIONS_FILE, sessions);
}

module.exports = {
  getUsers,
  saveUsers,
  getSessions,
  saveSessions,
};
