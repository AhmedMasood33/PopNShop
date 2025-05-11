import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    itemId: number;
    name: string;
    price: number;
    description: string;
    category: string;
    available: boolean;
    condition: string;
    quantity: number;
    imageName: string;
    imageData: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.itemId)) {
      removeFromWishlist(product.itemId);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getConditionBadge = (condition: string) => {
    const badgeColors: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'like new': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badgeColors[condition]}`}>
        {condition}
      </span>
    );
  };

  // If imageData exists, render it using base64 encoding
  const imageUrl = product.imageData
    ? `data:image/jpeg;base64,${product.imageData}`
    : `/images/products/${product.imageName}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <Link to={`/product/${product.itemId}`} className="block">
        <div className="relative">
          <img
            src={imageUrl} // Use the base64 image or fallback URL
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${isInWishlist(product.itemId)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700 hover:text-red-500'
              } shadow-sm`}
            aria-label={isInWishlist(product.itemId) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={isInWishlist(product.itemId) ? "white" : "none"} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
            <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{product.category}</span>
              <span className={`text-sm ${product.available ? 'text-green-500' : 'text-red-500'}`}>
                {product.available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {getConditionBadge(product.condition)} {/* Display product condition */}
          </div>
        </div>
      </Link>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${product.available ? '' : 'cursor-not-allowed opacity-50'}`}
          disabled={!product.available}
        >
          {product.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
