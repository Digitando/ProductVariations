const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabaseClient = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })
  : null;

function mapSupabaseUser(row) {
  if (!row) return null;
  const parse = (value, fallback) => {
    if (Array.isArray(value) || (value && typeof value === 'object')) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (_error) {
        return fallback;
      }
    }
    return fallback;
  };

  return {
    ...row,
    referrals: parse(row.referrals, []),
    processedPayments: parse(row.processedPayments, []),
  };
}

function mapUserForSupabase(user) {
  if (!user) return user;
  return {
    ...user,
    referrals: Array.isArray(user.referrals) ? user.referrals : [],
    processedPayments: Array.isArray(user.processedPayments) ? user.processedPayments : [],
  };
}

function mapSupabaseSession(row) {
  if (!row) return null;
  const parse = (value, fallback) => {
    if (Array.isArray(value) || (value && typeof value === 'object')) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (_error) {
        return fallback;
      }
    }
    return fallback;
  };

  return {
    ...row,
    prompts: parse(row.prompts, []),
    generatedImages: parse(row.generatedImages, []),
    descriptions: parse(row.descriptions, []),
  };
}

function mapSessionForSupabase(session) {
  if (!session) return session;
  return {
    ...session,
    prompts: Array.isArray(session.prompts) ? session.prompts : [],
    generatedImages: Array.isArray(session.generatedImages) ? session.generatedImages : [],
    descriptions: Array.isArray(session.descriptions) ? session.descriptions : [],
  };
}

async function ensureDataFiles() {
  if (supabaseClient) {
    return;
  }

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
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('users').select('*');
    if (error) {
      console.error('Failed to fetch users from Supabase', error);
      throw error;
    }
    return Array.isArray(data) ? data.map(mapSupabaseUser) : [];
  }

  await ensureDataFiles();
  return readJson(USERS_FILE, []);
}

async function saveUsers(users) {
  if (supabaseClient) {
    const normalized = Array.isArray(users) ? users.map(mapUserForSupabase) : [];
    const ids = normalized.map((user) => user.id);

    const { error: upsertError } = await supabaseClient.from('users').upsert(normalized, { onConflict: 'id' });
    if (upsertError) {
      console.error('Failed to upsert users to Supabase', upsertError);
      throw upsertError;
    }

    if (ids.length > 0) {
      const { data: existing, error: fetchError } = await supabaseClient.from('users').select('id');
      if (fetchError) {
        console.error('Failed to fetch existing user ids from Supabase', fetchError);
        throw fetchError;
      }

      const staleIds = (existing || [])
        .map((row) => row.id)
        .filter((id) => !ids.includes(id));

      if (staleIds.length > 0) {
        const { error: deleteError } = await supabaseClient.from('users').delete().in('id', staleIds);
        if (deleteError) {
          console.error('Failed to delete stale users from Supabase', deleteError);
          throw deleteError;
        }
      }
    }

    return;
  }

  await ensureDataFiles();
  await writeJson(USERS_FILE, users);
}

async function getSessions() {
  if (supabaseClient) {
    const { data, error } = await supabaseClient.from('sessions').select('*').order('createdAt', { ascending: false });
    if (error) {
      console.error('Failed to fetch sessions from Supabase', error);
      throw error;
    }
    return Array.isArray(data) ? data.map(mapSupabaseSession) : [];
  }

  await ensureDataFiles();
  return readJson(SESSIONS_FILE, []);
}

async function saveSessions(sessions) {
  if (supabaseClient) {
    const normalized = Array.isArray(sessions) ? sessions.map(mapSessionForSupabase) : [];
    const ids = normalized.map((session) => session.id);

    const { error: upsertError } = await supabaseClient.from('sessions').upsert(normalized, { onConflict: 'id' });
    if (upsertError) {
      console.error('Failed to upsert sessions to Supabase', upsertError);
      throw upsertError;
    }

    if (ids.length > 0) {
      const { data: existing, error: fetchError } = await supabaseClient.from('sessions').select('id');
      if (fetchError) {
        console.error('Failed to fetch existing session ids from Supabase', fetchError);
        throw fetchError;
      }

      const staleIds = (existing || [])
        .map((row) => row.id)
        .filter((id) => !ids.includes(id));

      if (staleIds.length > 0) {
        const { error: deleteError } = await supabaseClient.from('sessions').delete().in('id', staleIds);
        if (deleteError) {
          console.error('Failed to delete stale sessions from Supabase', deleteError);
          throw deleteError;
        }
      }
    }

    return;
  }

  await ensureDataFiles();
  await writeJson(SESSIONS_FILE, sessions);
}

module.exports = {
  getUsers,
  saveUsers,
  getSessions,
  saveSessions,
};
