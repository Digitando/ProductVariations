# 🚂 Railway Deployment - Troubleshooting Guide

## Your Current Issue

**Error**: `"An error occurred processing your request."`

This is the generic production error. Follow this guide to diagnose and fix it.

---

## 🔥 IMMEDIATE FIX - Step by Step

### Step 1: Enable Debug Mode (2 minutes)

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Select your project → Select your service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add:
   ```
   Name: DEBUG
   Value: true
   ```
6. Click **Add**
7. Service will redeploy automatically

### Step 2: Check Logs (1 minute)

1. Stay in Railway Dashboard
2. Click **Deployments** tab
3. Click on the latest deployment
4. Look for these sections in logs:

   **What to look for**:
   ```
   === SERVER STARTUP ===
   Environment: production
   Port: ...

   === CONFIGURATION ===
   CORS allowed origins: ...
   Supabase: ...
   OpenRouter API: ...
   JWT Secret: ...

   === ERROR HANDLER === (if there's an error)
   {
     "message": "...",
     "path": "...",
     ...
   }
   ```

### Step 3: View Diagnostics (1 minute)

Visit your diagnostics endpoint:
```
https://<your-railway-url>/api/diagnostics
```

This will show ALL your configuration. Look for what's missing or wrong.

---

## 🎯 Common Railway Issues & Fixes

### Issue #1: CORS Error ⚠️

**Symptoms**:
- Works on Railway, fails in browser
- Console shows: `"Access to fetch... has been blocked by CORS"`
- Error mentions "origin"

**Fix**:
1. Go to Railway → Variables
2. Find `CLIENT_ORIGIN`
3. Make sure it matches your frontend EXACTLY:

   **✅ Correct**:
   ```
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   ```

   **❌ Wrong**:
   ```
   CLIENT_ORIGIN=https://your-frontend.vercel.app/
   # (no trailing slash!)

   CLIENT_ORIGIN=your-frontend.vercel.app
   # (missing https://!)
   ```

4. For multiple frontends:
   ```
   CLIENT_ORIGIN=https://app.com,https://www.app.com
   ```

### Issue #2: JWT Secret Missing ⚠️

**Symptoms**:
- Logs show: `"JWT_SECRET is not set"`
- App crashes on startup
- Authentication fails

**Fix**:
1. Generate a secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. Go to Railway → Variables
3. Add:
   ```
   Name: JWT_SECRET
   Value: <paste-generated-secret>
   ```

**Important**: Use a DIFFERENT secret than development!

### Issue #3: Missing API Key ⚠️

**Symptoms**:
- Image generation fails
- Logs show: `OpenRouter API: ✗ Missing`

**Fix**:
1. Go to Railway → Variables
2. Add:
   ```
   Name: OPENROUTER_API_KEY
   Value: sk-or-v1-your-key-here
   ```

### Issue #4: Database Not Connecting ⚠️

**Symptoms**:
- Sessions don't save
- User registration fails
- Logs show: `Supabase: ⚠ Using local storage`

**Fix**:
1. Get Supabase credentials from: https://supabase.com
   - Go to Project Settings → API
   - Copy URL and service_role key

2. Go to Railway → Variables
3. Add both:
   ```
   Name: SUPABASE_URL
   Value: https://xxxxx.supabase.co

   Name: SUPABASE_SERVICE_KEY
   Value: eyJhbGc... (the service_role key)
   ```

### Issue #5: Build Fails ⚠️

**Symptoms**:
- Deployment fails during build
- Logs show: `Build failed`

**Fix**:
1. Check Railway logs for specific error
2. Common causes:
   - Missing dependencies: Update package.json
   - Node version mismatch: Add to package.json:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```
   - Build script failing: Check `npm run build` locally

### Issue #6: Port Binding Error ⚠️

**Symptoms**:
- Logs show: `EADDRINUSE` or port already in use
- App crashes after "listening on port"

**Fix**:
Railway automatically sets PORT. Don't override it.

1. Railway → Variables
2. Make sure PORT is NOT set, OR set to:
   ```
   PORT=${{PORT}}
   ```

---

## 🔍 Advanced Debugging

### View Full Configuration

With DEBUG=true enabled:

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/api/diagnostics
```

**What to check**:
```json
{
  "server": {
    "status": "running",  // ✓ Good
    "environment": "production",  // ✓ Good
    "port": 5050  // Should match Railway's PORT
  },
  "configuration": {
    "supabase": true,  // Should be true for production
    "stripe": true,  // If using payments
    "openrouter": true,  // ✓ Required for images
    "jwtConfigured": true,  // ✓ Required
    "jwtSecretLength": 44,  // Should be 32+
    "corsOrigins": ["https://..."]  // Should match your frontend
  }
}
```

