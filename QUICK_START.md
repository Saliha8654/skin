# 🚀 Quick Start Guide - Skincare AI Chatbot

Welcome! This guide will get you up and running in **under 30 minutes**.

---

## ✅ Step 1: Install Dependencies (5 minutes)

Open terminal in the project folder and run:

```bash
npm run install:all
```

This installs everything for frontend, backend, and root workspace.

---

## ✅ Step 2: Get Your API Keys (15 minutes)

You need 4 sets of credentials. Follow this guide: **`API_KEYS_GUIDE.md`**

Quick links:
- **OpenAI**: https://platform.openai.com/api-keys
- **Hugging Face**: https://huggingface.co/settings/tokens
- **Shopify**: Your Shopify Admin → Apps → Develop apps
- **Supabase**: https://supabase.com → New project

---

## ✅ Step 3: Configure Environment Variables (5 minutes)

### Backend Configuration

1. Copy the example file:
   ```bash
   copy backend\.env.example backend\.env
   ```

2. Open `backend\.env` in a text editor

3. Fill in your API keys:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   HUGGINGFACE_API_KEY=hf_your-key-here
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. Save the file

### Frontend Configuration

1. Copy the example file:
   ```bash
   copy frontend\.env.example frontend\.env
   ```

2. It should contain:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Save (no changes needed for local development)

---

## ✅ Step 4: Set Up Supabase Database (5 minutes)

1. Go to your Supabase project
2. Click "SQL Editor" in the sidebar
3. Click "New query"
4. Copy and paste this SQL:

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

-- Add index for better performance
CREATE INDEX idx_user_emails_email ON user_emails(email);
CREATE INDEX idx_user_emails_created_at ON user_emails(created_at DESC);

-- Optional: Chat history table
CREATE TABLE chat_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id text NOT NULL,
  messages jsonb,
  analysis jsonb,
  created_at timestamp with time zone DEFAULT now()
);
```

5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

---

## ✅ Step 5: Tag Your Shopify Products (10 minutes)

For accurate recommendations, add tags to your products:

### Go to Shopify Admin → Products

For each skincare product, add relevant tags:

**Skin Type Tags** (add one or more):
- `oily`
- `dry`
- `combination`
- `sensitive`
- `normal`

**Concern Tags** (add one or more):
- `acne`
- `dullness`
- `hydration`
- `anti-aging`
- `dark-spots`
- `oil-control`
- `brightness`

**Example**: A moisturizer for dry skin with anti-aging benefits:
```
Tags: dry, hydration, anti-aging, moisturizer
```

Save each product after adding tags.

---

## ✅ Step 6: Start Development Servers (2 minutes)

### Option 1: Run Both Together (Recommended)

```bash
npm run dev
```

This starts both backend and frontend together.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

Wait for both to start:
- ✅ Backend: `Server running on port 5000`
- ✅ Frontend: `Local: http://localhost:5173`

---

## ✅ Step 7: Test the Chatbot (5 minutes)

1. **Open your browser**: http://localhost:5173

2. **You should see**: A floating button in the bottom-right corner

3. **Click the button**: Widget opens with two options

4. **Test Chat Mode**:
   - Click "Chat"
   - Answer the questions about your skin
   - After 3-4 questions, you'll see product recommendations
   - Try adding a product to cart

5. **Test Skin Scan Mode**:
   - Go back and click "Skin Scan"
   - Upload a clear face photo
   - Click "Analyze Skin"
   - Wait for results (10-30 seconds)
   - View recommendations

6. **Test Email Collection**:
   - Enter your email in the form
   - Click Subscribe
   - Check Supabase to see if it was saved

---

## 🎉 Success! What's Next?

### Ready to Deploy?

Follow **`DEPLOYMENT.md`** for step-by-step deployment instructions.

**Recommended Stack:**
- **Backend**: Railway (free tier available)
- **Frontend**: Vercel (free tier available)
- **Database**: Supabase (already set up)

### Integrate with Shopify

Once deployed, follow **`SHOPIFY_INTEGRATION.md`** to add the widget to your store.

### Customize

**Change colors**: Edit `frontend/tailwind.config.js`

**Change AI personality**: Edit `backend/src/services/openai.js`

**Add more features**: Check the code - it's well-commented!

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Missing environment variables"**
- Make sure `backend/.env` exists and has all required keys
- Check for typos in variable names

**Error: "Port 5000 already in use"**
- Change PORT in `backend/.env` to 5001
- Update `frontend/.env` to use port 5001

### Frontend won't start

**Error: "Cannot find module"**
- Run: `cd frontend && npm install`

### Chatbot not responding

**Check backend console for errors**:
- OpenAI API key issues: Red error about authentication
- Shopify issues: Check store domain and token

### No products showing

1. Make sure products are **published** in Shopify
2. Check that products have **tags** (oily, dry, acne, etc.)
3. Test Shopify API directly:
   ```bash
   curl -X POST \
     https://your-store.myshopify.com/api/2024-01/graphql.json \
     -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query": "{ products(first: 5) { edges { node { title } } } }"}'
   ```

### Skin analysis fails

1. Check Hugging Face API key
2. Make sure image is under 5MB
3. Use a clear, well-lit face photo
4. Try a different photo

### Email not saving

1. Check Supabase credentials in `backend/.env`
2. Make sure the `user_emails` table exists
3. Check Supabase dashboard for errors

---

## 📚 Documentation

- **`README.md`** - Full project documentation
- **`API_KEYS_GUIDE.md`** - Detailed guide for getting API keys
- **`SHOPIFY_INTEGRATION.md`** - How to add widget to your store
- **`DEPLOYMENT.md`** - Deploy to production

---

## 🆘 Need Help?

1. Check the error message in terminal
2. Check browser console (F12) for frontend errors
3. Review the relevant documentation file
4. Make sure all API keys are correct
5. Try restarting the servers

---

## 🎨 Color Customization

Your theme colors are set to:
- Primary: `#0C2E4D` (Deep blue)
- Secondary: `#ffefc8` (Cream)
- White: `#ffffff`

To change them, edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  white: '#ffffff'
}
```

Then rebuild: `cd frontend && npm run build`

---

## ✨ Features Checklist

- [x] AI Chat with GPT-4-Omini
- [x] Skin analysis from photos
- [x] Product recommendations from Shopify
- [x] Add to cart functionality
- [x] Email collection
- [x] Mobile responsive
- [x] K-beauty expert personality
- [x] Beautiful UI with your brand colors

---

## 📊 What You'll See

### Chat Mode Flow:
1. Welcome message
2. Ask about skin concerns
3. Ask about skin type
4. Ask about preferences
5. Show 3-5 product recommendations
6. Email opt-in form

### Skin Scan Mode Flow:
1. Upload/capture photo
2. AI analyzes skin
3. Show skin type & concerns
4. Display skincare tips
5. Show product recommendations
6. Email opt-in form

---

## 🚀 Launch Checklist

Before deploying to production:

- [ ] All API keys working
- [ ] Chat functionality tested
- [ ] Skin scan tested
- [ ] Products loading correctly
- [ ] Add to cart working
- [ ] Email collection working
- [ ] At least 10 products tagged in Shopify
- [ ] Mobile testing done
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Widget added to Shopify

---

**You're all set! Happy coding! 💖**

If everything works locally, you're ready to deploy. Follow **`DEPLOYMENT.md`** next!
