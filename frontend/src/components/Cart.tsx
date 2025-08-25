import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Add some products to get started</p>
              <Link to="/catalog" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-item-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <div className="cart-item-remove">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-content">
              <h2>Cart Summary</h2>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="summary-row total-price">
                <span>Total Price:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="cart-summary-actions">
                <Link to="/catalog" className="continue-shopping-link">
                  Continue Shopping
                </Link>
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;