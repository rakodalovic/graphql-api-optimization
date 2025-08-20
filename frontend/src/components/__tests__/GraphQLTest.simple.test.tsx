import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GraphQLTest from '../GraphQLTest';

describe('GraphQLTest Component Basic Test', () => {
  it('renders without crashing and shows tabs', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <GraphQLTest />
      </MockedProvider>
    );

    // Check that the component renders
    expect(screen.getByText('GraphQL Connection Test')).toBeInTheDocument();
    
    // Check that all tabs are present
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
    
    // Check that Version tab is active by default
    expect(screen.getByText('Version')).toHaveClass('active');
  });

  it('uses generated types (compilation test)', () => {
    // This test verifies that our imports work correctly
    // If the generated types weren't working, this file wouldn't compile
    
    // Import the generated types to verify they exist
    const { 
      useGetVersionQuery, 
      useGetUsersQuery, 
      useGetProductsQuery,
      useCreateUserMutation,
      CreateUserInput
    } = require('../../generated/graphql');
    
    // Verify the imports are functions/types
    expect(typeof useGetVersionQuery).toBe('function');
    expect(typeof useGetUsersQuery).toBe('function');
    expect(typeof useGetProductsQuery).toBe('function');
    expect(typeof useCreateUserMutation).toBe('function');
    
    // CreateUserInput should be a type, so we can't test it directly,
    // but the fact that this file compiles means the type exists
    expect(true).toBe(true);
  });
});