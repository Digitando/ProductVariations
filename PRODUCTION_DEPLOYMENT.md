# 🚀 Production Deployment Guide

Complete guide for deploying your Product Generator application to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Diagnosing Railway Error](#diagnosing-railway-error)
3. [Railway Deployment](#railway-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Other Platforms](#other-platforms)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔍 Diagnosing Railway Error

### Your Current Error

You're seeing: `error: "An error occurred processing your request."`

This is the generic production error message. Here's how to diagnose it:

### Step 1: Enable Debug Mode (Temporarily)

Add these environment variables in Railway:

```bash
DEBUG=true
# OR
SHOW_ERRORS=true
```

**This will expose detailed error messages. Remove after debugging!**

### Step 2: Check Railway Logs

1. Go to your Railway project
2. Click on your service
3. Go to "Deployments" tab
4. Click on latest deployment
5. View logs

Look for:
- `=== SERVER STARTUP ===` section
- `=== CONFIGURATION ===` section
- `=== ERROR HANDLER ===` entries
- Any `UNCAUGHT EXCEPTION` or `UNHANDLED REJECTION` messages

### Step 3: Use Diagnostics Endpoint

With DEBUG=true enabled, visit:
```
https://your-app.railway.app/api/diagnostics
```

This will show your complete server configuration.

### Common Issues & Fixes

#### Issue 1: CORS Error
**Symptom**: `"Not allowed by CORS"` in browser console

**Fix**: Ensure `CLIENT_ORIGIN` in Railway includes your frontend URL:
```bash
CLIENT_ORIGIN=https://your-frontend.vercel.app
# For multiple origins:
CLIENT_ORIGIN=https://domain1.com,https://domain2.com
```

#### Issue 2: JWT Error
**Symptom**: `"JWT_SECRET is not set"` in logs

**Fix**: Ensure JWT_SECRET is set in Railway:
```bash
JWT_SECRET=<your-32-char-secret>
```

#### Issue 3: Missing API Key
**Symptom**: Image generation fails

**Fix**: Set OPENROUTER_API_KEY:
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

#### Issue 4: Database Connection
**Symptom**: Sessions not saving

**Fix**: Configure Supabase:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

---

## 📦 Pre-Deployment Checklist

### Required Environment Variables

✅ **Critical (App won't start without these)**:
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` (32+ characters, different from dev)
- [ ] `CLIENT_ORIGIN` (your frontend URL)
- [ ] `OPENROUTER_API_KEY` (for image generation)

✅ **Highly Recommended**:
- [ ] `SUPABASE_URL` (for production database)
- [ ] `SUPABASE_SERVICE_KEY` (for production database)
- [ ] `STRIPE_SECRET_KEY` (for payments, use sk_live_)

✅ **Optional**:
- [ ] `GOOGLE_CLIENT_ID` (for OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` (for OAuth)
- [ ] `PORT` (usually auto-set by platform)

### Security Checklist

- [ ] Strong JWT_SECRET generated (not "change-me")
- [ ] HTTPS enabled on your domain
- [ ] CLIENT_ORIGIN set to actual production domain(s)
- [ ] Using production API keys (not test keys)
- [ ] DEBUG=false and SHOW_ERRORS=false
- [ ] `.env` files not committed to git
- [ ] Different secrets for dev/staging/production

### Build Checklist

- [ ] `npm run build` works locally
- [ ] Client builds successfully
- [ ] No console errors in production build
- [ ] Dependencies up to date (`npm audit`)

---

## 🚂 Railway Deployment

### Method 1: Quick Fix (Your Current Deployment)

1. **Check Current Variables**
   Go to Railway → Your Service → Variables tab

2. **Verify Required Variables Are Set**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=<your-secret>
   CLIENT_ORIGIN=<your-frontend-url>
   OPENROUTER_API_KEY=<your-key>
   ```

3. **Add Debug Flag (Temporarily)**:
   ```bash
   DEBUG=true
   ```

4. **Redeploy**
   Railway will auto-redeploy. Check logs for detailed errors.

5. **View Diagnostics**:
   ```bash
   curl https://your-app.railway.app/api/diagnostics
   ```

6. **Remove Debug Flag**
   Once issue is found and fixed, remove DEBUG=true

### Method 2: Fresh Railway Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**:
   ```bash
   cd "ProductVariations"
   railway init
   ```

3. **Set Environment Variables**:
   ```bash
   # Required
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
   railway variables set CLIENT_ORIGIN=https://your-frontend.com
   railway variables set OPENROUTER_API_KEY=sk-or-...

   # Recommended
   railway variables set SUPABASE_URL=https://...
   railway variables set SUPABASE_SERVICE_KEY=eyJ...
   railway variables set STRIPE_SECRET_KEY=sk_live_...

   # Optional
   railway variables set GOOGLE_CLIENT_ID=...
   railway variables set GOOGLE_CLIENT_SECRET=...
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Check Deployment**:
   ```bash
   railway logs
   railway open
   ```

### Railway Configuration Files

The following files are included for Railway:

- `railway.json` - Railway service configuration
- `.railwayignore` - Files to exclude from deployment

---

## 🐳 Docker Deployment

### Local Docker Build

1. **Create .env file**:
   ```bash
   cp server/.env.production.template .env.production
   # Edit .env.production with your values
   ```

2. **Build Image**:
   ```bash
   docker build -t product-generator .
   ```

3. **Run Container**:
   ```bash
   docker run -p 5050:5050 --env-file .env.production product-generator
   ```

4. **Or Use Docker Compose**:
   ```bash
   # Copy and configure environment
   cp server/.env.production.template .env

   # Start with docker-compose
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop
   docker-compose down
   ```

### Production Docker Deployment

#### AWS ECS / Fargate

1. **Build and push to ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t product-generator .
   docker tag product-generator:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/product-generator:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/product-generator:latest
   ```

2. **Create ECS Task Definition** with environment variables

3. **Deploy to ECS Service**

#### Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/product-generator
gcloud run deploy product-generator \
  --image gcr.io/PROJECT-ID/product-generator \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,JWT_SECRET=...,CLIENT_ORIGIN=...
```

#### Azure Container Apps

```bash
az containerapp create \
  --name product-generator \
  --resource-group myResourceGroup \
  --image <your-registry>/product-generator:latest \
  --environment myEnvironment \
  --ingress external \
  --target-port 5050 \
  --env-vars NODE_ENV=production JWT_SECRET=... CLIENT_ORIGIN=...
```

---

## 🌐 Other Platforms

### Render

1. **Create New Web Service**
2. **Connect GitHub repo**
3. **Configure**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Environment Variables**: Add all required vars
5. **Deploy**

### Vercel (API Routes + Frontend)

**Note**: Vercel is better for frontend. Use Railway/Render for backend.

If using Vercel for backend:
1. Add `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server/src/index.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "server/src/index.js" }
     ]
   }
   ```
2. Deploy: `vercel --prod`

### Heroku

1. **Create app**:
   ```bash
   heroku create product-generator
   ```

2. **Set buildpack**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=...
   heroku config:set CLIENT_ORIGIN=...
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

### Fly.io

1. **Install flyctl**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Launch app**:
   ```bash
   flyctl launch
   ```

3. **Set secrets**:
   ```bash
   flyctl secrets set JWT_SECRET=... CLIENT_ORIGIN=...
   ```

4. **Deploy**:
   ```bash
   flyctl deploy
   ```

---

## ✅ Post-Deployment

### 1. Verify Deployment

```bash
# Health check
curl https://your-app.com/health

# Should return:
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

### 2. Test API Endpoints

```bash
# Test CORS (should work from allowed origin)
curl -H "Origin: https://your-frontend.com" https://your-app.com/api/public/gallery

# Test authentication
curl -X POST https://your-app.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'
```

### 3. Monitor Logs

Set up log monitoring:
- Railway: Built-in logs
- Docker: `docker logs -f <container>`
- Cloud platforms: Use their logging services

### 4. Set Up Alerts

Configure alerts for:
- Server downtime
- High error rates
- Failed authentication attempts
- Memory/CPU usage

### 5. Performance Monitoring

Consider adding:
- **Sentry** for error tracking
- **New Relic** or **Datadog** for APM
- **LogRocket** for session replay

### 6. Disable Debug Mode

**Important**: Remove debug flags:
```bash
# Remove these from production
DEBUG=false
SHOW_ERRORS=false
```

---

## 🔧 Troubleshooting

### Server Won't Start

1. **Check logs for startup errors**:
   ```
   === SERVER STARTUP ===
   ```

2. **Verify all required env vars are set**

3. **Check for UNCAUGHT EXCEPTION messages**

### CORS Errors

1. **Verify CLIENT_ORIGIN matches exactly**:
   - Include protocol: `https://` not just `domain.com`
   - No trailing slash
   - Case-sensitive

2. **For multiple origins**:
   ```bash
   CLIENT_ORIGIN=https://app.com,https://www.app.com
   ```

### Database Issues

1. **Check Supabase connection**:
   - Verify SUPABASE_URL is correct
   - Verify SUPABASE_SERVICE_KEY (not anon key!)
   - Check Supabase project is active

2. **Test connection**:
   ```bash
   curl https://your-app.com/api/diagnostics
   # Look for: "supabase": true
   ```

### Payment Issues

1. **Verify Stripe key**:
   - Production: Use `sk_live_...`
   - Test: Use `sk_test_...`

2. **Check Stripe webhook**:
   - Configure webhook URL in Stripe dashboard
   - Add webhook secret to env vars

### Performance Issues

1. **Enable compression** ✅ (Already added)
2. **Use CDN** for static files
3. **Configure caching** ✅ (Already added)
4. **Optimize images** ✅ (Using Sharp)
5. **Scale horizontally** (add more instances)

### Memory Leaks

1. **Monitor memory usage**:
   ```bash
   curl https://your-app.com/api/diagnostics
   # Look at memory.heapUsed
   ```

2. **Restart policy**: Ensure auto-restart on crash

3. **Check for unclosed connections**

---

## 📊 Monitoring Dashboard

### Health Check Endpoints

| Endpoint | Purpose | Auth Required |
|----------|---------|---------------|
| `/health` | Basic health check | No |
| `/api/diagnostics` | Detailed diagnostics | Only if DEBUG=true |

### Key Metrics to Monitor

- **Uptime**: Track server availability
- **Response Time**: API latency
- **Error Rate**: Failed requests
- **Memory Usage**: Heap size
- **CPU Usage**: Processing load
- **Request Rate**: Traffic patterns

---

## 🔐 Security Best Practices

### In Production

✅ **DO**:
- Use HTTPS everywhere
- Set NODE_ENV=production
- Use strong, unique secrets
- Enable HSTS headers ✅ (Already configured)
- Monitor failed login attempts ✅ (Already logging)
- Keep dependencies updated
- Use environment variables for secrets

❌ **DON'T**:
- Commit .env files
- Use DEBUG=true in production
- Use test API keys
- Expose stack traces
- Use weak JWT secrets
- Allow wildcard CORS

---

## 📞 Support

### Getting Help

1. **Check logs first**: Most issues show up in logs
2. **Use diagnostics endpoint**: Enable DEBUG temporarily
3. **Review this guide**: Common issues are covered
4. **Check platform docs**:
   - [Railway Docs](https://docs.railway.app)
   - [Docker Docs](https://docs.docker.com)
   - [Vercel Docs](https://vercel.com/docs)

### Emergency Rollback

If deployment fails:

**Railway**:
```bash
railway rollback
```

**Docker**:
```bash
docker-compose down
docker-compose up -d <previous-tag>
```

**Git-based platforms**:
```bash
git revert HEAD
git push
```

---

## 🎯 Quick Reference

### Generate Secrets
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Required Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=<32+ chars>
CLIENT_ORIGIN=<frontend-url>
OPENROUTER_API_KEY=<api-key>
```

### Deployment Commands
```bash
# Railway
railway up

# Docker
docker-compose up -d

# Heroku
git push heroku main

# Fly.io
flyctl deploy
```

### Health Checks
```bash
# Basic
curl https://your-app.com/health

# Detailed (with DEBUG=true)
curl https://your-app.com/api/diagnostics
```

---

**Last Updated**: October 2025
**Version**: 2.0
**Deployment Status**: ✅ Production Ready
