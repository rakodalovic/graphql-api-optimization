import React from 'react';
import { useAuth } from '../context/AuthContext';
import GraphQLTest from './GraphQLTest';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName} {user?.lastName}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="user-details">
          <h2>User Information</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Full Name:</strong> {user?.firstName} {user?.lastName}</p>
        </div>

        <div className="graphql-section">
          <h2>GraphQL API Test</h2>
          <p>Now you can access protected GraphQL endpoints with your JWT token!</p>
          <GraphQLTest />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;