import React from 'react';
import { Link } from 'react-router-dom';
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
    </div>
  );
};

export default ProductCard;