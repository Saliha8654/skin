const API_URL =
  (typeof window !== 'undefined' && window.CHATBOT_CONFIG?.apiUrl) ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';
// Chat API
export const chatAPI = {
  start: async () => {
    const response = await fetch(`${API_URL}/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  sendMessage: async (messages, context = {}) => {
    const response = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context })
    });
    return response.json();
  }
};

// Skin Analysis API
export const skinAnalysisAPI = {
  analyze: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/skin-analysis/analyze`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
};

// Shopify API
export const shopifyAPI = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/shopify/products?${params}`);
    return response.json();
  },

  recommend: async (skinType, concerns = []) => {
    const response = await fetch(`${API_URL}/shopify/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skinType, concerns })
    });
    return response.json();
  },

  getCollections: async (limit = 10) => {
    const params = new URLSearchParams({ limit });
    const response = await fetch(`${API_URL}/shopify/collections?${params}`);
    return response.json();
  },

  getProductsByCollection: async (collectionHandle, limit = 10) => {
    const params = new URLSearchParams({ limit });
    const response = await fetch(`${API_URL}/shopify/collections/${collectionHandle}/products?${params}`);
    return response.json();
  },

  recommendByCollection: async (collectionHandle, skinType, concerns = []) => {
    const response = await fetch(`${API_URL}/shopify/recommend-by-collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionHandle, skinType, concerns })
    });
    return response.json();
  }
};

// Email API
export const emailAPI = {
  subscribe: async (email, preferences = {}) => {
    const response = await fetch(`${API_URL}/email/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preferences })
    });
    return response.json();
  }
};
