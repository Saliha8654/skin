const axios = require('axios');

const SHOPIFY_STOREFRONT_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

// GraphQL query to get products
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
              }
            }
          }
          tags
        }
      }
    }
  }
`;

// Get products from Shopify
async function getProducts(filters = {}) {
  try {
    let queryString = '';
    
    // Build Shopify search query based on filters
    // Using AND logic for better precision
    if (filters.skinType || (filters.concerns && filters.concerns.length > 0)) {
      const searchTerms = [];
      
      // Add skin type filter
      if (filters.skinType) {
        searchTerms.push(`tag:${filters.skinType}`);
      }
      
      // Add concern filters - each concern as a separate tag
      if (filters.concerns && filters.concerns.length > 0) {
        filters.concerns.forEach(concern => {
          // For multiple concerns, try to find products that match at least one concern
          searchTerms.push(`tag:${concern}`);
        });
      }
      
      // Use AND logic for skin type + concerns for more accurate results
      // If multiple concerns, use OR between concerns but AND with skin type
      if (filters.skinType && filters.concerns && filters.concerns.length > 0) {
        const concernTags = filters.concerns.map(c => `tag:${c}`).join(' OR ');
        queryString = `(tag:${filters.skinType}) AND (${concernTags})`;
      } else if (filters.concerns && filters.concerns.length > 0) {
        // Just concerns, use OR between them
        queryString = filters.concerns.map(c => `tag:${c}`).join(' OR ');
      } else if (filters.skinType) {
        // Just skin type
        queryString = `tag:${filters.skinType}`;
      }
    }

    console.log('Shopify Query String:', queryString);

    const response = await axios.post(
      SHOPIFY_STOREFRONT_URL,
      {
        query: GET_PRODUCTS_QUERY,
        variables: {
          first: 10,
          query: queryString || null
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    const products = response.data.data.products.edges.map(edge => ({
      id: edge.node.id,
      variantId: edge.node.variants.edges[0]?.node.id,
      title: edge.node.title,
      description: edge.node.description,
      handle: edge.node.handle,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.url || null,
      imageAlt: edge.node.images.edges[0]?.node.altText || edge.node.title,
      availableForSale: edge.node.variants.edges[0]?.node.availableForSale || false,
      tags: edge.node.tags,
      url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${edge.node.handle}`
    }));

    console.log(`Found ${products.length} products for filters:`, filters);
    return products;
  } catch (error) {
    console.error('Shopify API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch products from Shopify');
  }
}

// Recommend products based on skincare needs
async function recommendProducts(needs) {
  try {
    const filters = {
      skinType: needs.skinType,
      concerns: needs.concerns || []
    };

    let products = await getProducts(filters);

    // If no products found with filters, get general products
    if (products.length === 0) {
      products = await getProducts({});
    }

    // Limit to top 5 recommendations
    return products.slice(0, 5);
  } catch (error) {
    console.error('Product recommendation error:', error);
    throw error;
  }
}

module.exports = {
  getProducts,
  recommendProducts
};
