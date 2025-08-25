import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/apollo-client';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="App">
                <Navigation />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<ProductCatalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
