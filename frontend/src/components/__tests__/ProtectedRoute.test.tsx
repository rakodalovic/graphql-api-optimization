import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const renderProtectedRoute = () => {
  return render(
    <BrowserRouter>
      <MockedProvider addTypename={false}>
        <AuthProvider>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthProvider>
      </MockedProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('redirects to login when not authenticated', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderProtectedRoute();
    
    // Should not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders protected content when authenticated', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'authUser') return JSON.stringify({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        username: 'johndoe'
      });
      return null;
    });
    
    renderProtectedRoute();
    
    // Should render protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('shows loading state during authentication check', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderProtectedRoute();
    
    // Initially shows loading (before redirect)
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});