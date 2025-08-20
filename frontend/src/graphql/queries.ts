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

// Query to get all products with filtering and sorting
export const GET_PRODUCTS = gql`
  query GetProducts(
    $where: ProductFilterInput
    $order: [ProductSortInput!]
    $first: Int
    $after: String
  ) {
    products(where: $where, order: $order, first: $first, after: $after) {
      nodes {
        id
        name
        description
        price
        compareAtPrice
        stockQuantity
        isActive
        isFeatured
        sku
        createdAt
        updatedAt
        category {
          id
          name
          slug
        }
        images {
          id
          imageUrl
          altText
          isPrimary
          sortOrder
        }
        reviews {
          id
          rating
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Query to get a specific product by ID with full details
export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      price
      compareAtPrice
      costPrice
      stockQuantity
      isActive
      isFeatured
      isDigital
      weight
      weightUnit
      metaTitle
      metaDescription
      sku
      createdAt
      updatedAt
      category {
        id
        name
        slug
        description
        imageUrl
      }
      images {
        id
        imageUrl
        altText
        isPrimary
        sortOrder
      }
      variants {
        id
        name
        price
        compareAtPrice
        stockQuantity
        isActive
        imageUrl
        sku
        attributes {
          id
          name
          value
          sortOrder
        }
      }
      reviews {
        id
        rating
        title
        comment
        isVerifiedPurchase
        isApproved
        helpfulVotes
        unhelpfulVotes
        createdAt
        user {
          id
          firstName
          lastName
          username
        }
        reviewImages {
          id
          imageUrl
          altText
        }
      }
    }
  }
`;

// Query to get categories
export const GET_CATEGORIES = gql`
  query GetCategories($where: CategoryFilterInput) {
    categories(where: $where) {
      id
      name
      description
      slug
      imageUrl
      isActive
      sortOrder
      parentCategoryId
      parentCategory {
        id
        name
        slug
      }
      subCategories {
        id
        name
        slug
        isActive
      }
    }
  }
`;

// Query to get reviews with pagination
export const GET_REVIEWS = gql`
  query GetReviews(
    $where: ReviewFilterInput
    $order: [ReviewSortInput!]
    $first: Int
    $after: String
  ) {
    reviews(where: $where, order: $order, first: $first, after: $after) {
      nodes {
        id
        rating
        title
        comment
        isVerifiedPurchase
        isApproved
        helpfulVotes
        unhelpfulVotes
        createdAt
        user {
          id
          firstName
          lastName
          username
        }
        reviewImages {
          id
          imageUrl
          altText
        }
        product {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Query to get related products
export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($categoryId: Int!, $excludeProductId: Int!, $first: Int = 4) {
    products(
      where: { 
        categoryId: { eq: $categoryId }
        id: { neq: $excludeProductId }
        isActive: { eq: true }
      }
      first: $first
      order: { isFeatured: DESC }
    ) {
      nodes {
        id
        name
        description
        price
        compareAtPrice
        category {
          id
          name
        }
        images {
          id
          imageUrl
          altText
          isPrimary
        }
      }
    }
  }
`;