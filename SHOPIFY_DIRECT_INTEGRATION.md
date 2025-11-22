# Direct Shopify Integration Guide

This guide explains how to integrate the skincare chatbot widget directly into your Shopify store without using external hosting services like Vercel.

## Prerequisites

1. A Shopify store with the Minimog theme (or another theme you can modify)
2. The skincare chatbot backend deployed (on Render or another platform)
3. Node.js and npm installed locally (for building the frontend)

## Step-by-Step Integration

### 1. Build the Frontend

First, you need to build the frontend files:

```bash
cd frontend
npm run build
```

This will create a `dist` folder containing all the necessary files for the widget:
- `chatbot-widget.js` (the main JavaScript bundle)
- `chatbot-widget.css` (the stylesheet)
- Any other asset files (images, fonts, etc.)

### 2. Upload Files to Shopify

1. Go to your Shopify Admin
2. Navigate to **Online Store** → **Themes**
3. Click **Actions** → **Edit Code** for your active theme
4. In the **Assets** folder, upload the following files from the `frontend/dist/` folder:
   - `chatbot-widget.js`
   - `chatbot-widget.css`
   - Any other asset files

### 3. Add Widget Code to Your Theme

1. In the same theme editor, locate the `theme.liquid` file in the **Layout** folder
2. Add the following code just before the closing `</body>` tag:

```liquid
<!-- Skincare AI Chatbot Widget -->
<div id="skincare-chatbot-root"></div>
<script>
  window.CHATBOT_CONFIG = {
    apiUrl: 'YOUR_BACKEND_URL',
    shopifyDomain: '{{ shop.permanent_domain }}'
  };
  
  // Initialize widget when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Widget will automatically initialize since chatbot-widget.js is loaded
  });
</script>
<script src="{{ 'chatbot-widget.js' | asset_url }}" defer></script>
<link rel="stylesheet" href="{{ 'chatbot-widget.css' | asset_url }}">
```

3. Replace `YOUR_BACKEND_URL` with your actual backend URL (e.g., `https://your-api.onrender.com/api`)

### 4. Configure Your Backend

Make sure your backend is configured to accept requests from your Shopify domain:

1. In your Render dashboard (or wherever your backend is hosted), update the environment variables:
   - Add your Shopify store URL to the `FRONTEND_URL` environment variable
   - Example: `FRONTEND_URL=https://your-store.myshopify.com`

### 5. Test the Integration

1. Visit your Shopify store
2. Look for the floating chatbot button in the bottom-right corner
3. Click to open the widget
4. Test both Chat and Skin Scan modes
5. Verify that products are being recommended
6. Test the "Add to Cart" functionality

## Updating the Widget

When you make changes to the frontend code:

1. Rebuild the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload the new files to Shopify, replacing the old ones
3. Clear your browser cache to see the changes

## Benefits of Direct Integration

- No dependency on external hosting services
- All files served directly from Shopify's CDN
- Simplified deployment process
- Better performance due to fewer external requests

## Troubleshooting

### Widget Not Appearing

- Check the browser console for JavaScript errors
- Verify that the asset files were uploaded correctly
- Ensure the widget code is placed before the closing `</body>` tag

### Styling Issues

- Make sure the CSS file is loaded correctly
- Check for conflicts with your theme's existing styles
- Verify that the asset URLs are correct

### API Connection Problems

- Confirm that your backend URL is correct
- Check that CORS is properly configured on your backend
- Verify that your Shopify domain is whitelisted in the backend settings

## Advanced Customization

### Theme Matching

To better match your Shopify theme, you can customize the colors in `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#YOUR_PRIMARY_COLOR',
  secondary: '#YOUR_SECONDARY_COLOR',
  white: '#ffffff'
}
```

After making changes:
1. Rebuild the frontend
2. Re-upload the files to Shopify

### Adding Custom Functionality

You can extend the widget by modifying the React components in `frontend/src/components/`. After making changes:
1. Rebuild the frontend
2. Re-upload the files to Shopify

This direct integration approach gives you full control over the widget while keeping everything within your Shopify ecosystem.