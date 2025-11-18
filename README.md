# Skincare AI Chatbot - Setup Guide

## 🎯 Project Overview

This is an AI-powered skincare chatbot widget that integrates with your Shopify store. It features:
- 💬 Conversational AI chat (GPT-4-Omini)
- 📸 Skin analysis from photos (Hugging Face)
- 🛍️ Product recommendations from your Shopify catalog
- 📧 Email collection for follow-ups
- 🎨 K-beauty expert personality

## 📁 Project Structure

```
skincare/
├── frontend/          # React widget
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
└── package.json       # Root workspace
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for root, frontend, and backend.

### 2. Set Up Environment Variables

Create `backend/.env` file:

```env
# OpenAI API
OPENAI_API_KEY=sk-your-key-here

# Hugging Face API
HUGGINGFACE_API_KEY=hf_your-key-here

# Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Get Your API Keys

#### OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env`

#### Hugging Face API Key:
1. Go to https://huggingface.co/settings/tokens
2. Create new token (read access)
3. Copy and paste into `.env`

#### Shopify Storefront Access Token:
See `SHOPIFY_INTEGRATION.md` for detailed steps.

#### Supabase Setup:
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → API
4. Copy URL and anon key
5. Create these tables in SQL Editor:

```sql
-- User emails table
CREATE TABLE user_emails (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text NOT NULL,
  skin_type text,
  concerns text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Chat history table
CREATE TABLE chat_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id text NOT NULL,
  messages jsonb,
  analysis jsonb,
  created_at timestamp with time zone DEFAULT now()
);
```

### 4. Run Development Servers

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`.

### Backend
No build needed - Node.js runs directly.

## 🌐 Deployment

### Backend Deployment (Railway/Render)

**Railway (Recommended):**
1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repository
4. Add environment variables from `.env`
5. Deploy

**Render:**
1. Go to https://render.com
2. New → Web Service
3. Connect your repository
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Add environment variables

### Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import your repository
3. Framework preset: Vite
4. Root directory: `frontend`
5. Environment variable: `VITE_API_URL` = your backend URL
6. Deploy

### Update Shopify Integration

After deployment, update your Shopify theme with the production URLs:

```liquid
<script src="https://your-frontend.vercel.app/chatbot-widget.js" defer></script>
<link rel="stylesheet" href="https://your-frontend.vercel.app/chatbot-widget.css">
```

And update the API URL in the script:

```javascript
window.CHATBOT_CONFIG = {
  apiUrl: 'https://your-backend.railway.app/api'
};
```

## 🧪 Testing

1. **Test Backend API:**
```bash
curl http://localhost:5000/api/health
```

2. **Test Chat:**
- Open http://localhost:5173
- Click widget button
- Choose "Chat"
- Send messages

3. **Test Skin Scan:**
- Click widget button
- Choose "Skin Scan"
- Upload a face photo
- Wait for analysis

## 🎨 Customization

### Change Colors

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#0C2E4D',    // Your brand color
  secondary: '#ffefc8',  // Accent color
  white: '#ffffff'
}
```

### Change AI Personality

Edit `backend/src/services/openai.js` → `SYSTEM_PROMPT`

## 📚 API Endpoints

### Chat
- `POST /api/chat/start` - Start new conversation
- `POST /api/chat/message` - Send message

### Skin Analysis
- `POST /api/skin-analysis/analyze` - Upload image for analysis

### Shopify
- `GET /api/shopify/products` - Get products
- `POST /api/shopify/recommend` - Get recommendations

### Email
- `POST /api/email/subscribe` - Save user email

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm run install:all
```

### Backend won't start
- Check if port 5000 is available
- Verify all environment variables are set
- Check for syntax errors in `.env`

### Frontend build fails
```bash
cd frontend
rm -rf node_modules
npm install
npm run build
```

### Products not loading
- Verify Shopify API credentials
- Check that products are published
- Ensure products have tags

### Skin analysis fails
- Check Hugging Face API key
- Verify image is under 5MB
- Try a different model if needed

## 📞 Support

For Shopify-specific issues, see `SHOPIFY_INTEGRATION.md`.

## 🔐 Security Notes

- Never commit `.env` files
- Rotate API keys regularly
- Use environment variables for all secrets
- Enable CORS only for your domain in production
- Validate all user inputs on the backend

## 📄 License

MIT
# skincarebot
