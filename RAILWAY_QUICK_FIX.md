# 🚂 Railway Quick Fix - 5 Minutes

## Your Error: FIXED ✅

**Error**: `"Cannot set property query of #<IncomingMessage> which has only a getter"`

**Root Cause**: Express 5 incompatibility
**Solution**: Downgraded to Express 4 ✓

---

## Deploy the Fix Now

### Step 1: Push Code (30 seconds)

```bash
git add .
git commit -m "fix: Express v4 compatibility + production optimizations"
git push
```

Railway auto-deploys! ✨

### Step 2: Set Required Variables (2 minutes)

Go to: **Railway Dashboard → Your Service → Variables**

Add these (copy & paste):

```bash
NODE_ENV=production
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy output and add:
```bash
JWT_SECRET=<paste-the-output-here>
```

Add your frontend URL (exact match!):
```bash
CLIENT_ORIGIN=https://your-frontend-url.com
```

Add your API key:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key
```

### Step 3: Verify (30 seconds)

Wait for deployment to finish...

Then test:
```bash
curl https://your-app.railway.app/health
```

**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

✅ **Done!** Your app is live!

---

## Optional: Enable Supabase (Database)

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

Get from: https://supabase.com → Project → Settings → API

---

## Optional: Enable Payments

```bash
STRIPE_SECRET_KEY=sk_live_...
```

**Important**: Use `sk_live_` for production, not `sk_test_`!

---

## Troubleshooting

### Still seeing errors?

**Enable debug mode** (temporarily):

Railway Variables → Add:
```bash
DEBUG=true
```

Then visit:
```
https://your-app.railway.app/api/diagnostics
```

This shows all configuration. Look for what's missing.

**Important**: Remove DEBUG=true after fixing!

---

## Common Issues

### "CORS error" in browser

**Fix**: CLIENT_ORIGIN must match EXACTLY
```bash
# ✅ Correct
CLIENT_ORIGIN=https://app.vercel.app

# ❌ Wrong
CLIENT_ORIGIN=https://app.vercel.app/  # No trailing slash!
CLIENT_ORIGIN=app.vercel.app  # Missing https://!
```

### "JWT_SECRET is not set"

**Fix**: Generate and add JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copy output to Railway Variables
```

### Images don't generate

**Fix**: Add OPENROUTER_API_KEY
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## Complete Variable List

### Minimal (App works):
- `NODE_ENV=production`
- `JWT_SECRET=<32+ chars>`
- `CLIENT_ORIGIN=<frontend-url>`
- `OPENROUTER_API_KEY=<key>`

### Full Production:
- All above ↑
- `SUPABASE_URL=<url>`
- `SUPABASE_SERVICE_KEY=<key>`
- `STRIPE_SECRET_KEY=sk_live_...`
- `GOOGLE_CLIENT_ID=<id>` (optional)
- `GOOGLE_CLIENT_SECRET=<secret>` (optional)

---

## View Logs

Railway Dashboard → Deployments → Latest → **Logs**

Look for:
```
=== SERVER STARTUP ===
✅ SERVER READY
✓ Listening on port 5050
```

---

## Files to Help You

- `DEPLOYMENT_COMPLETE.md` - Full summary
- `RAILWAY_TROUBLESHOOTING.md` - Detailed Railway guide
- `EXPRESS_5_FIX.md` - Express fix details
- `PRODUCTION_DEPLOYMENT.md` - Complete deployment guide

---

## That's It!

Your app should be running now. 🎉

**If you still have issues**, check `RAILWAY_TROUBLESHOOTING.md` for detailed help.

---

**Fixed**: October 2025
**Time to Deploy**: 5 minutes
**Status**: ✅ Ready
