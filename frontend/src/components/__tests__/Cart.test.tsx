import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../Cart';
import { CartProvider } from '../../context/CartContext';

// Mock the useCart hook for controlled testing
const mockCartContext = {
  cartItems: [],
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  getTotalItems: jest.fn(() => 0),
  getTotalPrice: jest.fn(() => 0),
};

jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: () => mockCartContext,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display empty cart message when cart is empty', () => {
    mockCartContext.cartItems = [];
    mockCartContext.getTotalItems = jest.fn(() => 0);
    mockCartContext.getTotalPrice = jest.fn(() => 0);

    renderWithProviders(<Cart />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some products to get started')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  test('should display cart items when cart has items', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test-image-1.jpg',
      },
      {
        id: 2,
        name: 'Test Product 2',
        price: 19.99,
        quantity: 1,
        image: 'test-image-2.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 3);
    mockCartContext.getTotalPrice = jest.fn(() => 79.97);

    renderWithProviders(<Cart />);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total Items:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Total Price:')).toBeInTheDocument();
    expect(screen.getByText('$79.97')).toBeInTheDocument();
  });

  test('should call removeFromCart when remove button is clicked', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 1);
    mockCartContext.getTotalPrice = jest.fn(() => 29.99);

    renderWithProviders(<Cart />);

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1);
  });

  test('should call updateQuantity when quantity is changed', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 2);
    mockCartContext.getTotalPrice = jest.fn(() => 59.98);

    renderWithProviders(<Cart />);

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  test('should call updateQuantity with decreased value when minus button is clicked', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 2);
    mockCartContext.getTotalPrice = jest.fn(() => 59.98);

    renderWithProviders(<Cart />);

    const minusButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(minusButton);

    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 1);
  });

  test('should call updateQuantity with increased value when plus button is clicked', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 2);
    mockCartContext.getTotalPrice = jest.fn(() => 59.98);

    renderWithProviders(<Cart />);

    const plusButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(plusButton);

    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  test('should call removeFromCart when quantity is decreased to 0', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 1);
    mockCartContext.getTotalPrice = jest.fn(() => 29.99);

    renderWithProviders(<Cart />);

    const minusButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(minusButton);

    expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1);
  });

  test('should call clearCart when clear cart button is clicked', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 1);
    mockCartContext.getTotalPrice = jest.fn(() => 29.99);

    renderWithProviders(<Cart />);

    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);

    expect(mockCartContext.clearCart).toHaveBeenCalled();
  });

  test('should display placeholder when item has no image', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
        image: undefined,
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 1);
    mockCartContext.getTotalPrice = jest.fn(() => 29.99);

    renderWithProviders(<Cart />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  test('should format prices correctly', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 2);
    mockCartContext.getTotalPrice = jest.fn(() => 59.98);

    renderWithProviders(<Cart />);

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    // Check for the total price in the cart summary
    expect(screen.getByText(/\$59\.98/)).toBeInTheDocument();
  });

  test('should handle invalid quantity input gracefully', () => {
    const mockItems = [
      {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
        image: 'test-image.jpg',
      },
    ];

    mockCartContext.cartItems = mockItems;
    mockCartContext.getTotalItems = jest.fn(() => 2);
    mockCartContext.getTotalPrice = jest.fn(() => 59.98);

    renderWithProviders(<Cart />);

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: 'invalid' } });

    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 1);
  });
});