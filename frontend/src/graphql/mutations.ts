import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      expiresAt
      user {
        id
        firstName
        lastName
        email
        username
        phoneNumber
        isActive
      }
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      message
      user {
        id
        firstName
        lastName
        email
        username
        isActive
        createdAt
      }
    }
  }
`;

// Mutation to update a user
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      success
      message
      user {
        id
        firstName
        lastName
        email
        username
        phoneNumber
        isActive
        updatedAt
      }
    }
  }
`;

// Mutation to create a new product
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
      product {
        id
        name
        description
        price
        stockQuantity
        isActive
        createdAt
      }
    }
  }
`;

// Mutation to update a product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      product {
        id
        name
        description
        price
        stockQuantity
        isActive
        updatedAt
      }
    }
  }
`;

// Mutation to create an order
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        id
        orderNumber
        status
        totalAmount
        currency
        createdAt
      }
    }
  }
`;