import { gql } from '@apollo/client';
import { 
  GET_PRODUCTS, 
  GET_FEATURED_PRODUCTS, 
  GET_CATEGORIES,
  GET_PRODUCT_REVIEWS
} from '../queries';

describe('GraphQL Queries', () => {
  test('GET_PRODUCTS query has correct pagination structure', () => {
    const queryString = GET_PRODUCTS.loc?.source.body;
    
    // Check that query expects pagination arguments
    expect(queryString).toContain('$first: Int');
    expect(queryString).toContain('$after: String');
    
    // Check that query uses pagination arguments
    expect(queryString).toContain('first: $first');
    expect(queryString).toContain('after: $after');
    
    // Check that query expects pagination fields
    expect(queryString).toContain('nodes {');
    expect(queryString).toContain('pageInfo {');
    expect(queryString).toContain('totalCount');
    
    // Check pageInfo subfields
    expect(queryString).toContain('hasNextPage');
    expect(queryString).toContain('hasPreviousPage');
    expect(queryString).toContain('startCursor');
    expect(queryString).toContain('endCursor');
  });

  test('GET_FEATURED_PRODUCTS query has correct pagination structure', () => {
    const queryString = GET_FEATURED_PRODUCTS.loc?.source.body;
    
    // Check that query expects first argument with default
    expect(queryString).toContain('$first: Int = 8');
    
    // Check that query uses first argument
    expect(queryString).toContain('first: $first');
    
    // Check that query expects nodes field
    expect(queryString).toContain('nodes {');
  });

  test('GET_CATEGORIES query has correct pagination structure', () => {
    const queryString = GET_CATEGORIES.loc?.source.body;
    
    // Check that query expects nodes field for categories
    expect(queryString).toContain('categories(');
    expect(queryString).toContain('nodes {');
  });

  test('GET_PRODUCT_REVIEWS query has correct pagination structure', () => {
    const queryString = GET_PRODUCT_REVIEWS.loc?.source.body;
    
    // Check pagination arguments
    expect(queryString).toContain('$first: Int = 10');
    expect(queryString).toContain('$after: String');
    
    // Check pagination usage
    expect(queryString).toContain('first: $first');
    expect(queryString).toContain('after: $after');
    
    // Check pagination fields
    expect(queryString).toContain('nodes {');
    expect(queryString).toContain('pageInfo {');
    expect(queryString).toContain('totalCount');
  });

  test('All pagination queries have consistent structure', () => {
    const paginatedQueries = [
      { name: 'GET_PRODUCTS', query: GET_PRODUCTS },
      { name: 'GET_PRODUCT_REVIEWS', query: GET_PRODUCT_REVIEWS }
    ];

    paginatedQueries.forEach(({ name, query }) => {
      const queryString = query.loc?.source.body;
      
      // Each paginated query should have these fields
      expect(queryString).toContain('nodes {');
      expect(queryString).toContain('pageInfo {');
      expect(queryString).toContain('totalCount');
      
      // PageInfo should have all required fields
      expect(queryString).toContain('hasNextPage');
      expect(queryString).toContain('hasPreviousPage');
      expect(queryString).toContain('startCursor');
      expect(queryString).toContain('endCursor');
    });
  });

  test('Queries are valid GraphQL syntax', () => {
    const queries = [
      GET_PRODUCTS,
      GET_FEATURED_PRODUCTS,
      GET_CATEGORIES,
      GET_PRODUCT_REVIEWS
    ];

    queries.forEach(query => {
      // If the query was parsed successfully by gql, it's valid
      expect(query.kind).toBe('Document');
      expect(query.definitions).toBeDefined();
      expect(query.definitions.length).toBeGreaterThan(0);
    });
  });
});