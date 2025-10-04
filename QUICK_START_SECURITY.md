# 🚀 Quick Start - Security Configuration

**Time to complete**: ~5 minutes

---

## Step 1: Generate JWT Secret (1 min)

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copy the output** - you'll need it in the next step.

Example output: `NRiyq/HekMGdSRs0HpP5bJwh9V1NjtZl7zdFCV3UFbw=`

---

## Step 2: Create .env File (2 min)

### Server Configuration

```bash
cd ProductVariations/server
cp .env.example .env
```

Edit `ProductVariations/server/.env` and add:

```bash
# PASTE YOUR GENERATED SECRET HERE (from Step 1)
JWT_SECRET=YOUR_GENERATED_SECRET_HERE

# Your frontend URL
CLIENT_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development

# Optional: Add your API keys
OPENROUTER_API_KEY=sk-or-...
# STRIPE_SECRET_KEY=sk_test_...
# GOOGLE_CLIENT_ID=...
```

### Client Configuration (Optional)

```bash
cd ../client
cp .env.example .env
```

Edit `ProductVariations/client/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5050
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
# VITE_GOOGLE_CLIENT_ID=...
```

---

## Step 3: Install Dependencies (1 min)

```bash
cd ../server
npm install
```

---

## Step 4: Start Server (1 min)

```bash
npm run dev
```

### ✅ Success Indicators

You should see:

```
API server starting...
Environment: development
CORS allowed origins: http://localhost:5173
Supabase: Using local storage
Stripe: Disabled
✓ API server listening on port 5050
✓ Security features: CORS, Helmet, Rate Limiting, Input Validation, XSS Protection
```

### ❌ If You See Errors

**"JWT_SECRET is not set"**
- Go back to Step 1, generate a secret
- Add it to `.env` file

**"CLIENT_ORIGIN environment variable is not set"**
- Add `CLIENT_ORIGIN=http://localhost:5173` to `.env`

**"JWT_SECRET must be at least 32 characters"**
- Your secret is too short
- Use the command from Step 1 to generate a longer one

---

## Step 5: Test (Optional - 1 min)

### Test 1: CORS Protection
```bash
# Should be blocked
curl -H "Origin: https://bad-site.com" http://localhost:5050/health
```

### Test 2: Health Check
```bash
# Should work
curl http://localhost:5050/health
```

---

## 🎉 Done!

Your security features are now active:

- ✅ CORS protection
- ✅ Strong JWT authentication
- ✅ Input validation
- ✅ XSS protection
- ✅ File upload validation
- ✅ Security logging

---

## 📚 Next Steps

1. **Start Client**: `cd ../client && npm run dev`
2. **Read Full Docs**: [SECURITY.md](./SECURITY.md)
3. **Production Setup**: [SECURITY_SETUP.md](./SECURITY_SETUP.md) (when deploying)

---

## ⚠️ Important Security Notes

### DO ✅
- Keep `.env` file secret (never commit to git)
- Use different JWT_SECRET for dev/staging/production
- Enable HTTPS in production

### DON'T ❌
- Commit `.env` to version control
- Use the same secret in production as development
- Share secrets via email/chat

---

## 🆘 Need Help?

- **Setup Issues**: [SECURITY_SETUP.md](./SECURITY_SETUP.md)
- **Full Documentation**: [SECURITY.md](./SECURITY.md)
- **What Changed**: [SECURITY_IMPROVEMENTS_SUMMARY.md](./SECURITY_IMPROVEMENTS_SUMMARY.md)

---

## Production Deployment Checklist

Before going live:

- [ ] Generate NEW production JWT_SECRET (different from dev)
- [ ] Update CLIENT_ORIGIN to production domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Set up Supabase (optional)
- [ ] Test all features in staging
- [ ] Run `npm audit` and fix issues

See [SECURITY_SETUP.md](./SECURITY_SETUP.md) for complete deployment guide.

---

**Security Ready!** 🔒

Your app now has enterprise-grade security. Happy coding! 🚀
