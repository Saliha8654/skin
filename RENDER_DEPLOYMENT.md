# Deploy Backend to Render

Follow these steps to deploy your skincare chatbot backend to Render:

## Prerequisites
1. Create a Render account at https://render.com
2. Have your API keys ready:
   - OpenAI API Key
   - Hugging Face API Key
   - Shopify Store Domain and Access Token
   - Supabase URL and Anon Key

## Deployment Steps

1. Go to your Render dashboard
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `skincare-chatbot-backend`
   - Region: Choose the one closest to your users
   - Branch: `main` (or your preferred branch)
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   
5. Add Environment Variables:
   ```
   OPENAI_API_KEY=sk-...
   HUGGINGFACE_API_KEY=hf_...
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   SUPABASE_URL=https://...
   SUPABASE_ANON_KEY=...
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

6. Click "Create Web Service"

7. Wait for deployment to complete. Render will provide a public URL for your backend.

## Post-Deployment

1. Update your frontend to use the new backend URL
2. Test all API endpoints
3. Monitor logs in the Render dashboard for any issues