# Product Generator - AI-Powered Product Image Variations

Generate professional product variations using AI image generation with OpenRouter.

## 🚀 Quick Start

### Railway Deployment (5 minutes)

**See**: [RAILWAY_QUICK_FIX.md](RAILWAY_QUICK_FIX.md) for immediate deployment

### Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd ProductVariations

# Install dependencies
npm run build

# Configure environment
cd server
cp .env.development.sample .env
# Edit .env with your values

# Start development server
npm run dev

# In another terminal, start client
cd client
npm run dev
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [RAILWAY_QUICK_FIX.md](RAILWAY_QUICK_FIX.md) | **Deploy to Railway in 5 minutes** |
| [DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md) | Complete deployment guide (all platforms) |
| [SECURITY.md](SECURITY.md) | Security features & best practices |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Database setup guide |

## ✨ Features

- 🎨 AI-powered product image variations
- 🔐 Secure authentication (JWT + Google OAuth)
- 💳 Stripe payment integration
- 📦 Session management
- 🖼️ Multiple image formats support
- 📊 User referral system
- 🎯 Preset prompt library

## 🔧 Tech Stack

### Backend
- Node.js + Express 4
- Supabase (PostgreSQL)
- OpenRouter AI
- Stripe Payments
- JWT Authentication

### Frontend
- React + Vite
- Stripe Elements
- Modern CSS

## 🔒 Security Features

- ✅ CORS protection (strict whitelist)
- ✅ JWT authentication (strong secrets enforced)
- ✅ Input validation (express-validator)
- ✅ XSS protection (all user inputs)
- ✅ File upload validation (MIME + extension)
- ✅ Rate limiting (auth + API)
- ✅ Helmet security headers
- ✅ CSP + HSTS enabled

**See**: [SECURITY.md](SECURITY.md) for details

## 📦 Environment Variables

### Required

```bash
# Server
NODE_ENV=production
JWT_SECRET=<32+ characters>
CLIENT_ORIGIN=https://your-frontend.com
OPENROUTER_API_KEY=sk-or-v1-...

# Database (recommended for production)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Payments (optional)
STRIPE_SECRET_KEY=sk_live_...
```

**See**: `server/.env.production.template` for complete list

## 🚂 Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<your-secret>
railway variables set CLIENT_ORIGIN=<your-url>
railway variables set OPENROUTER_API_KEY=<your-key>
```

**See**: [RAILWAY_QUICK_FIX.md](RAILWAY_QUICK_FIX.md)

## 🐳 Docker Deployment

```bash
# Build image
docker build -t product-generator .

# Run container
docker run -p 5050:5050 --env-file .env.production product-generator

# Or use Docker Compose
docker-compose up -d
```

## 🏗️ Project Structure

```
ProductVariations/
├── client/          # React frontend
│   ├── src/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── index.js      # Main server
│   │   ├── auth.js       # Authentication
│   │   ├── storage.js    # Data persistence
│   │   └── mailer.js     # Email service
│   └── package.json
├── shared/          # Shared code
│   ├── promptCatalog.cjs
│   └── standaloneProductCategories.cjs
├── Dockerfile
├── docker-compose.yml
├── railway.json
└── README.md
```

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 🔍 Health Checks

```bash
# Basic health check
curl https://your-app.com/health

# Detailed diagnostics (with DEBUG=true)
curl https://your-app.com/api/diagnostics
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Verify CLIENT_ORIGIN matches your frontend URL exactly |
| JWT error | Ensure JWT_SECRET is 32+ characters |
| Images don't generate | Check OPENROUTER_API_KEY is set |
| Sessions not saving | Configure Supabase (URL + SERVICE_KEY) |

**See**: [RAILWAY_QUICK_FIX.md](RAILWAY_QUICK_FIX.md#troubleshooting)

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Login with Google
- `GET /auth/me` - Get current user

### Image Generation
- `POST /api/generate-images` - Generate product variations
- `POST /api/generate-descriptions` - Generate descriptions

### Coins & Payments
- `GET /api/coins/balance` - Get coin balance
- `POST /api/coins/create-payment-intent` - Create Stripe payment
- `POST /api/coins/redeem` - Redeem coins after payment

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Save new session

### Public
- `GET /api/public/gallery` - Public gallery
- `GET /health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

See [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: See [DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md)
- **Security Issues**: See [SECURITY.md](SECURITY.md)
- **Railway Help**: See [RAILWAY_QUICK_FIX.md](RAILWAY_QUICK_FIX.md)

## ✅ Production Checklist

Before deploying:

- [ ] Environment variables configured
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CLIENT_ORIGIN matches frontend URL
- [ ] HTTPS enabled
- [ ] Supabase configured (recommended)
- [ ] Stripe keys are production keys (sk_live_)
- [ ] Debug mode disabled (DEBUG=false)

**See**: [DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md)

---

**Status**: ✅ Production Ready
**Version**: 2.0
**Last Updated**: October 2025

---

**Quick Links**:
- 🚀 [Deploy Now](RAILWAY_QUICK_FIX.md)
- 📖 [Full Guide](DEPLOYMENT_COMPLETE.md)
- 🔒 [Security](SECURITY.md)
