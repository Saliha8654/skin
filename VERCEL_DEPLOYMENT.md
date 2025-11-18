# Deploy Frontend to Vercel

Follow these steps to deploy your skincare chatbot frontend to Vercel:

## Prerequisites
1. Create a Vercel account at https://vercel.com
2. Have your deployed backend URL ready (from Render deployment)

## Deployment Steps

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Project Name: `skincare-chatbot-frontend`
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

6. Click "Deploy"

7. Wait for deployment to complete. Vercel will provide a public URL for your frontend.

## Post-Deployment

1. Update your Shopify widget code with the new frontend URL
2. Test the chatbot functionality
3. Monitor performance in the Vercel dashboard