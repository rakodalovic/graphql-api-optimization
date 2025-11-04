# REST API Implementation Plan

## Overview
A minimal REST API to demonstrate GraphQL advantages through side-by-side comparison with traditional REST architecture.

## Goals
- Demonstrate over-fetching (REST returns all fields, GraphQL only requested fields)
- Demonstrate under-fetching (REST requires multiple requests, GraphQL can get nested data in one)
- Show N+1 problem and how GraphQL DataLoader solves it
- Compare payload sizes and request counts
- Measure and visualize performance differences

## Technology Stack
- **Framework**: ASP.NET Core Web API
- **Database**: Shared SQLite database with GraphQL backend
- **ORM**: Entity Framework Core (same models as GraphQL backend)

## REST Endpoints to Implement

### Products
```
GET /api/products
  - Returns list of products (all fields, over-fetching)
  - Query params: ?limit=10&offset=0

GET /api/products/{id}
  - Returns single product with ALL fields (over-fetching)

GET /api/products/{id}/reviews
  - Get reviews for a specific product (separate request, under-fetching)

GET /api/products/{id}/category
  - Get category for a product (separate request)

GET /api/products/{id}/images
  - Get images for a product (separate request)
```

### Categories
```
GET /api/categories
  - Returns all categories

GET /api/categories/{id}
  - Returns single category

GET /api/categories/{id}/products
  - Get products in a category (separate request)
```

### Reviews
```
GET /api/reviews/{id}
  - Get single review

GET /api/reviews/{id}/user
  - Get user who wrote the review (N+1 problem)
```

### Users
```
GET /api/users/{id}
  - Get user details

GET /api/users/{id}/reviews
  - Get user's reviews
```

## Comparison Scenarios

### Scenario 1: Over-fetching
**Task**: Display product cards with only name, price, and primary image

**REST Approach**:
- `GET /api/products?limit=10`
- Returns ALL fields for each product (id, name, description, price, compareAtPrice, sku, stockQuantity, etc.)
- Wastes bandwidth on unused fields

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

**Metrics**:
- Payload size difference (REST will be 3-5x larger)
- Response time

### Scenario 2: Under-fetching (N+1 Problem)
**Task**: Display 10 products with their category names and review counts

**REST Approach**:
1. `GET /api/products?limit=10` - Get products
2. `GET /api/categories/{id}` - Get category for each product (10 requests)
3. `GET /api/products/{id}/reviews` - Get reviews for each product (10 requests)
- **Total: 21 requests**

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
- DataLoader batches category and review fetching

**Metrics**:
- Request count: 21 vs 1
- Total response time
- Network overhead

### Scenario 3: Complex Nested Query
**Task**: Get product details page (product, category, reviews with user info, related products)

**REST Approach**:
1. `GET /api/products/{id}` - Get product
2. `GET /api/categories/{id}` - Get category
3. `GET /api/products/{id}/reviews` - Get reviews
4. `GET /api/users/{id}` - Get user for each review (N requests)
5. `GET /api/categories/{id}/products?limit=4` - Get related products
- **Total: 5+ requests (depends on review count)**

**GraphQL Approach**:
```graphql
query {
  product(id: $id) {
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

**Metrics**:
- Request count
- Total time to load page
- Payload size
- Code complexity

### Scenario 4: Flexible Field Selection
**Task**: Mobile app needs minimal data, desktop needs full data

**REST Approach**:
- Same endpoint returns same data for both
- Mobile wastes bandwidth
- OR need separate endpoints (/api/products/mobile, /api/products/full)

**GraphQL Approach**:
- Same endpoint, different queries
- Mobile requests fewer fields
- Desktop requests more fields

## Comparison Page Features

### Layout
```
┌─────────────────────────────────────────────────┐
│  GraphQL vs REST Comparison                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Select Scenario: [Dropdown]                    │
│  [ ] Show Request/Response Details              │
│                                                 │
│  ┌──────────────────┬──────────────────┐       │
│  │   REST API       │   GraphQL API    │       │
│  ├──────────────────┼──────────────────┤       │
│  │ Requests: 21     │ Requests: 1      │       │
│  │ Time: 450ms      │ Time: 85ms       │       │
│  │ Payload: 125 KB  │ Payload: 18 KB   │       │
│  │                  │                  │       │
│  │ [Code View]      │ [Code View]      │       │
│  └──────────────────┴──────────────────┘       │
│                                                 │
│  📊 Visual Comparison                           │
│  [Bar Chart showing metrics]                    │
│                                                 │
│  [Run Test] [Reset]                             │
└─────────────────────────────────────────────────┘
```

### Metrics Display
- ⏱️ Response Time (ms)
- 📦 Payload Size (bytes/KB)
- 🔢 Request Count
- 📊 Efficiency Score (% improvement)
- 🌐 Network Waterfall (visual timeline)

### Code Display
- Show actual HTTP requests for REST
- Show GraphQL query
- Syntax highlighting
- Copy button

## Implementation Steps

### Phase 1: Backend Setup
1. Create new ASP.NET Core Web API project in `backend-rest/`
2. Reference shared models from main backend
3. Share database connection with GraphQL backend
4. Implement REST controllers
5. Add CORS for frontend access

### Phase 2: REST Endpoints
1. Implement ProductsController
2. Implement CategoriesController
3. Implement ReviewsController
4. Implement UsersController
5. Add query parameters for filtering/pagination

### Phase 3: Frontend Comparison Page
1. Create `/comparison` route
2. Build comparison UI component
3. Implement scenario selection
4. Add request execution logic
5. Implement metrics collection
6. Create visualization components (charts, bars)
7. Add code display with syntax highlighting

### Phase 4: Testing & Polish
1. Test all scenarios
2. Add loading states
3. Add error handling
4. Optimize styling
5. Add explanatory text/tooltips
6. Create demo mode with pre-recorded results

## File Structure
```
backend-rest/
├── PLAN.md (this file)
├── RestApi.csproj
├── Program.cs
├── appsettings.json
├── Controllers/
│   ├── ProductsController.cs
│   ├── CategoriesController.cs
│   ├── ReviewsController.cs
│   └── UsersController.cs
└── README.md

frontend/
└── src/
    └── pages/
        └── Comparison/
            ├── ComparisonPage.tsx
            ├── ComparisonPage.css
            ├── ScenarioSelector.tsx
            ├── MetricsDisplay.tsx
            ├── CodeDisplay.tsx
            └── VisualizationChart.tsx
```

## Expected Results

### Typical Improvements with GraphQL:
- **Payload Size**: 60-80% smaller
- **Request Count**: 90-95% fewer requests
- **Response Time**: 40-70% faster (due to fewer round trips)
- **Developer Experience**: Single query vs multiple endpoints
- **Type Safety**: Schema validation vs runtime errors

## Notes
- REST API should intentionally demonstrate common REST pitfalls
- Don't artificially slow down REST - show realistic patterns
- GraphQL should use DataLoader to show proper optimization
- Add clear explanations for non-technical users
- Make it visually compelling with charts and metrics
