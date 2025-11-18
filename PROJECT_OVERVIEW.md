# 🎯 Skincare AI Chatbot - Project Overview

## 📂 Complete File Structure

```
skincare/
├── 📄 package.json                    # Root workspace config
├── 📄 .gitignore                      # Git ignore rules
├── 📄 .env.example                    # Example environment variables
│
├── 📚 QUICK_START.md                  # ⭐ START HERE - Quick setup guide
├── 📚 README.md                       # Full documentation
├── 📚 API_KEYS_GUIDE.md               # How to get API keys
├── 📚 SHOPIFY_INTEGRATION.md          # Shopify setup guide
├── 📚 DEPLOYMENT.md                   # Production deployment guide
├── 📄 shopify-snippet.liquid          # Shopify theme code
│
├── 🎨 frontend/                       # React Widget
│   ├── 📄 package.json
│   ├── 📄 vite.config.js              # Vite configuration
│   ├── 📄 tailwind.config.js          # Tailwind CSS config (COLORS HERE!)
│   ├── 📄 postcss.config.js
│   ├── 📄 index.html
│   ├── 📄 .env.example
│   │
│   └── src/
│       ├── 📄 main.jsx                # Entry point
│       ├── 📄 App.jsx                 # Root component
│       ├── 📄 index.css               # Global styles
│       │
│       ├── components/
│       │   ├── 📄 ChatbotWidget.jsx   # Main widget component
│       │   ├── 📄 ChatMode.jsx        # Chat conversation UI
│       │   ├── 📄 SkinScanMode.jsx    # Photo upload & analysis UI
│       │   ├── 📄 ProductCard.jsx     # Product display card
│       │   └── 📄 EmailCollector.jsx  # Email subscription form
│       │
│       └── utils/
│           └── 📄 api.js              # API client functions
│
└── 🔧 backend/                        # Node.js API
    ├── 📄 package.json
    ├── 📄 .env.example
    │
    └── src/
        ├── 📄 server.js               # Express server setup
        │
        ├── routes/                    # API endpoints
        │   ├── 📄 chat.js             # Chat endpoints
        │   ├── 📄 skinAnalysis.js     # Skin analysis endpoints
        │   ├── 📄 shopify.js          # Shopify product endpoints
        │   └── 📄 email.js            # Email subscription endpoints
        │
        └── services/                  # Business logic
            ├── 📄 openai.js           # GPT-4-Omini integration
            ├── 📄 huggingface.js      # Skin analysis AI
            ├── 📄 shopify.js          # Shopify API client
            └── 📄 supabase.js         # Database operations
```

---

## 🔄 How Everything Connects

```
┌─────────────────────────────────────────────────────────────┐
│                     SHOPIFY STORE                           │
│  (Your Minimog Theme with Widget Embedded)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ <script> tag loads
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  REACT WIDGET (Frontend)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ChatbotWidget.jsx                                    │  │
│  │  ┌────────────┐          ┌─────────────┐            │  │
│  │  │ Chat Mode  │          │ Skin Scan   │            │  │
│  │  │  (GPT-4)   │          │ (HuggingF.) │            │  │
│  │  └────────────┘          └─────────────┘            │  │
│  │         │                        │                    │  │
│  │         └────────┬───────────────┘                    │  │
│  │                  ▼                                     │  │
│  │         Product Recommendations                        │  │
│  │         Email Collection                               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               NODE.JS BACKEND (API Server)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (API Endpoints)                              │  │
│  │  • POST /api/chat/message                            │  │
│  │  • POST /api/skin-analysis/analyze                   │  │
│  │  • GET  /api/shopify/products                        │  │
│  │  • POST /api/email/subscribe                         │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │  Services (Business Logic)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────┬────────┬────────┬────────┬─────────────────────────┘
         │        │        │        │
         ▼        ▼        ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ OpenAI │ │Hugging │ │Shopify │ │Supabase│
    │  API   │ │ Face   │ │  API   │ │   DB   │
    └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 🎨 Color Scheme

Your brand colors (customizable in `frontend/tailwind.config.js`):

- **Primary**: `#0C2E4D` - Deep navy blue for buttons and headers
- **Secondary**: `#ffefc8` - Soft cream for accents and highlights
- **White**: `#ffffff` - Clean backgrounds

---

## 🔑 API Keys Required

1. **OpenAI** (`OPENAI_API_KEY`) - Chat functionality
2. **Hugging Face** (`HUGGINGFACE_API_KEY`) - Skin analysis
3. **Shopify** (`SHOPIFY_STOREFRONT_ACCESS_TOKEN`) - Product data
4. **Supabase** (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) - Email storage

See `API_KEYS_GUIDE.md` for detailed instructions.

---

## 🚀 Quick Commands

```bash
# Install everything
npm run install:all

# Run development servers (both)
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build for production
cd frontend && npm run build
```

---

## 📊 User Journey

