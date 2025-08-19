import { gql } from '@apollo/client';

// Query to get API version information
export const GET_VERSION = gql`
  query GetVersion {
    version {
      version
      environment
      buildDate
    }
  }
`;

// Query to get all users
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      username
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Query to get a specific user by ID
export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      username
      phoneNumber
      isActive
      emailConfirmed
      createdAt
      updatedAt
      profile {
        id
        bio
        avatarUrl
        dateOfBirth
      }
    }
  }
`;

// Query to get all products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      stockQuantity
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Query to get a specific product by ID
export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      price
      stockQuantity
      isActive
      createdAt
      updatedAt
      category {
        id
        name
      }
      images {
        id
        url
        altText
        isPrimary
      }
    }
  }
`;