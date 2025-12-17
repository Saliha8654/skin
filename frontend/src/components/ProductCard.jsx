import { useState } from 'react';

function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!product.variantId || !product.availableForSale) {
      alert('This product is currently unavailable');
      return;
    }

    setIsAdding(true);

    try {
      // Add to Shopify cart using AJAX API
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.variantId.split('/').pop(), // Extract numeric ID
          quantity: 1
        })
      });

      if (response.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        
        // Trigger Shopify cart refresh event
        window.dispatchEvent(new Event('cart:refresh'));
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      
      // Fallback: redirect to product page
      window.open(product.url, '_blank');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Product Image */}
        {product.image && (
          <img
            src={product.image}
            alt={product.imageAlt || product.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-primary line-clamp-2 mb-1">
            {product.title}
          </h4>
          
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {product.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">
              £{parseFloat(product.price).toFixed(2)}
            </span>

            {product.availableForSale ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || added}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-white hover:bg-opacity-90'
                } disabled:opacity-50`}
                style={{
                  borderColor: '#0c2e4d',
                  borderWidth: '3px',
                  borderStyle: 'solid'
                }}
              >
                {added ? '✓ Added' : isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            ) : (
              <span className="text-xs text-gray-400">Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* View Product Link */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary hover:underline mt-2 inline-block"
      >
        View details →
      </a>
    </div>
  );
}

export default ProductCard;
