import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
}

interface ProductCategory {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      addToCart(product);
      // Add a small delay for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          {primaryImage ? (
            <img
              src={primaryImage.imageUrl}
              alt={primaryImage.altText || product.name}
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder">
              <span>No Image</span>
            </div>
          )}
          {hasDiscount && (
            <div className="discount-badge">
              -{discountPercentage}%
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-category">
            {product.category.name}
          </div>
          
          <h3 className="product-name">{product.name}</h3>
          
          {product.description && (
            <p className="product-description">
              {product.description.length > 100 
                ? `${product.description.substring(0, 100)}...`
                : product.description
              }
            </p>
          )}
          
          <div className="product-pricing">
            <span className="current-price">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="original-price">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button 
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;