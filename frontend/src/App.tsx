import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/apollo-client';
import { AppProvider } from './context/AppContext';
import GraphQLTest from './components/GraphQLTest';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AppProvider>
        <div className="App">
          <header className="App-header">
            <h1>React + Apollo Client + .NET GraphQL</h1>
            <p>Testing GraphQL connection to .NET backend</p>
          </header>
          <main>
            <GraphQLTest />
          </main>
        </div>
      </AppProvider>
    </ApolloProvider>
  );
}

export default App;
