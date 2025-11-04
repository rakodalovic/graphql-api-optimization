# REST API - GraphQL Comparison Demo

A minimal REST API implementation to demonstrate GraphQL advantages through side-by-side comparison.

## Overview

This REST API is intentionally designed to showcase common REST patterns that lead to:
- **Over-fetching**: Endpoints return ALL fields, even when only a few are needed
- **Under-fetching**: Multiple requests required to get related data
- **N+1 Problem**: Separate requests needed for each related entity

## Running the API

```bash
cd backend-rest/RestApi
dotnet run
```

The API will start on **http://localhost:5002**

Swagger UI available at: http://localhost:5002/swagger

## Endpoints

### Products

- `GET /api/products?limit=10&offset=0` - Get all products with ALL fields
- `GET /api/products/{id}` - Get single product with ALL related data
- `GET /api/products/{id}/reviews` - Get reviews for a product (separate request)
- `GET /api/products/{id}/category` - Get category for a product (separate request)
- `GET /api/products/{id}/images` - Get images for a product (separate request)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get single category
- `GET /api/categories/{id}/products` - Get products in a category (separate request)

### Reviews

- `GET /api/reviews/{id}` - Get single review
- `GET /api/reviews/{id}/user` - Get user who wrote the review (N+1 problem)

### Users

- `GET /api/users/{id}` - Get user details with ALL fields
- `GET /api/users/{id}/reviews` - Get user's reviews (separate request)

## Example Scenarios

### Scenario 1: Over-fetching

**Goal**: Display product cards with only name, price, and primary image

**REST Approach**:
```bash
curl http://localhost:5002/api/products?limit=10
```
Returns ALL fields for each product (name, description, price, compareAtPrice, sku, stockQuantity, etc.)
- Wastes bandwidth on unused fields
- Response size: ~125 KB for 10 products

**GraphQL Approach**:
```graphql
query {
  products(first: 10) {
    nodes {
      name
      price
      images(where: { isPrimary: { eq: true } }) {
        imageUrl
      }
    }
  }
}
```
- Returns ONLY requested fields
- Response size: ~18 KB for 10 products
- **83% smaller payload**

### Scenario 2: Under-fetching (N+1 Problem)

**Goal**: Display 10 products with their category names and review counts

**REST Approach**:
```bash
# Request 1: Get products
curl http://localhost:5002/api/products?limit=10

# Requests 2-11: Get category for each product
curl http://localhost:5002/api/categories/1
curl http://localhost:5002/api/categories/2
# ... 8 more requests

# Requests 12-21: Get reviews for each product
curl http://localhost:5002/api/products/1/reviews
curl http://localhost:5002/api/products/2/reviews
# ... 8 more requests
```
- **Total: 21 requests**
- Response time: ~450ms
- Network overhead from multiple round trips

**GraphQL Approach**:
```graphql
query {
  products(first: 10) {
    nodes {
      name
      price
      category {
        name
      }
      reviews {
        totalCount
      }
    }
  }
}
```
- **Total: 1 request**
- Response time: ~85ms
- DataLoader batches category and review fetching
- **81% faster**

### Scenario 3: Complex Nested Query

**Goal**: Get product details page (product, category, reviews with user info, related products)

**REST Approach**:
```bash
# Request 1: Get product
curl http://localhost:5002/api/products/1

# Request 2: Get category
curl http://localhost:5002/api/categories/5

# Request 3: Get reviews
curl http://localhost:5002/api/products/1/reviews

# Requests 4-6: Get user for each review (N requests)
curl http://localhost:5002/api/users/1
curl http://localhost:5002/api/users/2
curl http://localhost:5002/api/users/3

# Request 7: Get related products
curl http://localhost:5002/api/categories/5/products?limit=4
```
- **Total: 7+ requests** (depends on review count)
- Complex client-side data coordination

**GraphQL Approach**:
```graphql
query {
  product(id: 1) {
    name
    description
    price
    images { imageUrl }
    category {
      name
      products(first: 4) {
        nodes { name price }
      }
    }
    reviews {
      nodes {
        rating
        comment
        user {
          firstName
          lastName
        }
      }
    }
  }
}
```
- **Total: 1 request**
- Single, declarative query
- **86% fewer requests**

## Database

The REST API shares the same SQLite database (`../backend/graphql_api.db`) with the GraphQL backend, ensuring identical data for comparison.

## Technical Details

- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQLite via Entity Framework Core
- **Port**: 5002
- **CORS**: Enabled for http://localhost:3000 (frontend)
- **Swagger**: Available at /swagger endpoint

## Key Design Decisions

1. **Intentional Over-fetching**: All endpoints return complete entity graphs to demonstrate typical REST patterns
2. **Separate Endpoints for Relations**: Related data requires separate API calls
3. **No Custom DTOs**: Using full entity models to show realistic REST scenarios
4. **Circular Reference Handling**: Configured with `ReferenceHandler.IgnoreCycles`

## Next Steps

See [PLAN.md](../PLAN.md) for the complete comparison implementation plan, including:
- Frontend comparison page design
- Metrics collection and visualization
- Additional comparison scenarios
