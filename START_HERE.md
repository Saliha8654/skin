# 🌸 Welcome to Your AI Skincare Chatbot!

## ⭐ **START HERE** → [`QUICK_START.md`](./QUICK_START.md)

This is a complete, production-ready AI chatbot for your Shopify skincare store!

---

## 📖 Documentation Files

| File | Description | When to Use |
|------|-------------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | ⭐ **Start here!** Step-by-step setup | Setting up for the first time |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | High-level overview & architecture | Understanding the project |
| [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) | How to get all API keys | Getting credentials |
| [SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md) | Add widget to your store | Integrating with Shopify |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production | Going live |
| [README.md](./README.md) | Complete documentation | Reference guide |

---

## 🎯 What You're Building

A beautiful K-beauty AI chatbot with:
- 💬 **Chat Mode**: Conversational Q&A powered by GPT-4-Omini
- 📸 **Skin Scan**: AI analysis from photos
- 🛍️ **Smart Recommendations**: Products from your Shopify catalog
- 📧 **Email Collection**: Build your marketing list
- 🎨 **Your Brand Colors**: #0C2E4D, #ffefc8, #ffffff

---

## 🚀 Quick Links

### For Setup (Local Development)
1. [Get Started](./QUICK_START.md) - 30 minute setup
2. [Get API Keys](./API_KEYS_GUIDE.md) - OpenAI, Hugging Face, etc.
3. [Run Locally](./QUICK_START.md#-step-6-start-development-servers-2-minutes)

### For Deployment (Production)
1. [Deploy Backend](./DEPLOYMENT.md#phase-1-backend-deployment)
2. [Deploy Frontend](./DEPLOYMENT.md#phase-2-frontend-deployment)
3. [Add to Shopify](./SHOPIFY_INTEGRATION.md)

---

## 💻 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI Chat**: OpenAI GPT-4-Omini
- **Skin Analysis**: Hugging Face
- **Products**: Shopify Storefront API
- **Database**: Supabase (PostgreSQL)

---

## 📁 Project Structure

```
skincare/
├── frontend/          # React widget (runs on Vercel)
│   └── src/
│       ├── components/   # UI components
│       └── utils/        # API client
│
├── backend/           # Node.js API (runs on Railway)
│   └── src/
│       ├── routes/       # API endpoints
│       └── services/     # Business logic
│
└── docs/              # All documentation (you are here!)
```

---

## ✨ Features

✅ Two interaction modes (Chat & Skin Scan)  
✅ AI-powered conversations (GPT-4-Omini)  
✅ Skin analysis from photos (Hugging Face)  
✅ Product recommendations from Shopify  
✅ Add to cart functionality  
✅ Email collection with Supabase  
✅ Mobile responsive design  
✅ K-beauty expert personality  
✅ **NO TypeScript** - Pure JavaScript  

---

## 🎨 Customization

**Colors**: Edit `frontend/tailwind.config.js`
```javascript
colors: {
  primary: '#0C2E4D',    // Your main color
  secondary: '#ffefc8',  // Accent color
  white: '#ffffff'
}
```

**AI Personality**: Edit `backend/src/services/openai.js`

---

## 🆘 Need Help?

1. Check [QUICK_START.md](./QUICK_START.md#-troubleshooting) for common issues
2. Review error messages in terminal/console
3. Verify all API keys are correct
4. Check [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) for setup details

---

## 🎯 Next Steps

### First Time Setup:
1. ✅ Read [QUICK_START.md](./QUICK_START.md)
2. ✅ Get your API keys
3. ✅ Set up environment variables
4. ✅ Run `npm run install:all`
5. ✅ Run `npm run dev`
6. ✅ Test at http://localhost:5173

### Ready to Deploy:
1. ✅ Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Add widget to Shopify

---

## 🎉 You're Ready!

Everything you need is here:
- ✅ Complete source code
- ✅ Detailed documentation
- ✅ Step-by-step guides
- ✅ Deployment instructions
- ✅ Shopify integration

**Let's build something amazing! 💖**

---

## 📊 Expected Timeline

- **Setup**: 30 minutes
- **Testing**: 15 minutes
- **Deployment**: 1 hour
- **Shopify Integration**: 30 minutes
- **Total**: ~2.5 hours to launch

---

**Built for your K-beauty skincare store | No TypeScript | Production Ready**
