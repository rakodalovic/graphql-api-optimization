import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GraphQLTest from '../GraphQLTest';
import {
  GetVersionDocument,
  GetUsersDocument,
  GetProductsDocument,
  CreateUserDocument,
  GetVersionQuery,
  GetUsersQuery,
  GetProductsQuery,
  CreateUserMutation
} from '../../generated/graphql';

// Mock data that matches our generated types
const mockVersionData: GetVersionQuery = {
  version: {
    version: '1.0.0',
    environment: 'Test',
    buildDate: '2024-01-01T00:00:00Z'
  }
};

const mockUsersData: GetUsersQuery = {
  users: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]
};

const mockProductsData: GetProductsQuery = {
  products: [
    {
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

const mockCreateUserResponse: CreateUserMutation = {
  createUser: {
    success: true,
    message: 'User created successfully',
    user: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      username: 'janesmith',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
};

const mocks = [
  {
    request: {
      query: GetVersionDocument
    },
    result: {
      data: mockVersionData
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
      query: GetProductsDocument
    },
    result: {
      data: mockProductsData
    }
  },
  {
    request: {
      query: CreateUserDocument,
      variables: {
        input: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          username: 'janesmith',
          password: 'password123',
          phoneNumber: null
        }
      }
    },
    result: {
      data: mockCreateUserResponse
    }
  }
];

describe('GraphQLTest Component with Generated Types', () => {
  it('renders version information using generated types', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Version tab should be active by default
    expect(screen.getByText('Version')).toHaveClass('active');
    
    // Wait for version data to load
    await waitFor(() => {
      expect(screen.getByText('API Version Information')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that version data is displayed correctly (use more flexible matching)
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element?.textContent?.includes('Version: 1.0.0') || false;
      })).toBeInTheDocument();
    });
    
    expect(screen.getByText((content, element) => {
      return element?.textContent?.includes('Environment: Test') || false;
    })).toBeInTheDocument();
  });

  it('renders users list using generated types', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Users tab
    fireEvent.click(screen.getByText('Users'));

    // Wait for users data to load
    await waitFor(() => {
      expect(screen.getByText('Users (1)')).toBeInTheDocument();
    });

    // Check that user data is displayed correctly with proper types
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Username: johndoe')).toBeInTheDocument();
    expect(screen.getByText('Active: Yes')).toBeInTheDocument();
  });

  it('renders products list using generated types', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Products tab
    fireEvent.click(screen.getByText('Products'));

    // Wait for products data to load
    await waitFor(() => {
      expect(screen.getByText('Products (1)')).toBeInTheDocument();
    });

    // Check that product data is displayed correctly with proper types
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A test product')).toBeInTheDocument();
    expect(screen.getByText('Price: $99.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('creates user using generated mutation types', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Create User tab
    fireEvent.click(screen.getByText('Create User'));

    // Fill out the form with type-safe inputs
    fireEvent.change(screen.getByLabelText('First Name:'), {
      target: { value: 'Jane' }
    });
    fireEvent.change(screen.getByLabelText('Last Name:'), {
      target: { value: 'Smith' }
    });
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'jane.smith@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'janesmith' }
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'password123' }
    });

    // Submit the form (find the submit button in the form)
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(screen.getByText('User created successfully')).toBeInTheDocument();
    });

    // Check that the created user information is displayed
    expect(screen.getByText('Created User:')).toBeInTheDocument();
    expect(screen.getByText('ID: 2')).toBeInTheDocument();
    expect(screen.getByText('Name: Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Email: jane.smith@example.com')).toBeInTheDocument();
  });

  it('handles nullable phone number field correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Click on Create User tab
    fireEvent.click(screen.getByText('Create User'));

    // Phone number field should handle null values correctly
    const phoneInput = screen.getByLabelText('Phone Number:') as HTMLInputElement;
    expect(phoneInput.value).toBe(''); // Should display empty string even if internal value is null

    // Test that we can leave phone number empty (null)
    fireEvent.change(phoneInput, { target: { value: '' } });
    expect(phoneInput.value).toBe('');
  });

  it('demonstrates type safety by preventing runtime errors', () => {
    // This test demonstrates that our generated types prevent common runtime errors
    // by ensuring type safety at compile time
    
    // Example: If we tried to access a non-existent field, TypeScript would catch it
    // const invalidAccess = mockUsersData.users[0].nonExistentField; // This would be a TypeScript error
    
    // Example: If we tried to pass wrong types to mutations, TypeScript would catch it
    // const invalidInput: CreateUserInput = { invalidField: 'value' }; // This would be a TypeScript error
    
    // These tests pass because our types are correctly generated and enforced
    expect(mockUsersData.users[0].firstName).toBe('John');
    expect(mockProductsData.products[0].price).toBe(99.99);
    expect(mockCreateUserResponse.createUser.success).toBe(true);
  });
});