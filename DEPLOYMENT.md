# Skincare AI Chatbot Widget - Deployment Guide

## 🚀 Deployment Checklist

### Phase 1: Backend Deployment

#### Option A: Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select Repository**: Connect your GitHub repo
4. **Root Directory**: Leave as root (Railway will detect backend)
5. **Add Environment Variables**:
   ```
   OPENAI_API_KEY=sk-...
   HUGGINGFACE_API_KEY=hf_...
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   SUPABASE_URL=https://...
   SUPABASE_ANON_KEY=...
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. **Configure Build**:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
7. **Deploy** and copy the public URL

#### Option B: Render

For detailed instructions on deploying to Render, please see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) and [FULL_DEPLOYMENT_GUIDE.md](FULL_DEPLOYMENT_GUIDE.md).

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Settings**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. **Environment**: Node
5. **Add Environment Variables** (same as above)
6. **Deploy** and copy the URL

#### Option C: Heroku

```bash
# Install Heroku CLI
heroku login
heroku create skincare-chatbot-api

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set HUGGINGFACE_API_KEY=hf_...
# ... add all other variables

# Deploy
git subtree push --prefix backend heroku main
```

### Phase 2: Frontend Deployment

#### Vercel (Recommended)

For detailed instructions on deploying to Vercel, please see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) and [FULL_DEPLOYMENT_GUIDE.md](FULL_DEPLOYMENT_GUIDE.md).

1. **Create Vercel Account**: https://vercel.com
2. **Import Project** → Connect GitHub
3. **Framework**: Vite
4. **Root Directory**: `frontend`
5. **Build Settings**:
   - Build command: `npm run build`
   - Output directory: `dist`
6. **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
7. **Deploy** and copy the URL

#### Netlify Alternative

1. **Create Netlify Account**: https://netlify.com
2. **New Site** → Import from Git
3. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. **Deploy**

#### Cloudflare Pages

```bash
cd frontend
npm run build

# Upload dist/ folder to Cloudflare Pages
```

### Phase 3: Shopify Integration

1. **Update Widget Code**:
   - Open `shopify-snippet.liquid`
   - Replace `YOUR_FRONTEND_URL` with Vercel URL
   - Replace `YOUR_BACKEND_URL` with Railway URL

2. **Add to Minimog Theme**:
   - Shopify Admin → Online Store → Themes
   - Actions → Edit Code
   - Open `Layout/theme.liquid`
   - Paste the snippet code before `</body>`
   - Save

3. **Verify Integration**:
   - Visit your store
   - Look for chatbot button (bottom-right)
   - Test functionality

### Phase 4: Database Setup (Supabase)

1. **Create Supabase Project**: https://supabase.com
2. **Create Tables**:

```sql
-- User emails table
CREATE TABLE user_emails (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  skin_type text,
  concerns text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_user_emails_email ON user_emails(email);
CREATE INDEX idx_user_emails_created_at ON user_emails(created_at DESC);

-- Optional: Chat history
CREATE TABLE chat_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id text NOT NULL,
  messages jsonb,
  analysis jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies (optional)
ALTER TABLE user_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
```

3. **Get API Credentials**:
   - Settings → API
   - Copy URL and anon key
   - Add to backend environment variables

## 🔧 Post-Deployment Configuration

### Update CORS Settings

In `backend/src/server.js`, update CORS origin:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://your-store.myshopify.com'
  ],
  credentials: true
}));
```

### Test All Endpoints

```bash
# Test health check
curl https://your-backend.railway.app/api/health

# Test chat start
curl -X POST https://your-backend.railway.app/api/chat/start

# Test Shopify products
curl https://your-backend.railway.app/api/shopify/products
```

### Monitor Performance

**Railway Dashboard:**
- Check logs for errors
- Monitor memory and CPU usage
- Set up alerts

**Vercel Dashboard:**
- Check deployment status
- Review function logs
- Monitor bandwidth

## 🎯 Production Optimizations

### Backend

1. **Enable Compression**:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

3. **Caching**: Cache product responses for 5 minutes

### Frontend

1. **Code Splitting**: Already handled by Vite
2. **Image Optimization**: Use WebP format for widget icon
3. **Bundle Size**: Check with `npm run build -- --mode production`

## 🔒 Security Checklist

- [ ] All API keys in environment variables
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced
- [ ] Supabase RLS policies enabled
- [ ] Regular dependency updates
- [ ] Error messages don't expose sensitive info

## 📊 Analytics Setup (Optional)

### Add Google Analytics

In Shopify:
1. Settings → Online Store → Preferences
2. Add Google Analytics tracking ID
3. Events will be tracked automatically

### Track Chatbot Usage

Add to `frontend/src/components/ChatbotWidget.jsx`:

```javascript
const toggleWidget = () => {
  setIsOpen(!isOpen);
  
  // Track event
  if (window.gtag) {
    window.gtag('event', isOpen ? 'chatbot_close' : 'chatbot_open');
  }
};
```

## 🐛 Troubleshooting Production Issues

### Widget Not Loading

1. Check browser console for errors
2. Verify script URLs are correct
3. Check CORS headers in Network tab
4. Ensure HTTPS is used everywhere

### Products Not Showing

1. Verify Shopify API token is valid
2. Check backend logs for errors
3. Test API endpoint directly
4. Ensure products are published and tagged

### Slow Performance

1. Check backend response times
2. Enable caching for product queries
3. Optimize images
4. Use CDN for static assets

### Email Collection Failing

1. Check Supabase credentials
2. Verify table exists and schema matches
3. Check Supabase dashboard for errors
4. Test endpoint directly

## 📱 Mobile Testing

Test on:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad
- [ ] Small screens (360px width)

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 📝 Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Review analytics
- Test chatbot functionality

**Monthly:**
- Update dependencies
- Rotate API keys (optional)
- Review and optimize costs

**Quarterly:**
- Full security audit
- Performance optimization
- Feature updates based on usage

## 🎉 Launch Checklist

Before going live:

- [ ] All environment variables set
- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] Shopify integration working
- [ ] Chat functionality tested
- [ ] Skin scan tested
- [ ] Product recommendations working
- [ ] Add to cart working
- [ ] Email collection working
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Analytics tracking
- [ ] Error monitoring setup
- [ ] Documentation updated

## 🆘 Support

If you encounter issues:

1. Check logs in deployment dashboards
2. Review environment variables
3. Test API endpoints individually
4. Check Shopify API status
5. Review browser console errors

For API-specific issues:
- OpenAI: https://status.openai.com
- Hugging Face: https://status.huggingface.co
- Shopify: https://status.shopify.com
- Supabase: https://status.supabase.com
