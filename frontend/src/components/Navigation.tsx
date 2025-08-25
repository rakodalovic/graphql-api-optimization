import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const cartItemCount = getTotalItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>GraphQL Store</h2>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Catalog
          </Link>
          <Link 
            to="/cart" 
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          
          {user ? (
            <div className="nav-user-menu">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>

        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;