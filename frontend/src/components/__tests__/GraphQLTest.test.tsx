import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GraphQLTest from '../GraphQLTest';
import { GET_VERSION, GET_USERS, GET_PRODUCTS } from '../../graphql/queries';
import { CREATE_USER } from '../../graphql/mutations';

// Mock data
const mockVersionData = {
  version: {
    version: '1.0.0',
    environment: 'test',
    buildDate: '2025-08-19T12:00:00Z'
  }
};

const mockUsersData = {
  users: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      username: 'johndoe',
      isActive: true,
      createdAt: '2025-08-19T12:00:00Z',
      updatedAt: null
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      isActive: true,
      createdAt: '2025-08-19T12:00:00Z',
      updatedAt: null
    }
  ]
};

const mockProductsData = {
  products: [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone',
      price: 999.99,
      stockQuantity: 50,
      isActive: true,
      createdAt: '2025-08-19T12:00:00Z',
      updatedAt: null
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      description: 'Premium Android phone',
      price: 899.99,
      stockQuantity: 30,
      isActive: true,
      createdAt: '2025-08-19T12:00:00Z',
      updatedAt: null
    }
  ]
};

// Apollo Client mocks
const mocks = [
  {
    request: {
      query: GET_VERSION
    },
    result: {
      data: mockVersionData
    }
  },
  {
    request: {
      query: GET_USERS
      // Note: No variables should be passed for the fixed queries
    },
    result: {
      data: mockUsersData
    }
  },
  {
    request: {
      query: GET_PRODUCTS
      // Note: No variables should be passed for the fixed queries
    },
    result: {
      data: mockProductsData
    }
  }
];

describe('GraphQLTest Component - Pagination Fix', () => {
  it('should render without crashing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );
    
    expect(screen.getByText('GraphQL Connection Test')).toBeInTheDocument();
  });

  it('should load users data without pagination arguments', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Users tab
    const usersTab = screen.getByText('Users');
    usersTab.click();

    // Wait for users data to load
    await waitFor(() => {
      expect(screen.getByText('Users (2)')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should load products data without pagination arguments', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Products tab
    const productsTab = screen.getByText('Products');
    productsTab.click();

    // Wait for products data to load
    await waitFor(() => {
      expect(screen.getByText('Products (2)')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
    });
  });

  it('should display version information correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Version tab should be active by default
    await waitFor(() => {
      expect(screen.getByText('Version: 1.0.0')).toBeInTheDocument();
      expect(screen.getByText('Environment: test')).toBeInTheDocument();
    });
  });

  it('should show loading states', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Should show loading spinner initially
    expect(screen.getByText('Loading version info...')).toBeInTheDocument();
  });
});

describe('GraphQL Query Structure - Pagination Fix Validation', () => {
  it('should verify GET_USERS query does not include pagination arguments', () => {
    // This test validates that our fix removed pagination arguments
    const queryString = GET_USERS.loc?.source.body;
    
    // Should not contain pagination arguments
    expect(queryString).not.toContain('$first: Int');
    expect(queryString).not.toContain('$after: String');
    expect(queryString).not.toContain('first: $first');
    expect(queryString).not.toContain('after: $after');
    
    // Should contain the basic query structure
    expect(queryString).toContain('query GetUsers');
    expect(queryString).toContain('users {');
  });

  it('should verify GET_PRODUCTS query does not include pagination arguments', () => {
    // This test validates that our fix removed pagination arguments
    const queryString = GET_PRODUCTS.loc?.source.body;
    
    // Should not contain pagination arguments
    expect(queryString).not.toContain('$first: Int');
    expect(queryString).not.toContain('$after: String');
    expect(queryString).not.toContain('first: $first');
    expect(queryString).not.toContain('after: $after');
    
    // Should contain the basic query structure
    expect(queryString).toContain('query GetProducts');
    expect(queryString).toContain('products {');
  });
});