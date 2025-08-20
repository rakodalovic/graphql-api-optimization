import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

test('renders authentication app', () => {
  localStorageMock.getItem.mockReturnValue(null);
  
  render(
    <MockedProvider addTypename={false}>
      <App />
    </MockedProvider>
  );
  
  // Should render login form when not authenticated
  expect(screen.getByText('Login')).toBeInTheDocument();
});
