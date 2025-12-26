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
    console.log('Getting products for collection handle:', collectionHandle);
    
    // First, try to get products using tag-based search if needs are provided
    if (needs && (needs.skinType || (needs.concerns && needs.concerns.length > 0))) {
      console.log('Attempting tag-based search with needs:', needs);
      
      const tagFilters = {
        skinType: needs.skinType,
        concerns: needs.concerns
      };
      
      // Try to get products based on tags
      let tagBasedProducts = await getProducts(tagFilters);
      
      if (tagBasedProducts && tagBasedProducts.length > 0) {
        console.log(`Found ${tagBasedProducts.length} products via tag-based search`);
        return {
          collection: { id: null, title: collectionHandle },
          products: tagBasedProducts.slice(0, 5)
        };
      } else {
        console.log('No products found via tag-based search, falling back to collection-based');
      }
    }
    
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

// Recommend products by skin type and concerns using tags (primary) and collections (fallback)
async function recommendProductsByCollections(needs) {
  try {
    console.log('Starting tag-based recommendations with needs:', needs);
    
    // First, try tag-based recommendations which is more precise
    if (needs.concerns && needs.concerns.length > 0) {
      // Create filters for tag-based search
      const tagFilters = {
        skinType: needs.skinType,
        concerns: needs.concerns
      };
      
      console.log('Attempting tag-based search with filters:', tagFilters);
      
      // Try to get products based on tags
      let tagBasedProducts = await getProducts(tagFilters);
      
      if (tagBasedProducts && tagBasedProducts.length > 0) {
        console.log(`Found ${tagBasedProducts.length} products via tag-based search`);
        // Limit to top 5 recommendations
        return tagBasedProducts.slice(0, 5);
      } else {
        console.log('No products found via tag-based search, falling back to collection-based');
      }
    }
    
    // If tag-based search fails or no concerns are specified, fall back to collection-based approach
    // Get all collections
    const allCollections = await getCollections(20);
    
    // Determine which collections to prioritize based on needs
    let relevantCollectionHandles = [];
    
    // Map skin types and concerns to relevant collections
    if (needs.skinType) {
      switch(needs.skinType.toLowerCase()) {
        case 'oily':
          relevantCollectionHandles = ['oily-skin', 'acne', 'mattifying', 'cleansers', 'toners'];
          break;
        case 'dry':
          relevantCollectionHandles = ['dry-skin', 'hydrating', 'moisturizers', 'oils', 'creams'];
          break;
        case 'combination':
          relevantCollectionHandles = ['combination-skin', 'balancing', 'cleansers', 'toners', 'light-moisturizers'];
          break;
        case 'sensitive':
          relevantCollectionHandles = ['sensitive-skin', 'gentle', 'soothing', 'fragrance-free'];
          break;
        default:
          relevantCollectionHandles = ['skin-care', 'bestsellers', 'new-arrival'];
      }
    }
    
    // Add concern-specific collections
    if (needs.concerns && needs.concerns.length > 0) {
      needs.concerns.forEach(concern => {
        switch(concern.toLowerCase()) {
          case 'acne':
            relevantCollectionHandles.push('acne', 'blemish-control', 'clarifying', 'spot-treatment');
            break;
          case 'dullness':
            relevantCollectionHandles.push('brightening', 'exfoliators', 'vitamin-c', 'peels');
            break;
          case 'hydration':
            relevantCollectionHandles.push('hydrating', 'moisturizers', 'serums', 'essences', 'sheet-masks');
            break;
          case 'anti-aging':
            relevantCollectionHandles.push('anti-ageing', 'retinol', 'peptides', 'firming');
            break;
          case 'dark-spots':
            relevantCollectionHandles.push('brightening', 'vitamin-c', 'niacinamide', 'acne-scars');
            break;
          case 'dark-circles':
            relevantCollectionHandles.push('eye-care', 'under-eye', 'dark-circles', 'eye-serum');
            break;
          case 'dry-lips':
            relevantCollectionHandles.push('lip-care', 'dry-lips', 'lip-balm', 'lip-treatment');
            break;
          case 'redness':
            relevantCollectionHandles.push('soothing', 'redness', 'centella', 'calming');
            break;
          case 'pores':
            relevantCollectionHandles.push('pore-minimizing', 'exfoliators', 'clay-masks', 'toners');
            break;
          case 'texture':
            relevantCollectionHandles.push('exfoliators', 'peels', 'smoothing', 'ahabha');
            break;
        }
      });
    }
    
    // Remove duplicates
    relevantCollectionHandles = [...new Set(relevantCollectionHandles)];
    
    // Get products from relevant collections
    let allRelevantProducts = [];
    
    for (const handle of relevantCollectionHandles) {
      try {
        // Check if the collection exists in the store
        const matchingCollection = allCollections.find(coll => 
          coll.handle.toLowerCase() === handle.toLowerCase()
        );
        
        if (matchingCollection) {
          const collectionProducts = await getProductsByCollection(handle, 10);
          allRelevantProducts = allRelevantProducts.concat(collectionProducts.products);
        }
      } catch (err) {
        // Skip collections that don't exist
        console.log(`Collection ${handle} not found, skipping...`, err.message);
      }
    }
    
    // If no products found from specific collections, get from general collections
    if (allRelevantProducts.length === 0) {
      console.log('No products found in specific collections, trying general collections');
      
      const generalCollections = ['skin-care', 'bestsellers', 'new-arrival'];
      for (const handle of generalCollections) {
        try {
          const collectionProducts = await getProductsByCollection(handle, 10);
          allRelevantProducts = allRelevantProducts.concat(collectionProducts.products);
          if (allRelevantProducts.length >= 10) break; // Stop if we have enough products
        } catch (err) {
          console.log(`General collection ${handle} not found, skipping...`, err.message);
        }
      }
    }
    
    // Filter products by needs if provided
    if (needs.skinType || (needs.concerns && needs.concerns.length > 0)) {
      allRelevantProducts = allRelevantProducts.filter(product => {
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
    
    // Remove duplicates based on product ID
    const uniqueProducts = [];
    const seenIds = new Set();
    
    for (const product of allRelevantProducts) {
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id);
        uniqueProducts.push(product);
      }
    }
    
    // Limit to top 5 recommendations
    return uniqueProducts.slice(0, 5);
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
  recommendProductsByCollection,
  recommendProductsByCollections
};
