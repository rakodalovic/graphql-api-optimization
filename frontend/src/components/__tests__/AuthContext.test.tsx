import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { LOGIN_MUTATION } from '../../graphql/mutations';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.firstName} {user.lastName}
        </div>
      )}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        input: { email: 'test@example.com', password: 'password' }
      },
    },
    result: {
      data: {
        login: {
          success: true,
          message: 'Login successful',
          token: 'mock-jwt-token',
          user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            username: 'johndoe',
            isActive: true
          }
        }
      }
    }
  }
];

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('renders authentication context correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MockedProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  test('handles login correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MockedProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
    });
  });

  test('handles logout correctly', () => {
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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MockedProvider>
    );

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authUser');
  });
});