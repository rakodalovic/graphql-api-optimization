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
      nodes {
        id
        firstName
        lastName
        email
        username
        isActive
        createdAt
        updatedAt
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

// Query to get all products with filtering, sorting, and pagination
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
        sku
        price
        compareAtPrice
        stockQuantity
        isActive
        isFeatured
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
        variants {
          id
          name
          price
          stockQuantity
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

// Query to get featured products for home page
export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int = 8) {
    products(where: { isFeatured: { eq: true } }, first: $first) {
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

// Query to get a specific product by ID with full details
export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      sku
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
      createdAt
      updatedAt
      category {
        id
        name
        slug
        description
      }
      variants {
        id
        name
        sku
        price
        compareAtPrice
        stockQuantity
        weight
        isActive
        imageUrl
        sortOrder
        attributes {
          id
          name
          value
          sortOrder
        }
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
        }
      }
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
    ) {
      nodes {
        id
        name
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

// Query to get all categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(where: { isActive: { eq: true } }) {
      nodes {
        id
        name
        description
        slug
        imageUrl
        sortOrder
        parentCategoryId
        subCategories {
          id
          name
          slug
          sortOrder
        }
      }
    }
  }
`;

// Query to get reviews for a product with pagination
export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews(
    $productId: Int!
    $first: Int = 10
    $after: String
    $order: [ReviewSortInput!]
  ) {
    reviews(
      where: { 
        productId: { eq: $productId }
        isApproved: { eq: true }
      }
      first: $first
      after: $after
      order: $order
    ) {
      nodes {
        id
        rating
        title
        comment
        isVerifiedPurchase
        helpfulVotes
        unhelpfulVotes
        createdAt
        user {
          id
          firstName
          lastName
        }
        reviewImages {
          id
          imageUrl
          altText
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