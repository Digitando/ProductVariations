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

const USERS_TABLE = 'users';
const SESSIONS_TABLE = 'chat_sessions';

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
    marketingOptIn:
      typeof row.marketingOptIn === 'boolean'
        ? row.marketingOptIn
        : typeof row.marketingOptIn === 'string'
        ? row.marketingOptIn.toLowerCase() === 'true'
        : typeof row.marketingoptin === 'string'
        ? row.marketingoptin.toLowerCase() === 'true'
        : Boolean(row.marketingoptin),
    privacyAcceptedAt: row.privacyAcceptedAt || row.privacyacceptedat || null,
  };
}

function mapUserForSupabase(user) {
  if (!user) return user;
  const normalizeBoolean = (value) => {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
    }
    return Boolean(value);
  };
  return {
    ...user,
    referrals: Array.isArray(user.referrals) ? user.referrals : [],
    processedPayments: Array.isArray(user.processedPayments) ? user.processedPayments : [],
    marketingOptIn: normalizeBoolean(user.marketingOptIn),
    privacyAcceptedAt: user.privacyAcceptedAt || null,
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

  const coalesce = (...keys) => {
    for (const key of keys) {
      if (key in row && row[key] !== undefined && row[key] !== null) {
        return row[key];
      }
    }
    return undefined;
  };

  const rawCreator = coalesce('creator', 'creator_info', 'creatorinfo');
  const normalized = {
    ...row,
    id: row.id || row.session_id || row.sessionid || null,
    userId: coalesce('userId', 'user_id', 'userid') || null,
    createdAt: coalesce('createdAt', 'created_at', 'createdat') || null,
    sourceImage: coalesce('sourceImage', 'source_image', 'sourceimage') || '',
    prompts: parse(coalesce('prompts', 'prompt_ids', 'promptids'), []),
    generatedImages: parse(coalesce('generatedImages', 'generated_images', 'generatedimages'), []),
    descriptions: parse(coalesce('descriptions', 'description_entries', 'description'), []),
    promptSummaries: parse(coalesce('promptSummaries', 'prompt_summaries', 'promptsummaries'), []),
    categories: parse(coalesce('categories', 'category_scopes', 'categoryscopes'), []),
    customPrompt: coalesce('customPrompt', 'custom_prompt', 'customprompt') || '',
    categoryId: coalesce('categoryId', 'category_id', 'categoryid') || '',
    categoryLabel: coalesce('categoryLabel', 'category_label', 'categorylabel') || '',
    subcategoryId: coalesce('subcategoryId', 'subcategory_id', 'subcategoryid') || '',
    subcategoryLabel: coalesce('subcategoryLabel', 'subcategory_label', 'subcategorylabel') || '',
    title: coalesce('title') || '',
    coinsSpent: (() => {
      const value = coalesce('coinsSpent', 'coins_spent', 'coinsspent');
      if (value === null || value === undefined) {
        return null;
      }
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : null;
    })(),
  };

  normalized.creator = (() => {
    const raw = rawCreator || null;
    if (!raw) {
      return null;
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return {
          id: parsed?.id || null,
          name: parsed?.name || '',
        };
      } catch (_error) {
        return null;
      }
    }
    if (typeof raw === 'object') {
      return {
        id: raw.id || null,
        name: raw.name || '',
      };
    }
    return null;
  })();

  return normalized;
}

