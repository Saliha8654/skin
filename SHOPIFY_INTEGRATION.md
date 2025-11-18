# Shopify Integration Guide

## Step 1: Add the Widget to Your Minimog Theme

### Option A: Using Shopify Theme Customizer (Recommended)

1. **Go to your Shopify Admin** → Online Store → Themes
2. **Click "Customize"** on your Minimog theme
3. **Add a Custom Liquid section**:
   - Click "Add section" at the bottom
   - Select "Custom Liquid"
4. **Paste the widget code** (see below)

### Option B: Edit Theme Files Directly

1. **Go to Shopify Admin** → Online Store → Themes → Actions → Edit Code
2. **Find `theme.liquid`** in the Layout folder
3. **Add this code before the closing `</body>` tag**:

```liquid
<!-- Skincare AI Chatbot Widget -->
<div id="skincare-chatbot-root"></div>
<script>
  window.CHATBOT_CONFIG = {
    apiUrl: 'YOUR_BACKEND_URL',
    shopifyDomain: '{{ shop.permanent_domain }}'
  };
</script>
<script src="YOUR_FRONTEND_URL/chatbot-widget.js" defer></script>
<link rel="stylesheet" href="YOUR_FRONTEND_URL/chatbot-widget.css">
```

**Replace**:
- `YOUR_BACKEND_URL` with your deployed backend URL (e.g., `https://your-api.railway.app/api`)
- `YOUR_FRONTEND_URL` with your deployed frontend URL (e.g., `https://your-chatbot.vercel.app`)

## Step 2: Set Up Shopify Storefront API

1. **Go to Shopify Admin** → Apps → "Develop apps" (at the bottom)
2. **Click "Create an app"** → Name it "Skincare Chatbot"
3. **Configure Storefront API access**:
   - Click "Configure Storefront API scopes"
   - Enable these permissions:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_write_checkouts`
     - `unauthenticated_read_checkouts`
4. **Save** and click "Install app"
5. **Copy the Storefront Access Token** → Add to your backend `.env` file

## Step 3: Tag Your Products

For the chatbot to recommend products accurately, add tags to your products:

### Skin Type Tags:
- `oily`
- `dry`
- `combination`
- `sensitive`
- `normal`

### Concern Tags:
- `acne`
- `dullness`
- `hydration`
- `anti-aging`
- `dark-spots`
- `oil-control`
- `brightness`

**To add tags**:
1. Go to Products in Shopify Admin
2. Click on a product
3. Add relevant tags in the "Tags" field
4. Save

## Step 4: Test the Integration

1. Visit your Shopify store
2. Look for the floating chatbot button (bottom-right corner)
3. Click to open the widget
4. Test both Chat and Skin Scan modes
5. Verify products are being recommended
6. Test "Add to Cart" functionality

## Troubleshooting

### Widget not appearing:
- Check browser console for errors
- Verify the script URLs are correct
- Make sure the script is loading (check Network tab)

### Products not showing:
- Verify Storefront API token is correct
- Check that products have the correct tags
- Ensure products are published to your online store

### Add to Cart not working:
- Verify your Shopify cart uses the standard AJAX API
- Check browser console for errors
- The widget uses `/cart/add.js` endpoint

## Advanced: Custom Styling

To match your Minimog theme better, you can customize colors in `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#YOUR_PRIMARY_COLOR',
  secondary: '#YOUR_SECONDARY_COLOR',
  white: '#ffffff'
}
```

Then rebuild and redeploy the frontend.
