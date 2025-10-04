# Security Setup Guide

Quick start guide to configure security features for your Product Generator application.

## Prerequisites
- Node.js installed
- Access to terminal/command line
- Basic understanding of environment variables

---

## Step 1: Generate Secure JWT Secret

### Option A: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Option B: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option C: Online Generator
Visit: https://www.grc.com/passwords.htm (use the 63 character password)

**Copy the generated secret** - you'll need it in the next step.

---

## Step 2: Configure Environment Variables

### Server Configuration

1. **Copy the example file:**
   ```bash
   cd ProductVariations/server
   cp .env.example .env
   ```

2. **Edit `.env` file** with these REQUIRED values:

   ```bash
   # REQUIRED: Your generated JWT secret (32+ characters)
   JWT_SECRET=<paste-your-generated-secret-here>

   # REQUIRED: Allowed origins for CORS
   # Development:
   CLIENT_ORIGIN=http://localhost:5173

   # Production (multiple origins separated by comma):
   # CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

   # REQUIRED: Set environment
   NODE_ENV=development
   ```

3. **Optional but recommended** - Add these if using:
   ```bash
   # Supabase (for production storage)
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-service-key

   # Stripe (for payments)
   STRIPE_SECRET_KEY=sk_test_...

   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

### Client Configuration

1. **Copy the example file:**
   ```bash
   cd ../client
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```bash
   # Point to your backend
   VITE_API_BASE_URL=http://localhost:5050

   # If using Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # If using Google OAuth
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

---

## Step 3: Verify Security Configuration

### Start the Server
```bash
cd ProductVariations/server
npm install
npm run dev
```

### Check for Security Confirmations

You should see output like:
```
API server starting...
Environment: development
CORS allowed origins: http://localhost:5173
Supabase: Using local storage
Stripe: Disabled
✓ API server listening on port 5050
✓ Security features: CORS, Helmet, Rate Limiting, Input Validation, XSS Protection
```

### ⚠️ If You See Errors:

**Error: "JWT_SECRET is not set or is using the default value"**
- Solution: Add a valid JWT_SECRET to your `.env` file

**Error: "JWT_SECRET must be at least 32 characters long"**
- Solution: Generate a longer secret (see Step 1)

**Error: "CLIENT_ORIGIN environment variable is not set"**
- Solution: Add CLIENT_ORIGIN to your `.env` file

---

## Step 4: Test Security Features

### Test 1: CORS Protection
```bash
# This should be BLOCKED
curl -H "Origin: https://malicious-site.com" \
     http://localhost:5050/api/public/gallery

# This should WORK
curl -H "Origin: http://localhost:5173" \
     http://localhost:5050/api/public/gallery
```

### Test 2: Input Validation
```bash
# This should FAIL with validation error
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'

# Should return: "Valid email is required" or "Password must be at least 8 characters"
```

### Test 3: Rate Limiting
```bash
# Run this script - after ~40 requests you should get rate limited
for i in {1..50}; do
  curl -X POST http://localhost:5050/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
  echo ""
done
```

### Test 4: File Upload Validation
```bash
# This should FAIL (wrong file type)
curl -X POST http://localhost:5050/api/generate-images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/document.pdf"

# Should return: "Invalid file type" error
```

---

## Step 5: Production Deployment Checklist

Before deploying to production:

### 1. Environment Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique JWT_SECRET (different from dev)
- [ ] Configure production CLIENT_ORIGIN(s)
- [ ] Set up Supabase for production storage
- [ ] Configure Stripe with production keys

### 2. HTTPS/SSL
- [ ] Enable HTTPS on your hosting platform
- [ ] Configure SSL certificates (Let's Encrypt recommended)
- [ ] Verify HSTS headers are working
- [ ] Test with: https://securityheaders.com

### 3. Security Headers
- [ ] Verify CSP is working correctly
- [ ] Test CORS with production domain
- [ ] Check security headers with Observatory

### 4. Monitoring
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure authentication event monitoring
- [ ] Set up alerts for failed login attempts
- [ ] Monitor rate limit violations

### 5. Secrets Management
- [ ] Use secret management service (AWS Secrets Manager, etc.)
- [ ] Never commit `.env` files to git
- [ ] Rotate secrets regularly
- [ ] Document secret rotation procedures

### 6. Testing
- [ ] Run security audit: `npm audit`
- [ ] Test all security features in staging
- [ ] Perform penetration testing
- [ ] Review and test incident response plan

---

## Step 6: Verify .gitignore

Ensure sensitive files are NOT committed to git:

```bash
# Check if .env is ignored
git check-ignore .env

# If not, add to .gitignore:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Remove from git if already committed:
git rm --cached .env
git commit -m "Remove .env from version control"
```

---

## Common Issues & Solutions

### Issue: "CORS error" in browser console
**Solution**:
- Ensure CLIENT_ORIGIN matches your frontend URL exactly
- Include protocol (http:// or https://)
- Check for trailing slashes

### Issue: "JWT malformed" error
**Solution**:
- Verify JWT_SECRET is set correctly
- Ensure it's the same secret that generated the token
- Check token hasn't expired (7 day default)

### Issue: Rate limiting too aggressive
**Solution**:
- Adjust limits in `server/src/index.js`:
  ```javascript
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Increase from 40
  });
  ```

### Issue: File uploads failing
**Solution**:
- Check file type is allowed (jpeg, png, webp, gif)
- Verify file size is under 10MB
- Ensure proper authorization header

---

## Security Maintenance

### Weekly
- [ ] Review authentication logs for suspicious activity
- [ ] Check for failed login patterns
- [ ] Monitor rate limit violations

### Monthly
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update dependencies: `npm update`
- [ ] Review security documentation

### Quarterly
- [ ] Rotate JWT_SECRET and other secrets
- [ ] Review and update security policies
- [ ] Conduct security training

### Annually
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review compliance requirements

---

## Getting Help

### Documentation
- Main security docs: [SECURITY.md](./SECURITY.md)
- API documentation: [API.md](./API.md) (if available)

### Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email security team directly
- Use responsible disclosure

### Community Support
- GitHub Discussions for general questions
- Stack Overflow for technical issues
- Discord/Slack community channels

---

## Quick Reference

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Check Security Headers
```bash
curl -I https://yourdomain.com
```

### Test CORS
```bash
curl -H "Origin: https://test.com" http://localhost:5050/health
```

### View Auth Logs
```bash
# Server logs show:
# [AUTH] timestamp - EVENT: { ip, email, success }
tail -f server-logs.txt | grep "\[AUTH\]"
```

### Environment Variables Summary
```bash
# REQUIRED
JWT_SECRET=<32+ characters>
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

# OPTIONAL
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
STRIPE_SECRET_KEY=
GOOGLE_CLIENT_ID=
```

---

**Setup Complete!** 🎉

Your application now has enterprise-grade security features enabled.

For ongoing security maintenance, refer to [SECURITY.md](./SECURITY.md)
