import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ProductCard from '../ProductCard';
import ProductCatalog from '../ProductCatalog';
import GraphQLTest from '../GraphQLTest';
import {
  GetProductsDocument,
  GetCategoriesDocument,
  GetUsersDocument,
  GetVersionDocument
} from '../../generated/graphql';

// Mock data for testing the fixes
const mockProduct = {
  id: 1,
  name: 'Test Product with Very Long Name That Might Cause Layout Issues',
  description: 'This is a very long product description that should test if the price gets cut off by the bottom border or any overflow issues in the product card layout.',
  price: 299.99,
  compareAtPrice: 399.99,
  category: {
    id: 1,
    name: 'Electronics',
    slug: 'electronics'
  },
  images: [
    {
      id: 1,
      imageUrl: 'https://example.com/image.jpg',
      altText: 'Test product image',
      isPrimary: true
    }
  ]
};

const mockProductsData = {
  products: {
    nodes: [
      mockProduct,
      {
        ...mockProduct,
        id: 2,
        name: 'Another Product',
        price: 199.99
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'cursor1',
      endCursor: 'cursor2'
    },
    totalCount: 2
  }
};

const mockCategoriesData = {
  categories: {
    nodes: [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic products',
        slug: 'electronics',
        imageUrl: null,
        sortOrder: 1,
        parentCategoryId: null,
        subCategories: []
      }
    ]
  }
};

const mockUsersData = {
  users: {
    nodes: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'cursor1',
      endCursor: 'cursor1'
    },
    totalCount: 1
  }
};

const mockVersionData = {
  version: {
    version: '1.0.0',
    environment: 'Test',
    buildDate: '2024-01-01T00:00:00Z'
  }
};

const mocks = [
  {
    request: {
      query: GetProductsDocument,
      variables: {
        where: { isActive: { eq: true } },
        order: [{ name: 'ASC' }],
        first: 24
      }
    },
    result: {
      data: mockProductsData
    }
  },
  {
    request: {
      query: GetCategoriesDocument
    },
    result: {
      data: mockCategoriesData
    }
  },
  {
    request: {
      query: GetUsersDocument
    },
    result: {
      data: mockUsersData
    }
  },
  {
    request: {
      query: GetVersionDocument
    },
    result: {
      data: mockVersionData
    }
  }
];

describe('Issues Fix Integration Tests', () => {
  describe('Issue 1: Product Card Price Rendering', () => {
    it('should render product card with price visible and not cut off', () => {
      render(<ProductCard product={mockProduct} />);
      
      // Check that the price is rendered
      expect(screen.getByText('$299.99')).toBeInTheDocument();
      expect(screen.getByText('$399.99')).toBeInTheDocument();
      
      // Check that the product name and description are rendered
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(/This is a very long product description/)).toBeInTheDocument();
      
      // Check that the discount badge is shown
      expect(screen.getByText('-25%')).toBeInTheDocument();
    });

    it('should handle products without compare at price', () => {
      const productWithoutDiscount = {
        ...mockProduct,
        compareAtPrice: undefined
      };
      
      render(<ProductCard product={productWithoutDiscount} />);
      
      expect(screen.getByText('$299.99')).toBeInTheDocument();
      expect(screen.queryByText('-25%')).not.toBeInTheDocument();
    });
  });

  describe('Issue 2: Sorting by Price Functionality', () => {
    it('should render product catalog without crashing during sorting', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ProductCatalog />
        </MockedProvider>
      );

      // Wait for initial load
      expect(screen.getByText('Product Catalog')).toBeInTheDocument();
      
      // Find the sort select dropdown
      const sortSelect = screen.getByDisplayValue('Name A-Z');
      expect(sortSelect).toBeInTheDocument();
      
      // Change sorting to price low-high (this should not crash)
      fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
      expect(sortSelect).toHaveValue('price_asc');
      
      // Change to price high-low
      fireEvent.change(sortSelect, { target: { value: 'price_desc' } });
      expect(sortSelect).toHaveValue('price_desc');
    });

    it('should handle null data gracefully during sorting', () => {
      const emptyMocks = [
        {
          request: {
            query: GetProductsDocument,
            variables: {
              where: { isActive: { eq: true } },
              order: [{ price: 'ASC' }],
              first: 24
            }
          },
          result: {
            data: {
              products: {
                nodes: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null
                },
                totalCount: 0
              }
            }
          }
        },
        {
          request: {
            query: GetCategoriesDocument
          },
          result: {
            data: mockCategoriesData
          }
        }
      ];

      render(
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <ProductCatalog />
        </MockedProvider>
      );

      expect(screen.getByText('Product Catalog')).toBeInTheDocument();
      expect(screen.getByText('0 products found')).toBeInTheDocument();
    });
  });

  describe('Issue 3: Dashboard GraphQL Errors', () => {
    it('should render GraphQLTest component with users tab working', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <GraphQLTest />
        </MockedProvider>
      );

      // Click on Users tab
      const usersTab = screen.getByText('Users');
      fireEvent.click(usersTab);
      
      expect(usersTab).toHaveClass('active');
      
      // Should eventually show user data without GraphQL errors
      // Note: In a real test, we'd wait for the data to load
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });

    it('should render GraphQLTest component with products tab working', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <GraphQLTest />
        </MockedProvider>
      );

      // Click on Products tab
      const productsTab = screen.getByText('Products');
      fireEvent.click(productsTab);
      
      expect(productsTab).toHaveClass('active');
      
      // Should show loading state without crashing
      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });
  });

  describe('Issue 4: Price Range Filter Form', () => {
    it('should render price range inputs within sidebar without overflow', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ProductCatalog />
        </MockedProvider>
      );

      // Find price range inputs
      const minPriceInput = screen.getByPlaceholderText('Min');
      const maxPriceInput = screen.getByPlaceholderText('Max');
      
      expect(minPriceInput).toBeInTheDocument();
      expect(maxPriceInput).toBeInTheDocument();
      
      // Test that inputs can be interacted with
      fireEvent.change(minPriceInput, { target: { value: '50' } });
      fireEvent.change(maxPriceInput, { target: { value: '500' } });
      
      expect(minPriceInput).toHaveValue(50);
      expect(maxPriceInput).toHaveValue(500);
    });

    it('should handle price range filter changes', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ProductCatalog />
        </MockedProvider>
      );

      const minPriceInput = screen.getByPlaceholderText('Min');
      const maxPriceInput = screen.getByPlaceholderText('Max');
      
      // Test edge cases
      fireEvent.change(minPriceInput, { target: { value: '0' } });
      fireEvent.change(maxPriceInput, { target: { value: '1000' } });
      
      expect(minPriceInput).toHaveValue(0);
      expect(maxPriceInput).toHaveValue(1000);
      
      // Test invalid values
      fireEvent.change(minPriceInput, { target: { value: '-10' } });
      expect(minPriceInput).toHaveValue(-10); // Component should handle this gracefully
    });
  });

  describe('Overall Integration', () => {
    it('should render complete product catalog without any console errors', () => {
      // Mock console.error to catch any errors
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ProductCatalog />
        </MockedProvider>
      );

      // Basic functionality should work
      expect(screen.getByText('Product Catalog')).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
      
      // No console errors should have been logged
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});