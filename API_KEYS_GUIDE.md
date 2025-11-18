# API Keys and Credentials Guide

## 🔑 Required API Keys

### 1. OpenAI API Key (GPT-4-Omini)

**What it's for:** Powers the conversational chat functionality

**How to get it:**
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Name it "Skincare Chatbot"
6. Copy the key (starts with `sk-`)
7. Add to `backend/.env`: `OPENAI_API_KEY=sk-...`

**Cost:** Pay-as-you-go
- GPT-4-Omini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Estimated: $0.01-0.05 per conversation
- First $5 free credit for new accounts

**Note:** Use `gpt-4o-mini` model for lower costs

---

### 2. Hugging Face API Key

**What it's for:** Skin analysis from uploaded photos

**How to get it:**
1. Go to https://huggingface.co/join
2. Create a free account
3. Go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Name it "Skincare Chatbot"
6. Role: "Read" (default)
7. Copy the token (starts with `hf_`)
8. Add to `backend/.env`: `HUGGINGFACE_API_KEY=hf_...`

**Cost:** FREE for most models
- No credit card required
- Rate limited but generous for small apps
- Model used: `dima806/skin_types_image_detection`

---

### 3. Shopify Storefront API Token

**What it's for:** Fetch products from your Shopify store

**How to get it:**

#### Step 1: Enable Custom App Development
1. Go to your Shopify Admin
2. Settings → Apps and sales channels
3. Click "Develop apps" at the bottom
4. Click "Allow custom app development"
5. Confirm

#### Step 2: Create the App
1. Click "Create an app"
2. Name: "Skincare Chatbot"
3. App developer: (your email)
4. Click "Create app"

#### Step 3: Configure API Scopes
1. Click "Configure Storefront API scopes"
2. Select these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
3. Click "Save"

#### Step 4: Install App
1. Click "Install app" button
2. Confirm installation

#### Step 5: Get Credentials
1. Go to "API credentials" tab
2. Copy "Storefront API access token"
3. Add to `backend/.env`:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
   ```

**Cost:** FREE - included with Shopify plan

---

### 4. Supabase Credentials

**What it's for:** Store user emails and chat history

**How to get it:**

#### Step 1: Create Project
1. Go to https://supabase.com
2. Sign up for free account
3. Click "New project"
4. Fill in:
   - Name: "skincare-chatbot"
   - Database Password: (create a strong password)
   - Region: (choose closest to your users)
5. Wait for setup (2-3 minutes)

#### Step 2: Create Tables
1. Go to SQL Editor
2. Click "New query"
3. Paste this SQL:

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

-- Add index
CREATE INDEX idx_user_emails_email ON user_emails(email);

-- Optional: Chat history
CREATE TABLE chat_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id text NOT NULL,
  messages jsonb,
  analysis jsonb,
  created_at timestamp with time zone DEFAULT now()
);
```

4. Click "Run"

#### Step 3: Get API Credentials
1. Go to Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
4. Add to `backend/.env`:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

**Cost:** FREE
- Free tier: 500MB database, 2GB bandwidth/month
- More than enough for this project
- No credit card required

---

## 💰 Total Cost Summary

### Development (Testing)
- **Total: $0-5/month**
  - OpenAI: $0-5 (free credits + minimal usage)
  - Hugging Face: FREE
  - Shopify: FREE (included)
  - Supabase: FREE

### Production (Real Store)
- **Estimated: $10-30/month**
  - OpenAI: $5-20 (depends on traffic)
  - Hugging Face: FREE
  - Shopify: FREE (included)
  - Supabase: FREE
  - Hosting: $5-10 (Railway/Vercel)

---

## ⚠️ Security Best Practices

1. **Never commit `.env` files to Git**
   - Already added to `.gitignore`
   - Always use `.env.example` as template

2. **Rotate keys regularly**
   - Change keys every 3-6 months
   - Immediately if compromised

3. **Use different keys for dev/prod**
   - Create separate OpenAI keys
   - Separate Supabase projects

4. **Monitor usage**
   - OpenAI: https://platform.openai.com/usage
   - Hugging Face: https://huggingface.co/settings/tokens
   - Supabase: Project dashboard

5. **Set spending limits**
   - OpenAI: Set monthly budget in account settings
   - Enable email alerts

---

## 🧪 Test Your Setup

After adding all keys, test each service:

### Test OpenAI:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

### Test Hugging Face:
```bash
curl https://api-inference.huggingface.co/models/dima806/skin_types_image_detection \
  -H "Authorization: Bearer YOUR_HF_KEY"
```

### Test Shopify:
```bash
curl -X POST \
  https://your-store.myshopify.com/api/2024-01/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{ shop { name } }"}'
```

### Test Supabase:
Visit: `https://your-project.supabase.co/rest/v1/user_emails?select=*`
(Add header: `apikey: YOUR_ANON_KEY`)

---

## 🆘 Troubleshooting

### "Invalid API key" errors
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Keys are case-sensitive

### "Authentication failed"
- Verify key is active (not deleted)
- Check if key has necessary permissions
- For Shopify, ensure scopes are configured

### "Rate limit exceeded"
- OpenAI: Wait or upgrade plan
- Hugging Face: Wait 1 hour or try different time
- Free tiers are generous for development

---

## 📞 Support Links

- OpenAI Help: https://help.openai.com
- Hugging Face Docs: https://huggingface.co/docs
- Shopify API Docs: https://shopify.dev/docs/api
- Supabase Docs: https://supabase.com/docs
