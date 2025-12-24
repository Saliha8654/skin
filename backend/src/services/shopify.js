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

// GraphQL query to get collections
const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 5) {
            edges {
              node {
                id
                title
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
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to get products by collection
const GET_PRODUCTS_BY_COLLECTION_QUERY = `
  query getProductsByCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
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

async function getCollections(limit = 10) {
  try {
    const response = await axios.post(
      SHOPIFY_STOREFRONT_URL,
      {
        query: GET_COLLECTIONS_QUERY,
        variables: {
          first: limit
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    const collections = response.data.data.collections.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      image: edge.node.image?.url || null,
      imageAlt: edge.node.image?.altText || edge.node.title,
      products: edge.node.products.edges.map(productEdge => ({
        id: productEdge.node.id,
        title: productEdge.node.title,
        handle: productEdge.node.handle,
        price: productEdge.node.priceRange.minVariantPrice.amount,
        currency: productEdge.node.priceRange.minVariantPrice.currencyCode,
        image: productEdge.node.images.edges[0]?.node.url || null,
        imageAlt: productEdge.node.images.edges[0]?.node.altText || productEdge.node.title
      }))
    }));

    console.log(`Found ${collections.length} collections`);
    return collections;
  } catch (error) {
    console.error('Shopify collections API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch collections from Shopify');
  }
}

async function getProductsByCollection(collectionHandle, limit = 10) {
  try {
    const response = await axios.post(
      SHOPIFY_STOREFRONT_URL,
      {
        query: GET_PRODUCTS_BY_COLLECTION_QUERY,
        variables: {
          handle: collectionHandle,
          first: limit
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        }
      }
    );

    if (!response.data.data.collection) {
      throw new Error(`Collection with handle '${collectionHandle}' not found`);
    }

    const collection = response.data.data.collection;
    const products = collection.products.edges.map(edge => ({
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

    console.log(`Found ${products.length} products in collection '${collectionHandle}'`);
    return {
      collection: {
        id: collection.id,
        title: collection.title
      },
      products: products
    };
  } catch (error) {
    console.error('Shopify products by collection API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch products from collection '${collectionHandle}'`);
  }
}

// Recommend products based on collection and skincare needs
async function recommendProductsByCollection(collectionHandle, needs) {
  try {
    // First get products from the specified collection
    const collectionData = await getProductsByCollection(collectionHandle);
    
    // Filter products based on skincare needs
    let filteredProducts = collectionData.products;
    
    if (needs && (needs.skinType || (needs.concerns && needs.concerns.length > 0))) {
      filteredProducts = collectionData.products.filter(product => {
        const productTags = product.tags ? product.tags.map(tag => tag.toLowerCase()) : [];
        
        // Check skin type match
        let skinTypeMatch = true; // Default to true if no skin type specified
        if (needs.skinType) {
          // Check if product tags include the skin type
          skinTypeMatch = productTags.includes(needs.skinType.toLowerCase());
          
          // If no direct skin type match, check if product description mentions skin type
          if (!skinTypeMatch && product.description) {
            const desc = product.description.toLowerCase();
            skinTypeMatch = desc.includes(needs.skinType.toLowerCase());
          }
        }
        
        // Check concerns match
        let concernMatch = true; // Default to true if no concerns specified
        if (needs.concerns && needs.concerns.length > 0) {
          concernMatch = needs.concerns.some(concern => {
            // Check if product tags include the concern
            let tagMatch = productTags.includes(concern.toLowerCase());
            
            // If no direct tag match, check if product description mentions concern
            if (!tagMatch && product.description) {
              const desc = product.description.toLowerCase();
              tagMatch = desc.includes(concern.toLowerCase());
            }
            
            return tagMatch;
          });
        }
        
        // Both skin type and concern must match (if specified)
        return skinTypeMatch && concernMatch;
      });
    }
    
    // If no products match the filters, return all products from the collection
    if (filteredProducts.length === 0) {
      console.log('No products matched the filters, returning all products from collection');
      filteredProducts = collectionData.products;
    }
    
    // Limit to top 5 recommendations
    return {
      collection: collectionData.collection,
      products: filteredProducts.slice(0, 5)
    };
  } catch (error) {
    console.error('Collection-based product recommendation error:', error);
    throw error;
  }
}

module.exports = {
  getProducts,
  recommendProducts,
  getCollections,
  getProductsByCollection,
  recommendProductsByCollection
};
