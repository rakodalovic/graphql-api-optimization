import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_FEATURED_PRODUCTS } from '../graphql/queries';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './HomePage.css';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: {
    id: number;
    name: string;
  };
  images: Array<{
    id: number;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
  }>;
}

interface FeaturedProductsData {
  products: {
    nodes: Product[];
  };
}

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery<FeaturedProductsData>(GET_FEATURED_PRODUCTS, {
    variables: { first: 8 }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const featuredProducts = data?.products?.nodes || [];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to GraphMart</h1>
          <p>Your premium destination for quality products with lightning-fast performance</p>
          <Link to="/catalog" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          <p className="section-subtitle">
            Carefully curated products for the discerning customer
          </p>
          
          {featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No featured products available at the moment.</p>
            </div>
          )}
          
          <div className="view-all-container">
            <Link to="/catalog" className="view-all-button">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Choose GraphMart?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Premium Quality</h3>
              <p>Every product is carefully selected and tested to meet our high standards of quality and reliability.</p>
            </div>
            <div className="benefit-card">
              <h3>Fast Delivery</h3>
              <p>Lightning-fast shipping with real-time tracking to get your products to you as quickly as possible.</p>
            </div>
            <div className="benefit-card">
              <h3>Expert Support</h3>
              <p>Our knowledgeable customer service team is here to help you make the right choice.</p>
            </div>
            <div className="benefit-card">
              <h3>Secure Shopping</h3>
              <p>Shop with confidence knowing your data and payments are protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;