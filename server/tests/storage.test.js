const {
  mapSupabaseUser,
  mapUserForSupabase,
  mapSupabaseSession,
  mapSessionForSupabase,
} = require('../src/storage');

describe('mapSupabaseUser', () => {
  it('normalizes Supabase rows into application user objects', () => {
    const mapped = mapSupabaseUser({
      id: 'user-123',
      email: 'user@example.com',
      referrals: '[{"userId":"abc"}]',
      processedPayments: '[]',
      marketingOptIn: 'TRUE',
      marketingoptin: undefined,
      privacyAcceptedAt: null,
    });

    expect(mapped).toMatchObject({
      id: 'user-123',
      email: 'user@example.com',
      referrals: [{ userId: 'abc' }],
      processedPayments: [],
      marketingOptIn: true,
      privacyAcceptedAt: null,
    });
  });
});

describe('mapUserForSupabase', () => {
  it('serializes user records for Supabase persistence', () => {
    const mapped = mapUserForSupabase({
      id: 'user-456',
      email: 'user@example.com',
      referrals: null,
      processedPayments: null,
      marketingOptIn: 'false',
      privacyAcceptedAt: undefined,
    });

    expect(mapped).toMatchObject({
      id: 'user-456',
      email: 'user@example.com',
      referrals: [],
      processedPayments: [],
      marketingOptIn: false,
      privacyAcceptedAt: null,
    });
  });

  it('interprets string representations of booleans consistently', () => {
    expect(mapUserForSupabase({ marketingOptIn: 'true' }).marketingOptIn).toBe(true);
    expect(mapUserForSupabase({ marketingOptIn: 'false' }).marketingOptIn).toBe(false);
  });
});

describe('mapSupabaseSession', () => {
  it('normalizes stringified properties and nested creator data', () => {
    const mapped = mapSupabaseSession({
      id: 'session-1',
      prompts: '["p-1"]',
      generatedImages: '["img-1"]',
      descriptions: '["desc-1"]',
      promptSummaries: '["summary-1"]',
      categories: '["category-1"]',
      creator: '{"id":"user-1","name":"Jane"}',
    });

    expect(mapped).toMatchObject({
      id: 'session-1',
      prompts: ['p-1'],
      generatedImages: ['img-1'],
      descriptions: ['desc-1'],
      promptSummaries: ['summary-1'],
      categories: ['category-1'],
      creator: { id: 'user-1', name: 'Jane' },
    });
  });

  it('maps snake_case columns from Supabase responses', () => {
    const mapped = mapSupabaseSession({
      session_id: 'session-3',
      user_id: 'user-9',
      created_at: '2024-01-01T00:00:00.000Z',
      prompts: '["p-9"]',
      generated_images: '["img-9"]',
      description_entries: '["desc-9"]',
      prompt_summaries: '["summary-9"]',
      category_scopes: '["apparel"]',
      source_image: 'https://example.com/source.png',
      creator_info: '{"id":"user-9","name":"Casey"}',
    });

    expect(mapped).toMatchObject({
      id: 'session-3',
      userId: 'user-9',
      createdAt: '2024-01-01T00:00:00.000Z',
      generatedImages: ['img-9'],
      descriptions: ['desc-9'],
      promptSummaries: ['summary-9'],
      categories: ['apparel'],
      sourceImage: 'https://example.com/source.png',
      creator: { id: 'user-9', name: 'Casey' },
    });
  });

  it('handles lowercase Postgres column names', () => {
    const mapped = mapSupabaseSession({
      sessionid: 'session-4',
      userid: 'user-10',
      createdat: '2024-02-02T00:00:00.000Z',
      prompts: '["p-10"]',
      generatedimages: '["img-10"]',
      description_entries: '["desc-10"]',
      promptsummaries: '["summary-10"]',
      categoryscopes: '["footwear"]',
      sourceimage: 'https://example.com/source-footwear.png',
      creatorinfo: '{"id":"user-10"}',
    });

    expect(mapped).toMatchObject({
      id: 'session-4',
      userId: 'user-10',
      createdAt: '2024-02-02T00:00:00.000Z',
      prompts: ['p-10'],
      generatedImages: ['img-10'],
      descriptions: ['desc-10'],
      promptSummaries: ['summary-10'],
      categories: ['footwear'],
      sourceImage: 'https://example.com/source-footwear.png',
      creator: { id: 'user-10', name: '' },
    });
  });
});

describe('mapSessionForSupabase', () => {
  it('serializes session records with sane defaults', () => {
    const mapped = mapSessionForSupabase({
      id: 'session-2',
      prompts: null,
      generatedImages: null,
      descriptions: null,
      promptSummaries: null,
      categories: null,
      creator: { id: 'user-2' },
    });

    expect(mapped).toEqual({
      id: 'session-2',
      prompts: [],
      generatedImages: [],
      descriptions: [],
      promptSummaries: [],
      categories: [],
      userId: null,
      createdAt: null,
      sourceImage: '',
      creator: { id: 'user-2', name: '' },
    });
  });
});
