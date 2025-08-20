import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock Apollo Client to avoid GraphQL calls in tests
jest.mock('../../graphql/apollo-client', () => ({
  apolloClient: {
    query: jest.fn(),
    watchQuery: jest.fn(),
    mutate: jest.fn(),
  }
}));

// Mock all components that use GraphQL
jest.mock('../HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../ProductCatalog', () => {
  return function MockProductCatalog() {
    return <div data-testid="product-catalog">Product Catalog</div>;
  };
});

jest.mock('../ProductDetail', () => {
  return function MockProductDetail() {
    return <div data-testid="product-detail">Product Detail</div>;
  };
});

jest.mock('../Login', () => {
  return function MockLogin() {
    return <div data-testid="login">Login</div>;
  };
});

jest.mock('../Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

jest.mock('../Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing with React Router future flags', () => {
    // This test verifies that the React Router future flags don't cause any issues
    render(<App />);
    
    // Check that navigation is rendered
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  test('React Router is configured with future flags', () => {
    // Create a spy to capture console warnings
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<App />);
    
    // Check that no React Router future flag warnings are logged
    const routerWarnings = consoleSpy.mock.calls.filter(call =>
      call[0] && call[0].includes && (
        call[0].includes('v7_startTransition') ||
        call[0].includes('v7_relativeSplatPath')
      )
    );
    
    expect(routerWarnings).toHaveLength(0);
    
    consoleSpy.mockRestore();
  });

  test('App structure is correct', () => {
    render(<App />);
    
    // Verify the main App div is present
    const appDiv = document.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
    
    // Verify navigation is present
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });
});