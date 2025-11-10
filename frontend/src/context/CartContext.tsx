import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      success
      message
    }
  }
`;

const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      success
      message
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      success
      message
    }
  }
`;

const CLEAR_CART_MUTATION = gql`
  mutation ClearCart($userId: Int!) {
    clearCart(userId: $userId) {
      success
      message
    }
  }
`;

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: Array<{
    id: number;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
  }>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = 'shopping_cart';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addToCartMutation] = useMutation(ADD_TO_CART_MUTATION);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM_MUTATION);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART_MUTATION);
  const [clearCartMutation] = useMutation(CLEAR_CART_MUTATION);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const getUserId = (): number | null => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return parseInt(user.id);
      } catch {
        return null;
      }
    }
    return null;
  };

  const addToCart = async (product: Product) => {
    const userId = getUserId();
    const existingItem = cartItems.find(item => item.id === product.id);
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    // Update local state
    if (existingItem) {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: primaryImage?.imageUrl
      };
      setCartItems(currentItems => [...currentItems, newItem]);
    }

    // Sync with backend if user is logged in
    if (userId) {
      try {
        await addToCartMutation({
          variables: {
            input: {
              userId,
              productId: product.id,
              quantity: 1
            }
          }
        });
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }
  };

  const removeFromCart = async (productId: number) => {
    const userId = getUserId();

    // Update local state
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );

    // Sync with backend if user is logged in
    if (userId) {
      try {
        await removeFromCartMutation({
          variables: {
            input: {
              userId,
              productId
            }
          }
        });
      } catch (error) {
        console.error('Error syncing cart removal with backend:', error);
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const userId = getUserId();

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update local state
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );

    // Sync with backend if user is logged in
    if (userId) {
      try {
        await updateCartItemMutation({
          variables: {
            input: {
              userId,
              productId,
              quantity
            }
          }
        });
      } catch (error) {
        console.error('Error syncing cart update with backend:', error);
      }
    }
  };

  const clearCart = async () => {
    const userId = getUserId();

    // Update local state
    setCartItems([]);

    // Sync with backend if user is logged in
    if (userId) {
      try {
        await clearCartMutation({
          variables: { userId }
        });
      } catch (error) {
        console.error('Error syncing cart clear with backend:', error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};