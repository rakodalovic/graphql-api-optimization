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

  const featuredProducts = data?.products.nodes || [];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to GraphQL Store</h1>
          <p>Discover amazing products with efficient GraphQL-powered data fetching</p>
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
            Handpicked products showcasing GraphQL's efficiency in fetching only the data you need
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
          <h2>Why Choose GraphQL?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Efficient Data Fetching</h3>
              <p>Get exactly the data you need in a single request, reducing over-fetching and under-fetching.</p>
            </div>
            <div className="benefit-card">
              <h3>Strong Type System</h3>
              <p>Built with HotChocolate for .NET, providing type safety and excellent developer experience.</p>
            </div>
            <div className="benefit-card">
              <h3>Real-time Updates</h3>
              <p>Support for subscriptions enables real-time updates for better user experience.</p>
            </div>
            <div className="benefit-card">
              <h3>Single Endpoint</h3>
              <p>One endpoint for all your data needs, simplifying API management and client integration.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;