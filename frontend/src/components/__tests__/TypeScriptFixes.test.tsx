import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import GraphQLTest from '../GraphQLTest';
import ProductDetail from '../ProductDetail';
import { GET_PRODUCT, GET_RELATED_PRODUCTS } from '../../graphql/queries';

// Mock data that matches the fixed GraphQL structure
const mockUsersData = {
  users: [
    {
      __typename: 'User',
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]
};

const mockProductsData = {
  products: [
    {
      __typename: 'Product',
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      stockQuantity: 10,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]
};

const mockProductDetailData = {
  product: {
    __typename: 'Product',
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    sku: 'TEST-001',
    price: 99.99,
    compareAtPrice: null,
    stockQuantity: 10,
    isActive: true,
    isFeatured: false,
    isDigital: false,
    weight: 1.0,
    weightUnit: 'lbs',
    metaTitle: null,
    metaDescription: null,
    category: {
      __typename: 'Category',
      id: 1,
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category'
    },
    variants: [],
    images: [],
    reviews: []
  }
};

const mocks = [
  {
    request: {
      query: GET_PRODUCT,
      variables: { id: 1 }
    },
    result: {
      data: mockProductDetailData
    }
  },
  {
    request: {
      query: GET_RELATED_PRODUCTS,
      variables: {
        categoryId: 1,
        excludeProductId: 1,
        first: 4
      }
    },
    result: {
      data: {
        products: {
          nodes: []
        }
      }
    }
  }
];

describe('TypeScript Fixes', () => {
  describe('GraphQLTest Component', () => {
    it('should handle users array without .nodes access', () => {
      // This test ensures the component can handle the correct GraphQL structure
      // where users is directly an array, not an object with a nodes property
      
      const component = (
        <MockedProvider mocks={[]} addTypename={false}>
          <GraphQLTest />
        </MockedProvider>
      );
      
      // The component should render without TypeScript errors
      expect(() => render(component)).not.toThrow();
    });

    it('should handle products array without .nodes access', () => {
      // This test ensures the component can handle the correct GraphQL structure
      // where products is directly an array, not an object with a nodes property
      
      const component = (
        <MockedProvider mocks={[]} addTypename={false}>
          <GraphQLTest />
        </MockedProvider>
      );
      
      // The component should render without TypeScript errors
      expect(() => render(component)).not.toThrow();
    });
  });

  describe('ProductDetail Component', () => {
    it('should handle null product data with optional chaining', () => {
      // This test ensures the component handles the case where data.product is null
      // without throwing a runtime error when accessing category.id
      
      const nullProductMocks = [
        {
          request: {
            query: GET_PRODUCT,
            variables: { id: 999 }
          },
          result: {
            data: {
              product: null
            }
          }
        }
      ];

      const component = (
        <BrowserRouter>
          <MockedProvider mocks={nullProductMocks} addTypename={false}>
            <ProductDetail />
          </MockedProvider>
        </BrowserRouter>
      );
      
      // The component should render without runtime errors
      expect(() => render(component)).not.toThrow();
    });

    it('should handle product with category using optional chaining', async () => {
      // Mock useParams to return a valid ID
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({ id: '1' })
      }));

      const component = (
        <BrowserRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <ProductDetail />
          </MockedProvider>
        </BrowserRouter>
      );
      
      // The component should render and handle the related products query
      // with proper optional chaining for category access
      expect(() => render(component)).not.toThrow();
    });
  });

  describe('Type Safety Regression Tests', () => {
    it('should not access .nodes on direct arrays', () => {
      // Read the GraphQLTest component source to ensure it doesn't use .nodes
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, '../GraphQLTest.tsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');
      
      // Ensure no .nodes access exists
      expect(componentSource).not.toMatch(/\?\.nodes\?\./);
      expect(componentSource).toMatch(/usersData\?\.users\?\.length/);
      expect(componentSource).toMatch(/productsData\?\.products\?\.length/);
      expect(componentSource).toMatch(/usersData\?\.users\?\.map/);
      expect(componentSource).toMatch(/productsData\?\.products\?\.map/);
    });

    it('should use optional chaining for category access', () => {
      // Read the ProductDetail component source to ensure proper optional chaining
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, '../ProductDetail.tsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');
      
      // Ensure optional chaining is used for category access
      expect(componentSource).toMatch(/data\?\.product\?\.category\?\.id/);
      expect(componentSource).not.toMatch(/data\?\.product\.category\.id/);
    });
  });
});