function mapSessionForSupabase(session) {
  if (!session) return session;
  const normalizeArray = (value) => (Array.isArray(value) ? value : []);
  const normalizeCreator = (value) => {
    if (!value || typeof value !== 'object') {
      return null;
    }
    return {
      id: value.id || null,
      name: value.name || '',
    };
  };

  return {
    ...session,
    userid: session.userId || session.userid || null,
    createdat: session.createdAt || session.createdat || null,
    sourceimage: typeof session.sourceImage === 'string' ? session.sourceImage : '',
    prompts: normalizeArray(session.prompts),
    generatedimages: normalizeArray(session.generatedImages),
    descriptions: normalizeArray(session.descriptions),
    promptsummaries: normalizeArray(session.promptSummaries),
    categories: normalizeArray(session.categories),
    creator: normalizeCreator(session.creator),
    customprompt: typeof session.customPrompt === 'string' ? session.customPrompt : '',
    categoryid: typeof session.categoryId === 'string' ? session.categoryId : '',
    categorylabel: typeof session.categoryLabel === 'string' ? session.categoryLabel : '',
    subcategoryid: typeof session.subcategoryId === 'string' ? session.subcategoryId : '',
    subcategorylabel: typeof session.subcategoryLabel === 'string' ? session.subcategoryLabel : '',
    title: typeof session.title === 'string' ? session.title : '',
    coinsspent:
      typeof session.coinsSpent === 'number' && Number.isFinite(session.coinsSpent)
        ? session.coinsSpent
        : session.coinsSpent === null || session.coinsSpent === undefined
        ? null
        : Number.parseInt(session.coinsSpent, 10) || null,
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
    const { data, error } = await supabaseClient.from(USERS_TABLE).select('*');
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

    const { error: upsertError } = await supabaseClient.from(USERS_TABLE).upsert(normalized, { onConflict: 'id' });
    if (upsertError) {
      console.error('Failed to upsert users to Supabase', upsertError);
      throw upsertError;
    }

    if (ids.length > 0) {
      const { data: existing, error: fetchError } = await supabaseClient.from(USERS_TABLE).select('id');
      if (fetchError) {
        console.error('Failed to fetch existing user ids from Supabase', fetchError);
        throw fetchError;
      }

      const staleIds = (existing || [])
        .map((row) => row.id)
        .filter((id) => !ids.includes(id));

      if (staleIds.length > 0) {
        const { error: deleteError } = await supabaseClient.from(USERS_TABLE).delete().in('id', staleIds);
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
    try {
      const { data, error } = await supabaseClient.from(SESSIONS_TABLE).select('*');
      if (error) {
        throw error;
      }

      const mapped = Array.isArray(data) ? data.map(mapSupabaseSession) : [];
      mapped.sort((a, b) => {
        const bStamp = Date.parse(b?.createdAt || '') || 0;
        const aStamp = Date.parse(a?.createdAt || '') || 0;
        return bStamp - aStamp;
      });
      return mapped;
    } catch (error) {
      console.error('Failed to fetch sessions from Supabase', error);
    }
  }

  await ensureDataFiles();
  return readJson(SESSIONS_FILE, []);
}

async function saveSessions(sessions) {
  if (supabaseClient) {
    try {
      const normalized = Array.isArray(sessions) ? sessions.map(mapSessionForSupabase) : [];
      const ids = normalized.map((session) => session.id);

      const { error: upsertError } = await supabaseClient.from(SESSIONS_TABLE).upsert(normalized, {
        onConflict: 'id',
      });
      if (upsertError) {
        throw upsertError;
      }

      if (ids.length > 0) {
        const { data: existing, error: fetchError } = await supabaseClient.from(SESSIONS_TABLE).select('id');
        if (fetchError) {
          throw fetchError;
        }

        const staleIds = (existing || [])
          .map((row) => row.id)
          .filter((id) => !ids.includes(id));

        if (staleIds.length > 0) {
          const { error: deleteError } = await supabaseClient.from(SESSIONS_TABLE).delete().in('id', staleIds);
          if (deleteError) {
            throw deleteError;
          }
        }
      }

      return;
    } catch (error) {
      console.error('Failed to save sessions to Supabase, falling back to local storage', error);
    }
  }

  await ensureDataFiles();
  await writeJson(SESSIONS_FILE, sessions);
}

module.exports = {
  getUsers,
  saveUsers,
  getSessions,
  saveSessions,
  mapSupabaseUser,
  mapUserForSupabase,
  mapSupabaseSession,
  mapSessionForSupabase,
  supabaseClient,
};
