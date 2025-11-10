import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_PRODUCTS_BY_PRICE, GET_CATEGORIES } from '../graphql/queries';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ProductCatalog.css';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: Array<{
    id: number;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
  }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface ProductsData {
  products: {
    nodes: Product[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    totalCount: number;
  };
}

interface ProductsByPriceData {
  productsByPrice: {
    nodes: Product[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    totalCount: number;
  };
}

interface CategoriesData {
  categories: {
    nodes: Category[];
  };
}

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest';
type ViewMode = 'grid' | 'list';

const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Handle Enter key press for search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSearchTerm(searchTerm);
    }
  };

  // Handle search button click
  const handleSearchSubmit = () => {
    setActiveSearchTerm(searchTerm);
  };

  // Build filter variables for GraphQL query
  const buildWhereClause = () => {
    const where: any = {
      isActive: { eq: true }
    };

    if (selectedCategory) {
      where.categoryId = { eq: selectedCategory };
    }

    if (activeSearchTerm) {
      where.or = [
        { name: { contains: activeSearchTerm } },
        { description: { contains: activeSearchTerm } }
      ];
    }

    // Apply price filter when range is different from default values
    if (priceRange.min > 0 || priceRange.max !== 1000) {
      where.price = {
        gte: priceRange.min,
        lte: priceRange.max
      };
    }

    return where;
  };

  // Determine which query to use based on sorting
  const isPriceSorting = sortBy === 'price_asc' || sortBy === 'price_desc';
  const queryToUse = isPriceSorting ? GET_PRODUCTS_BY_PRICE : GET_PRODUCTS;

  // Build order parameter for name and date sorting
  const getOrderParam = () => {
    switch (sortBy) {
      case 'name_asc':
        return [{ name: 'ASC' }];
      case 'name_desc':
        return [{ name: 'DESC' }];
      case 'newest':
        return [{ createdAt: 'DESC' }];
      default:
        return undefined;
    }
  };

  // Build variables for the selected query
  const queryVariables = isPriceSorting
    ? {
      where: buildWhereClause(),
      ascending: sortBy === 'price_asc',
      first: 24
    }
    : {
      where: buildWhereClause(),
      order: getOrderParam(),
      first: 24
    };

  const { loading: productsLoading, error: productsError, data: productsData } = useQuery<ProductsData | ProductsByPriceData>(
    queryToUse,
    {
      variables: queryVariables,
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    }
  );

  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery<CategoriesData>(
    GET_CATEGORIES
  );

  // Extract products from the correct field based on which query was used
  const products: Product[] = isPriceSorting
    ? (productsData as ProductsByPriceData)?.productsByPrice?.nodes || []
    : (productsData as ProductsData)?.products?.nodes || [];

  // Filter out parent categories that have subcategories
  // Keep only leaf categories (those without subcategories or with empty subcategories array)
  const allCategories = categoriesData?.categories?.nodes || [];
  const categories = allCategories.filter(cat =>
    !cat.subCategories || cat.subCategories.length === 0
  );

  const totalCount = isPriceSorting
    ? (productsData as ProductsByPriceData)?.productsByPrice?.totalCount || 0
    : (productsData as ProductsData)?.products?.totalCount || 0;

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 1000 });
    setSearchTerm('');
    setActiveSearchTerm('');
    setSortBy('name_asc');
  };

  return (
    <div className="product-catalog">
      {/* Show error banner if there's an error */}
      {productsError && !productsData && (
        <div style={{ padding: '20px' }}>
          <ErrorMessage message={productsError.message} />
        </div>
      )}
      <div className="catalog-header">
        <div className="container">
          <h1>Product Catalog</h1>
          <p>Discover our collection with powerful GraphQL-driven filtering and sorting</p>
        </div>
      </div>

      <div className="catalog-content">
        <div className="container">
          <div className="catalog-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <button onClick={clearFilters} className="clear-filters">
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="filter-section">
                <h4>Search</h4>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    className="search-input"
                  />
                  <button
                    onClick={handleSearchSubmit}
                    className="search-button"
                    type="button"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h4>Categories</h4>
                {categoriesLoading ? (
                  <div>Loading categories...</div>
                ) : categoriesError ? (
                  <div>Error loading categories</div>
                ) : (
                  <div className="category-list">
                    <button
                      className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(null)}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange.max)}
                    className="price-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange(priceRange.min, Number(e.target.value))}
                    className="price-input"
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="catalog-main">
              {/* Toolbar */}
              <div className="catalog-toolbar">
                <div className="results-info">
                  <span>{totalCount} products found</span>
                  {productsLoading && <span className="loading-indicator">Updating...</span>}
                </div>

                <div className="toolbar-controls">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="sort-select"
                  >
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="price_asc">Price Low-High</option>
                    <option value="price_desc">Price High-Low</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode */}
                  <div className="view-mode-toggle">
                    <button
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                    >
                      ⊞
                    </button>
                    <button
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className="products-section" style={{ position: 'relative', minHeight: '400px' }}>
                {productsLoading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    borderRadius: '8px'
                  }}>
                    <LoadingSpinner />
                  </div>
                )}
                {!productsLoading && products.length === 0 ? (
                  <div className="no-products">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className={`products-container ${viewMode}`} style={{ opacity: productsLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    {products.map((product: Product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;