### Check Railway Environment

Railway sets these automatically:
- `PORT` - Don't override!
- `RAILWAY_ENVIRONMENT` - Should be "production"
- `RAILWAY_SERVICE_NAME` - Your service name

To see them:
```bash
railway run env
```

### Test Endpoints

```bash
# Health check (should always work)
curl https://your-app.railway.app/health

# Should return:
{
  "status": "ok",
  "timestamp": "2025-10-05T...",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## ✅ Complete Variable Checklist

Go to Railway → Variables and verify:

### Required ✓
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = (32+ characters, unique)
- [ ] `CLIENT_ORIGIN` = `https://your-frontend.com`
- [ ] `OPENROUTER_API_KEY` = `sk-or-v1-...`

### Recommended ✓
- [ ] `SUPABASE_URL` = `https://xxx.supabase.co`
- [ ] `SUPABASE_SERVICE_KEY` = `eyJ...`
- [ ] `STRIPE_SECRET_KEY` = `sk_live_...` (if using payments)

### Optional ✓
- [ ] `GOOGLE_CLIENT_ID` = (if using Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` = (if using Google OAuth)
- [ ] `DEBUG` = `true` (ONLY for debugging, remove after!)

### Auto-Set by Railway (Don't Touch!) ✓
- [ ] `PORT` - Automatically set
- [ ] `RAILWAY_ENVIRONMENT` - Automatically set
- [ ] `RAILWAY_SERVICE_NAME` - Automatically set

---

## 🚨 Emergency Procedures

### App is Down

1. **Check Railway Status**: https://railway.app/status
2. **View Logs**: Railway Dashboard → Deployments → Logs
3. **Restart Service**: Railway Dashboard → Settings → Restart

### Can't Access Logs

1. Use Railway CLI:
   ```bash
   railway logs
   ```

2. Or SSH into container:
   ```bash
   railway run bash
   ```

### Need to Rollback

1. Go to Railway Dashboard
2. Click **Deployments**
3. Find working deployment
4. Click **⋯** → **Redeploy**

---

## 📋 Step-by-Step Deployment (Fresh Start)

If you want to start over:

### 1. Prepare Locally

```bash
cd "Product generator/ProductVariations"

# Test build
npm run build

# Make sure it works
npm start
```

### 2. Set Up Railway

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project (if exists) or create new
railway link
# OR
railway init
```

### 3. Configure Variables

```bash
# Required
railway variables set NODE_ENV=production
railway variables set CLIENT_ORIGIN=https://your-frontend.com
railway variables set OPENROUTER_API_KEY=sk-or-v1-...

# Generate and set JWT secret
railway variables set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# Optional - Supabase
railway variables set SUPABASE_URL=https://xxx.supabase.co
railway variables set SUPABASE_SERVICE_KEY=eyJ...

# Optional - Stripe
railway variables set STRIPE_SECRET_KEY=sk_live_...
```

### 4. Deploy

```bash
railway up
```

### 5. Verify

```bash
# Get URL
railway open

# Check health
curl $(railway url)/health

# View logs
railway logs
```

---

## 🎯 Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Generic error | Add `DEBUG=true` in Variables |
| CORS error | Check `CLIENT_ORIGIN` matches exactly |
| JWT error | Generate new `JWT_SECRET` |
| No images | Add `OPENROUTER_API_KEY` |
| Sessions lost | Add `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` |
| Build fails | Check logs, fix package.json |
| Port error | Don't set PORT manually |

---

## 📞 Still Stuck?

### 1. Enable Full Logging

```bash
railway variables set DEBUG=true
railway variables set SHOW_ERRORS=true
```

### 2. Get Diagnostics

```bash
curl https://your-app.railway.app/api/diagnostics > diagnostics.json
cat diagnostics.json
```

### 3. Share This Info

When asking for help, include:
- Railway logs (last 50 lines)
- Diagnostics output
- List of environment variables (remove sensitive values!)
- Error message from browser console

### 4. Contact Railway Support

- Dashboard → Help → Contact Support
- Include deployment ID and error logs

---

## 🔒 Security Reminder

**After fixing your issue**:

1. **Remove debug flags**:
   ```bash
   railway variables delete DEBUG
   railway variables delete SHOW_ERRORS
   ```

2. **Verify**:
   ```bash
   curl https://your-app.railway.app/api/diagnostics
   # Should return 403 Forbidden
   ```

3. **Check secrets**:
   - JWT_SECRET is strong and unique
   - Using `sk_live_` Stripe keys (not `sk_test_`)
   - CLIENT_ORIGIN is your actual domain

---

**Good luck! Your app should be running soon.** 🚀

---

**Last Updated**: October 2025
**Railway Version**: Latest
**Status**: ✅ Tested
