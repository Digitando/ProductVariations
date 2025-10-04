# Security Implementation Guide

This document outlines the security measures implemented in the Product Generator application and provides guidance for maintaining security.

## Table of Contents
1. [Security Features](#security-features)
2. [Configuration Requirements](#configuration-requirements)
3. [Security Best Practices](#security-best-practices)
4. [Monitoring & Logging](#monitoring--logging)
5. [Known Limitations](#known-limitations)

---

## Security Features

### 1. Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Password hashing** using bcrypt (10 salt rounds)
- **Google OAuth** integration for third-party authentication
- **Minimum password length**: 8 characters (enforced at registration)
- **JWT secret validation**: Enforces 32+ character secrets on startup
- **Token expiry**: 7 days (configurable in `auth.js`)

### 2. Input Validation & Sanitization
- **express-validator** for comprehensive input validation
- **XSS protection** using the `xss` library on all user inputs
- **NoSQL injection prevention** via express-mongo-sanitize
- **Email normalization** and validation
- **File upload validation**: MIME type and extension checking

### 3. Security Headers
- **Helmet.js** configured with:
  - Content Security Policy (CSP)
  - HSTS (HTTP Strict Transport Security)
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection

### 4. CORS Protection
- **Strict origin validation** (no wildcard `*` allowed)
- **Whitelisted origins** from environment variables
- **Credentials support** enabled for authenticated requests
- **Method restrictions**: GET, POST, PUT, DELETE, OPTIONS only

### 5. Rate Limiting
- **Authentication endpoints**: 40 requests per 15 minutes
- **API endpoints**: 200 requests per minute
- Helps prevent brute force attacks and DoS

### 6. File Upload Security
- **File size limit**: 10MB maximum
- **MIME type validation**: Only allows image types (jpeg, png, webp, gif)
- **Extension validation**: Verifies file extensions match MIME types
- **Image processing** with Sharp (helps prevent malicious image exploits)

### 7. Error Handling
- **Production mode**: Generic error messages (no stack traces)
- **Development mode**: Detailed errors for debugging
- **Centralized error logging** with timestamps and request details

### 8. Security Logging
- **Authentication events**: Login, registration, and failures
- **IP address logging** for all auth attempts
- **Timestamp tracking** for security audits
- **Failed attempt monitoring** for anomaly detection

---

## Configuration Requirements

### Required Environment Variables

#### 1. JWT_SECRET (CRITICAL)
```bash
# Generate a secure secret:
openssl rand -base64 32

# Add to .env:
JWT_SECRET=<your-generated-secret>
```
- **MUST be at least 32 characters**
- **NEVER use 'change-me'**
- Server will refuse to start without a valid secret

#### 2. CLIENT_ORIGIN (CRITICAL)
```bash
# Development:
CLIENT_ORIGIN=http://localhost:5173

# Production (multiple origins):
CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```
- **REQUIRED** - Server will refuse to start without this
- **NEVER use '*'** - defeats security measures
- Comma-separated for multiple allowed origins

#### 3. NODE_ENV (IMPORTANT)
```bash
# Production:
NODE_ENV=production

# Development:
NODE_ENV=development
```
- Controls error verbosity
- Enables/disables CSP upgrade-insecure-requests

### Optional but Recommended
- `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` for production storage
- `STRIPE_SECRET_KEY` for payment processing
- `GOOGLE_CLIENT_ID` for OAuth

---

## Security Best Practices

### 1. Environment Variables
- ✅ **DO**: Use `.env` file for secrets (never commit)
- ✅ **DO**: Generate strong, random JWT secrets
- ✅ **DO**: Use different secrets for dev/staging/prod
- ❌ **DON'T**: Commit `.env` to version control
- ❌ **DON'T**: Share secrets via email or chat

### 2. HTTPS/TLS
- ✅ **DO**: Use HTTPS in production (TLS 1.2+)
- ✅ **DO**: Configure HSTS headers (already enabled)
- ✅ **DO**: Use secure cookies in production
- ❌ **DON'T**: Allow HTTP in production

### 3. Authentication
- ✅ **DO**: Implement password complexity requirements
- ✅ **DO**: Monitor failed login attempts
- ✅ **DO**: Consider implementing account lockout after N failed attempts
- ❌ **DON'T**: Store passwords in plain text
- ❌ **DON'T**: Log passwords or tokens

### 4. File Uploads
- ✅ **DO**: Validate MIME types and extensions
- ✅ **DO**: Use virus scanning for production (not yet implemented)
- ✅ **DO**: Store uploads outside webroot when possible
- ❌ **DON'T**: Trust user-supplied filenames
- ❌ **DON'T**: Allow executable file uploads

### 5. Dependencies
- ✅ **DO**: Run `npm audit` regularly
- ✅ **DO**: Keep dependencies updated
- ✅ **DO**: Review security advisories
- ❌ **DON'T**: Use deprecated packages (if possible)

### 6. Database Security (Supabase)
- ✅ **DO**: Use Row Level Security (RLS) policies
- ✅ **DO**: Use service key only on backend
- ✅ **DO**: Validate all database inputs
- ❌ **DON'T**: Expose service keys to frontend
- ❌ **DON'T**: Trust user input in queries

---

## Monitoring & Logging

### Authentication Events
The server logs all authentication events with:
- Event type (LOGIN, REGISTRATION, FAILED attempts)
- IP address
- Email (sanitized)
- Timestamp
- Success/failure status

Example log format:
```
[AUTH] 2025-10-05T12:34:56.789Z - LOGIN_FAILED: {
  ip: '192.168.1.100',
  email: 'user@example.com',
  success: false,
  error: 'Invalid email or password.'
}
```

### Security Monitoring Checklist
- [ ] Monitor failed authentication attempts
- [ ] Set up alerts for unusual activity patterns
- [ ] Review logs regularly for suspicious IPs
- [ ] Track rate limit violations
- [ ] Monitor file upload patterns

### Recommended Tools
- **Log aggregation**: Consider ELK Stack, Datadog, or CloudWatch
- **Security scanning**: Snyk, npm audit, Dependabot
- **Runtime protection**: Consider adding fail2ban for IP blocking

---

## Known Limitations & Future Improvements

### Current Limitations
1. **No CSRF token implementation** - Relying on CORS + JWT
2. **No session revocation** - JWT tokens can't be invalidated server-side
3. **No virus scanning** on uploaded files
4. **Local storage fallback** - Less secure than database storage
5. **Client-side token storage** - localStorage is vulnerable to XSS

### Recommended Future Enhancements

#### High Priority
- [ ] Implement JWT refresh tokens and blacklisting
- [ ] Add CSRF protection for state-changing operations
- [ ] Move token storage to httpOnly cookies
- [ ] Implement file virus scanning (ClamAV)
- [ ] Add database encryption at rest

#### Medium Priority
- [ ] Implement account lockout after failed attempts
- [ ] Add 2FA/MFA support
- [ ] Implement password strength requirements
- [ ] Add API request signing
- [ ] Implement security headers for uploaded content

#### Low Priority
- [ ] Add honeypot fields to forms
- [ ] Implement CAPTCHA for registration
- [ ] Add geolocation-based access controls
- [ ] Implement device fingerprinting

---

## Incident Response

### If Security Breach Suspected
1. **Immediately rotate**: JWT_SECRET, database credentials, API keys
2. **Review logs**: Check authentication logs for suspicious activity
3. **Notify users**: If user data compromised, notify affected users
4. **Patch vulnerabilities**: Identify and fix security holes
5. **Document incident**: Record timeline and lessons learned

### Emergency Contacts
- Update with your security team contacts
- Include escalation procedures
- Document compliance requirements (GDPR, etc.)

---

## Compliance Notes

### GDPR Considerations
- User consent tracked via `acceptPrivacy` and `marketingOptIn` flags
- **TODO**: Implement data export functionality
- **TODO**: Implement data deletion endpoint
- **TODO**: Add cookie consent banner
- Review data retention policies

### Data Retention
- Session data: Currently limited to 200 most recent (per user)
- User data: Retained indefinitely
- **Recommendation**: Implement automatic cleanup policies

---

## Testing Security

### Manual Security Checks
```bash
# 1. Test CORS protection
curl -H "Origin: https://malicious-site.com" http://localhost:5050/api/sessions

# 2. Test rate limiting
for i in {1..50}; do curl -X POST http://localhost:5050/auth/login; done

# 3. Test input validation
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123"}'

# 4. Test file upload restrictions
curl -X POST http://localhost:5050/api/generate-images \
  -F "image=@malicious.exe"
```

### Automated Security Testing
```bash
# Dependency vulnerabilities
npm audit

# Security headers check (requires running server)
npm install -g observatory-cli
observatory yourdomain.com

# SSL/TLS check (production only)
npm install -g ssllabs-scan
ssllabs-scan yourdomain.com
```

---

## Support & Questions

For security-related questions or to report vulnerabilities:
- **DO NOT** open public GitHub issues for security vulnerabilities
- Contact the security team directly
- Use responsible disclosure practices

---

**Last Updated**: 2025-10-05
**Document Version**: 1.0
**Reviewed By**: Security Implementation Team