### Chat Mode Journey:
```
User clicks widget
    ↓
Chooses "Chat"
    ↓
Bot asks: "What's your main skin concern?"
    ↓
User answers: "acne and oily skin"
    ↓
Bot asks: "What type of products do you prefer?"
    ↓
User answers: "lightweight, oil-free"
    ↓
Bot shows 5 product recommendations
    ↓
User can:
  • View product details
  • Add to cart
  • Enter email for tips
```

### Skin Scan Journey:
```
User clicks widget
    ↓
Chooses "Skin Scan"
    ↓
Uploads/takes photo
    ↓
Clicks "Analyze Skin"
    ↓
AI processes image (10-30 sec)
    ↓
Shows:
  • Skin type (oily, dry, etc.)
  • Main concerns (acne, dryness, etc.)
  • Personalized tips
  • Product recommendations
    ↓
User can:
  • Add products to cart
  • Enter email for tips
  • Scan again
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (fast!)
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI API** - GPT-4-Omini for chat
- **Hugging Face** - Skin analysis model
- **Shopify Storefront API** - Product data
- **Supabase** - PostgreSQL database

### Deployment (Recommended)
- **Frontend**: Vercel (free)
- **Backend**: Railway (free tier)
- **Database**: Supabase (free tier)

---

## 📱 Features

✅ **Two Interaction Modes**:
- Chat: Conversational Q&A with GPT-4
- Scan: AI skin analysis from photos

✅ **Smart Product Recommendations**:
- Based on skin type and concerns
- Fetched directly from Shopify
- Filtered by product tags

✅ **Shopify Integration**:
- Add to cart functionality
- Product images and prices
- Links to product pages

✅ **Email Collection**:
- Optional subscription
- Stores preferences in database
- For follow-up marketing

✅ **Responsive Design**:
- Works on desktop and mobile
- Beautiful K-beauty inspired UI
- Smooth animations

✅ **K-Beauty Expert Personality**:
- Friendly, warm tone
- Korean beauty philosophy
- Emoji usage for friendliness

---

## 🎯 MVP Features Completed

- [x] Floating widget button
- [x] Chat mode with GPT-4-Omini
- [x] Skin scan mode with photo upload
- [x] AI skin analysis (Hugging Face)
- [x] Product recommendations from Shopify
- [x] Add to cart functionality
- [x] Email collection with Supabase
- [x] Responsive mobile design
- [x] Custom color scheme
- [x] Shopify Liquid snippet
- [x] Complete documentation
- [x] Deployment guides
- [x] NO TypeScript (pure JavaScript)

---

## 🔮 Future Enhancements (Ideas)

- [ ] Skin progress tracking over time
- [ ] Daily skincare routine generator
- [ ] Integration with Shopify discount codes
- [ ] Bundle recommendations
- [ ] Multi-language support
- [ ] User accounts and chat history
- [ ] Product reviews integration
- [ ] Live chat with human agents
- [ ] WhatsApp/SMS notifications
- [ ] A/B testing different prompts

---

## 📈 Performance Notes

### Expected Load Times:
- Widget load: < 2 seconds
- Chat response: 2-5 seconds
- Skin analysis: 10-30 seconds
- Product fetch: 1-3 seconds

### Optimization Tips:
- Enable caching for product queries
- Use lazy loading for images
- Implement rate limiting
- Monitor API usage

---

## 🔒 Security Features

- All API keys in environment variables
- CORS configured for specific domains
- Input validation on all endpoints
- Secure file upload limits
- No sensitive data in frontend
- HTTPS enforced in production

---

## 📞 Support Resources

- **Quick Start**: `QUICK_START.md` - Start here!
- **API Keys**: `API_KEYS_GUIDE.md` - Get your credentials
- **Shopify**: `SHOPIFY_INTEGRATION.md` - Add to your store
- **Deployment**: `DEPLOYMENT.md` - Go to production
- **Full Docs**: `README.md` - Everything else

---

## ✨ What Makes This Special

1. **No TypeScript** - Pure JavaScript as requested
2. **Your Brand Colors** - #0C2E4D, #ffefc8, #ffffff
3. **K-Beauty Focus** - Expert personality and recommendations
4. **Easy Integration** - Simple Liquid snippet for Shopify
5. **Production Ready** - Complete with deployment guides
6. **Well Documented** - Extensive guides and comments
7. **Free to Start** - All services have free tiers
8. **Minimog Compatible** - Designed for your theme

---

## 🎉 Ready to Launch?

Follow these steps in order:

1. ✅ Read `QUICK_START.md`
2. ✅ Get API keys (15 min)
3. ✅ Set up environment variables
4. ✅ Create Supabase tables
5. ✅ Tag Shopify products
6. ✅ Test locally
7. ✅ Deploy (follow `DEPLOYMENT.md`)
8. ✅ Add to Shopify (follow `SHOPIFY_INTEGRATION.md`)
9. ✅ Test on live store
10. ✅ Launch! 🚀

---

**Built with 💖 for your K-beauty skincare store**

Questions? Check the documentation files or review the code - it's well commented!
