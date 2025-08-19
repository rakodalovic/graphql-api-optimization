import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_VERSION, GET_USERS, GET_PRODUCTS } from '../graphql/queries';
import { CREATE_USER } from '../graphql/mutations';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './GraphQLTest.css';

const GraphQLTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'version' | 'users' | 'products' | 'createUser'>('version');
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: ''
  });

  // Query hooks
  const { 
    data: versionData, 
    loading: versionLoading, 
    error: versionError,
    refetch: refetchVersion 
  } = useQuery(GET_VERSION, {
    skip: activeTab !== 'version'
  });

  const { 
    data: usersData, 
    loading: usersLoading, 
    error: usersError,
    refetch: refetchUsers 
  } = useQuery(GET_USERS, {
    variables: { first: 10 },
    skip: activeTab !== 'users'
  });

  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useQuery(GET_PRODUCTS, {
    variables: { first: 10 },
    skip: activeTab !== 'products'
  });

  // Mutation hook
  const [createUser, { 
    loading: createUserLoading, 
    error: createUserError,
    data: createUserData 
  }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        phoneNumber: ''
      });
    }
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        variables: {
          input: newUser
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'version':
        if (versionLoading) return <LoadingSpinner message="Loading version info..." />;
        if (versionError) return (
          <ErrorMessage 
            message={versionError.message} 
            onRetry={() => refetchVersion()} 
          />
        );
        return (
          <div className="tab-content">
            <h3>API Version Information</h3>
            {versionData?.version && (
              <div className="version-info">
                <p><strong>Version:</strong> {versionData.version.version}</p>
                <p><strong>Environment:</strong> {versionData.version.environment}</p>
                <p><strong>Build Date:</strong> {new Date(versionData.version.buildDate).toLocaleString()}</p>
              </div>
            )}
          </div>
        );

      case 'users':
        if (usersLoading) return <LoadingSpinner message="Loading users..." />;
        if (usersError) return (
          <ErrorMessage 
            message={usersError.message} 
            onRetry={() => refetchUsers()} 
          />
        );
        return (
          <div className="tab-content">
            <h3>Users ({usersData?.users?.length || 0})</h3>
            <div className="data-list">
              {usersData?.users?.map((user: any) => (
                <div key={user.id} className="data-item">
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p>Email: {user.email}</p>
                  <p>Username: {user.username}</p>
                  <p>Active: {user.isActive ? 'Yes' : 'No'}</p>
                  <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'products':
        if (productsLoading) return <LoadingSpinner message="Loading products..." />;
        if (productsError) return (
          <ErrorMessage 
            message={productsError.message} 
            onRetry={() => refetchProducts()} 
          />
        );
        return (
          <div className="tab-content">
            <h3>Products ({productsData?.products?.length || 0})</h3>
            <div className="data-list">
              {productsData?.products?.map((product: any) => (
                <div key={product.id} className="data-item">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.stockQuantity}</p>
                  <p>Active: {product.isActive ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'createUser':
        return (
          <div className="tab-content">
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser} className="create-user-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" disabled={createUserLoading}>
                {createUserLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
            
            {createUserError && (
              <ErrorMessage message={createUserError.message} />
            )}
            
            {createUserData?.createUser && (
              <div className={`result ${createUserData.createUser.success ? 'success' : 'error'}`}>
                <p>{createUserData.createUser.message}</p>
                {createUserData.createUser.user && (
                  <div className="created-user">
                    <h4>Created User:</h4>
                    <p>ID: {createUserData.createUser.user.id}</p>
                    <p>Name: {createUserData.createUser.user.firstName} {createUserData.createUser.user.lastName}</p>
                    <p>Email: {createUserData.createUser.user.email}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="graphql-test">
      <h2>GraphQL Connection Test</h2>
      <div className="tabs">
        <button 
          className={activeTab === 'version' ? 'active' : ''} 
          onClick={() => setActiveTab('version')}
        >
          Version
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'createUser' ? 'active' : ''} 
          onClick={() => setActiveTab('createUser')}
        >
          Create User
        </button>
      </div>
      
      <div className="tab-content-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GraphQLTest;