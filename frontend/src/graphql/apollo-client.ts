import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:5001/graphql',
});

// Auth link for adding authentication headers if needed
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Error link for global error handling
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // Handle specific network errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Handle unauthorized errors
      localStorage.removeItem('authToken');
      // Optionally redirect to login page
    }
  }
});

// Configure Apollo Cache with cache policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          // Cache policy for users query
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        products: {
          // Cache policy for products query
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    User: {
      fields: {
        orders: {
          // Merge policy for user orders
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Product: {
      fields: {
        reviews: {
          // Merge policy for product reviews
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
  // Enable Apollo DevTools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
});