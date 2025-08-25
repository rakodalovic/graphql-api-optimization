import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Test component that uses the cart context
const TestComponent: React.FC = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 29.99,
    images: [
      {
        id: 1,
        imageUrl: 'test-image.jpg',
        altText: 'Test Image',
        isPrimary: true,
      },
    ],
  };

  return (
    <div>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <button onClick={() => removeFromCart(1)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(1, 5)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
      
      {cartItems.map((item) => (
        <div key={item.id} data-testid={`cart-item-${item.id}`}>
          <span data-testid={`item-name-${item.id}`}>{item.name}</span>
          <span data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
          <span data-testid={`item-price-${item.id}`}>{item.price}</span>
        </div>
      ))}
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
  };

  test('should initialize with empty cart', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  test('should add item to cart', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('29.99');
    expect(screen.getByTestId('item-name-1')).toHaveTextContent('Test Product');
    expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('1');
  });

  test('should increase quantity when adding same item', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('59.98');
    expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('2');
  });

  test('should remove item from cart', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');

    act(() => {
      fireEvent.click(screen.getByText('Remove from Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  test('should update item quantity', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    act(() => {
      fireEvent.click(screen.getByText('Update Quantity'));
    });

    expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('5');
    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(screen.getByTestId('total-price')).toHaveTextContent('149.95');
  });

  test('should remove item when quantity is updated to 0', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');

    act(() => {
      fireEvent.click(screen.getByText('Update Quantity'));
    });

    // Simulate updating to 0 quantity by calling the component's handler
    const quantityInput = screen.getByDisplayValue('5');
    act(() => {
      fireEvent.change(quantityInput, { target: { value: '0' } });
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
  });

  test('should clear all items from cart', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');

    act(() => {
      fireEvent.click(screen.getByText('Clear Cart'));
    });

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  test('should save cart to localStorage', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByText('Add to Cart'));
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'shopping_cart',
      expect.stringContaining('Test Product')
    );
  });

  test('should load cart from localStorage on initialization', () => {
    const savedCart = JSON.stringify([
      {
        id: 1,
        name: 'Saved Product',
        price: 19.99,
        quantity: 2,
        image: 'saved-image.jpg',
      },
    ]);
    
    localStorageMock.getItem.mockReturnValue(savedCart);

    renderWithProvider();

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('39.98');
    expect(screen.getByTestId('item-name-1')).toHaveTextContent('Saved Product');
  });

  test('should handle localStorage parsing errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProvider();

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error parsing cart from localStorage:',
      expect.any(SyntaxError)
    );
    
    consoleSpy.mockRestore();
  });

  test('should throw error when useCart is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCart must be used within a CartProvider');
    
    consoleSpy.mockRestore();
  });
});