import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT, GET_RELATED_PRODUCTS } from '../graphql/queries';
import ProductCard from './ProductCard';
import ReviewsList from './ReviewsList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ProductDetail.css';

interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVariant {
  id: number;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string;
  attributes: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

interface Review {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface Product {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  weight?: number;
  weightUnit?: string;
  metaTitle?: string;
  metaDescription?: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: Review[];
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: {
    id: number;
    name: string;
  };
  images: ProductImage[];
}

interface ProductData {
  product: Product;
}

interface RelatedProductsData {
  products: {
    nodes: RelatedProduct[];
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const { loading, error, data } = useQuery<ProductData>(GET_PRODUCT, {
    variables: { id: parseInt(id || '0') },
    skip: !id
  });

  const { data: relatedData } = useQuery<RelatedProductsData>(GET_RELATED_PRODUCTS, {
    variables: {
      categoryId: data?.product.category.id,
      excludeProductId: data?.product.id,
      first: 4
    },
    skip: !data?.product
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.product) return <ErrorMessage message="Product not found" />;

  const product = data.product;
  const relatedProducts = relatedData?.products.nodes || [];
  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const hasDiscount = currentComparePrice && currentComparePrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">★</span>);
    }
    return stars;
  };

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/catalog">Catalog</Link>
          <span>/</span>
          <Link to={`/catalog?category=${product.category.id}`}>{product.category.name}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="product-detail-content">
        <div className="container">
          <div className="product-layout">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                {sortedImages.length > 0 ? (
                  <img
                    src={sortedImages[selectedImageIndex].imageUrl}
                    alt={sortedImages[selectedImageIndex].altText || product.name}
                    className="main-product-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              {sortedImages.length > 1 && (
                <div className="image-thumbnails">
                  {sortedImages.map((image, index) => (
                    <button
                      key={image.id}
                      className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={image.imageUrl} alt={image.altText || product.name} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <div className="category-badge">
                  <Link to={`/catalog?category=${product.category.id}`}>
                    {product.category.name}
                  </Link>
                </div>
                <h1>{product.name}</h1>
                {product.sku && (
                  <div className="product-sku">SKU: {product.sku}</div>
                )}
              </div>

              {/* Rating */}
              {product.reviews.length > 0 && (
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(averageRating)}
                  </div>
                  <span className="rating-text">
                    {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Pricing */}
              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">{formatPrice(currentPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="original-price">{formatPrice(currentComparePrice!)}</span>
                      <span className="discount-badge">Save {discountPercentage}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="stock-status">
                {currentStock > 0 ? (
                  <span className="in-stock">
                    ✓ In Stock ({currentStock} available)
                  </span>
                ) : (
                  <span className="out-of-stock">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="product-variants">
                  <h3>Variants</h3>
                  <div className="variants-list">
                    <button
                      className={`variant-btn ${!selectedVariant ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(null)}
                    >
                      Default
                    </button>
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.isActive || variant.stockQuantity === 0}
                      >
                        {variant.name}
                        {variant.price !== product.price && (
                          <span className="variant-price">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="product-details">
                <h3>Product Details</h3>
                <ul>
                  <li><strong>Category:</strong> {product.category.name}</li>
                  {product.weight && (
                    <li><strong>Weight:</strong> {product.weight} {product.weightUnit || 'lbs'}</li>
                  )}
                  <li><strong>Type:</strong> {product.isDigital ? 'Digital' : 'Physical'}</li>
                  {product.isFeatured && (
                    <li><strong>Featured Product</strong></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="container">
          <ReviewsList productId={product.id} initialReviews={product.reviews} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <div className="container">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;