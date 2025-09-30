const { sanitizeUser, generateReferralCode } = require('../src/auth');

describe('sanitizeUser', () => {
  it('removes sensitive fields and normalizes defaults', () => {
    const sanitized = sanitizeUser({
      id: 'user-1',
      email: 'test@example.com',
      password: 'secret',
      coins: NaN,
      referrals: [{ id: 'ref-1' }, { id: 'ref-2' }],
      processedPayments: [{ id: 'payment-1' }],
      referralCode: '',
      referredBy: null,
      marketingOptIn: 0,
      privacyAcceptedAt: '',
    });

    expect(sanitized).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      coins: 0,
      referralCode: '',
      referredBy: null,
      referralCount: 2,
      marketingOptIn: false,
      privacyAcceptedAt: null,
    });
  });
});

describe('generateReferralCode', () => {
  afterEach(() => {
    if (typeof Math.random.mockRestore === 'function') {
      Math.random.mockRestore();
    }
  });

  it('generates an uppercase referral code that avoids duplicates', () => {
    const randomSpy = jest.spyOn(global.Math, 'random');
    const sequence = [
      // First attempt generates an existing code (all "A")
      ...Array(8).fill(0),
      // Second attempt generates a new code (all using 0.5)
      ...Array(8).fill(0.5),
    ];
    randomSpy.mockImplementation(() => {
      const next = sequence.shift();
      return typeof next === 'number' ? next : 0.75;
    });

    const existingUsers = [
      { referralCode: 'AAAAAAAA' },
      { referralCode: 'BBBBBBBB' },
    ];

    const code = generateReferralCode(existingUsers);

    expect(code).toHaveLength(8);
    expect(code).toEqual(code.toUpperCase());
    expect(code).not.toBe('AAAAAAAA');
    expect(code).not.toBe('BBBBBBBB');
  });
});
