# Full Deployment Guide: Frontend to Vercel & Backend to Render

This guide will walk you through deploying your skincare chatbot application with the frontend on Vercel and the backend on Render.

## Prerequisites

Before starting, ensure you have:
1. Accounts on both Vercel (https://vercel.com) and Render (https://render.com)
2. All required API keys:
   - OpenAI API Key
   - Hugging Face API Key
   - Shopify Store Domain and Access Token
   - Supabase URL and Anon Key
3. Your GitHub repository ready with the latest code

## Step 1: Deploy Backend to Render

### 1. Prepare Your Repository
Ensure your repository has the Render configuration file at `backend/render.yaml`.

### 2. Create Web Service on Render
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

### 3. Set Environment Variables
Add these environment variables in the Render dashboard:
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

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete. Note the public URL provided by Render.

## Step 2: Deploy Frontend to Vercel

### 1. Create Project on Vercel
1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository

### 2. Configure Project
Configure the project with these settings:
- Project Name: `skincare-chatbot-frontend`
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Set Environment Variables
Add this environment variable in the Vercel dashboard:
```
VITE_API_URL=https://your-render-app.onrender.com/api
```
(Replace with your actual Render backend URL)

### 4. Deploy
Click "Deploy" and wait for deployment to complete. Note the public URL provided by Vercel.

## Step 3: Update Backend CORS Settings

After deploying to Vercel, update your Render environment variables to include your Vercel URL in the CORS settings:

1. In Render dashboard, go to your service
2. Go to "Environment" tab
3. Update the `FRONTEND_URL` variable with your actual Vercel URL
4. Redeploy the service

## Step 4: Shopify Integration

1. Update your Shopify widget code with the new frontend URL
2. Add the widget code to your Shopify theme:
   - Go to Shopify Admin → Online Store → Themes
   - Actions → Edit Code
   - Open `Layout/theme.liquid`
   - Paste the widget code before `</body>`
   - Save

## Testing Your Deployment

1. Visit your Vercel frontend URL
2. Test the chatbot functionality
3. Verify all API endpoints work correctly
4. Check that data is being stored in Supabase
5. Test the Shopify product recommendations

## Monitoring and Maintenance

- Monitor logs in both Vercel and Render dashboards
- Set up alerts for any errors
- Regularly update dependencies
- Rotate API keys periodically

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure FRONTEND_URL is correctly set in Render environment variables
2. **API Not Responding**: Check that all environment variables are correctly set
3. **Products Not Loading**: Verify Shopify credentials and product tags
4. **Email Not Saving**: Check Supabase credentials and table structure

### Checking Logs

- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Logs

## Cost Considerations

- **Render**: Free tier available, with paid options for higher usage
- **Vercel**: Free tier available, with paid options for higher usage
- **Supabase**: Free tier with generous limits
- Monitor usage to avoid unexpected charges

Congratulations! Your skincare chatbot is now deployed and ready for users.