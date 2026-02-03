# GraphMart - Full-Stack E-Commerce Platform with GraphQL, REST API, and Comparison Demo

A comprehensive full-stack e-commerce platform demonstrating modern web development practices with a React TypeScript frontend, .NET GraphQL backend, and REST API for performance comparison. This project showcases the advantages of GraphQL over traditional REST APIs through side-by-side comparisons.

## Project Architecture

```
├── backend/                 # .NET GraphQL API
│   ├── Models/             # Entity models (Users, Products, Orders, etc.)
│   ├── GraphQL/            # GraphQL schema, queries, mutations, subscriptions
│   │   ├── DataLoaders/    # DataLoader for N+1 query optimization
│   │   ├── Scalars/        # Custom scalar types
│   │   └── Types/          # GraphQL type definitions
│   ├── Data/               # Database context and configurations
│   │   └── Seed/           # Database seeding logic
│   ├── Migrations/         # Entity Framework migrations
│   ├── Tests/              # Unit and integration tests
│   ├── Program.cs          # Application entry point
│   ├── appsettings.json    # Application configuration
│   └── GraphQLApi.csproj   # Project file
├── backend-rest/           # REST API for comparison demo
│   └── RestApi/            # ASP.NET Core Web API
│       ├── Controllers/    # REST API controllers
│       ├── Program.cs      # Application entry point
│       └── README.md       # REST API documentation
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.tsx           # Authentication component
│   │   │   ├── Dashboard.tsx       # Protected dashboard
│   │   │   ├── ProductCatalog.tsx   # Product listing
│   │   │   ├── ProductDetail.tsx    # Product details
│   │   │   ├── Cart.tsx             # Shopping cart
│   │   │   ├── Profile.tsx          # User profile
│   │   │   └── ComparisonPage.tsx   # GraphQL vs REST comparison
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.tsx     # Authentication state
│   │   │   ├── AppContext.tsx      # Global app state
│   │   │   └── CartContext.tsx     # Shopping cart state
│   │   ├── graphql/        # Apollo Client configuration and operations
│   │   │   ├── apollo-client.ts    # Apollo setup
│   │   │   ├── queries.ts          # GraphQL queries
│   │   │   ├── mutations.ts        # GraphQL mutations
│   │   │   └── subscriptions.ts     # GraphQL subscriptions
│   │   ├── pages/          # Page components
│   │   │   └── Comparison/         # Comparison page
│   │   └── generated/      # TypeScript types from codegen
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── codegen.yml         # GraphQL codegen configuration
├── AUTHENTICATION_IMPLEMENTATION.md  # JWT authentication documentation
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## Technology Stack

### Backend (.NET GraphQL API)
- **.NET 8.0** with ASP.NET Core Web API
- **HotChocolate 13.9.0** - GraphQL server implementation
- **Entity Framework Core 8.0** - ORM and database access
- **SQLite** - Lightweight file-based database
- **Serilog** - Structured logging
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
- **BCrypt.Net-Next** - Password hashing
- **Microsoft.AspNetCore.SignalR** - WebSocket support for subscriptions

### Frontend (React + Apollo Client)
- **React 19.1** with TypeScript - UI framework
- **Apollo Client 3.13** - GraphQL client with intelligent caching
- **React Router 6.28** - Client-side routing
- **GraphQL Code Generator** - Automatic TypeScript type generation

### REST API (Comparison Demo)
- **ASP.NET Core 8.0 Web API** - REST API for comparison
- **Swagger/OpenAPI** - API documentation UI

## Features

### Backend Features

#### Core GraphQL Capabilities
- SQLite Database Configuration with file-based database for simplicity
- Entity Framework Core Integration with comprehensive migrations and DbContext setup
- Foreign Key Constraints properly configured and enabled for data integrity
- Comprehensive Seed Data with realistic test data and complex relationships
- GraphQL Server (HotChocolate) with filtering, sorting, and projections
- DataLoader implementation for N+1 query optimization
- Custom Scalar Types for domain-specific data handling
- Union Types for flexible query responses
- Health Checks for database and application health monitoring
- Structured Logging with Serilog (console and file sinks)
- CORS Configuration for frontend connections
- WebSocket Support for real-time subscriptions

#### Authentication & Authorization
- JWT Authentication with bearer token support
- BCrypt Password Hashing with salt for secure password storage
- Login Mutation with credential verification
- Protected GraphQL resolvers for authenticated operations
- Role-based claims in JWT tokens
- Configurable token expiration (default: 24 hours)

#### GraphQL Subscriptions
- Real-time order creation notifications
- Real-time notification delivery
- WebSocket-based pub/sub system
- In-memory topic management

#### REST API (Comparison Demo)
- RESTful endpoints for Products, Categories, Reviews, and Users
- Swagger UI for API exploration
- Intentional design to demonstrate over-fetching and under-fetching
- Shared database with GraphQL backend for fair comparison

### Frontend Features

#### Authentication
- Login Component with form validation and error handling
- Authentication Context for global state management
- Protected Routes with automatic redirects
- JWT Token storage in localStorage
- Automatic token validation on app load
- Logout functionality with token cleanup

#### User Interface
- Responsive Design with CSS Grid/Flexbox
- Component-based Architecture
- Global Loading States with spinners
- Global Error Handling with user-friendly messages
- Navigation Bar with route links
- Loading Spinners and Error Components

#### Product Features
- Product Catalog with grid layout
- Product Cards with images and prices
- Product Detail Pages with full information
- Product Reviews Display with ratings
- Filterable Product Lists
- Category-based Product Filtering

#### Shopping Experience
- Shopping Cart Management with Context API
- Add to Cart functionality
- Cart Item quantity management
- Cart persistence

#### GraphQL Integration
- Apollo Client Configuration with proper endpoint
- GraphQL Query Hooks with caching
- GraphQL Mutation Hooks with optimistic updates
- GraphQL Subscriptions with WebSocket support
- Apollo DevTools integration for development
- Cache Policies with merge strategies for lists
- GraphQL Code Integration with TypeScript types

#### Dashboard & Profile
- Protected Dashboard with user information
- User Profile Display
- GraphQL Test Component for API testing

#### GraphQL vs REST Comparison
- Interactive Comparison Page
- Side-by-side performance metrics
- Request count comparison
- Payload size visualization
- Response time comparison
- Scenario selection for different use cases
- Visual metrics display with charts

## Database Schema

The application includes the following entities with complex relationships:

### Core Entities
- **Users**: User accounts with profiles, preferences, and authentication
- **Products**: Product catalog with variants, images, and categories
- **Categories**: Hierarchical product categories with parent-child relationships
- **Orders**: Order management with items, shipping, and status history
- **Reviews**: Product reviews with ratings, votes, and comments
- **Carts**: Shopping cart functionality with items and totals
- **Payments**: Payment processing with methods and transaction history
- **Notifications**: User notification system with types and priorities
- **Tags**: Flexible tagging system for products, users, and orders
- **ProductVariants**: Product variants with different sizes, colors, and pricing
- **ProductImages**: Product image gallery with primary image marking
- **OrderItems**: Line items in orders with quantity and pricing
- **Addresses**: User addresses for shipping and billing

### Key Relationships
- Users -> Orders (One-to-Many)
- Products -> Categories (Many-to-One)
- Orders -> OrderItems -> Products (Many-to-Many through OrderItems)
- Users -> Reviews -> Products (Many-to-Many through Reviews)
- Products -> ProductVariants (One-to-Many)
- Products -> ProductImages (One-to-Many)
- Users -> Addresses (One-to-Many)
- Categories -> Products (One-to-Many)
- Categories -> Categories (Self-referencing for hierarchy)

## Getting Started

### Prerequisites
- **.NET 8.0 SDK** - Download from https://dotnet.microsoft.com/download
- **Node.js 18+** - Download from https://nodejs.org
- **Entity Framework Core Tools** - Install with `dotnet tool install --global dotnet-ef`

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

#### 2. Start the GraphQL Backend (.NET API)
```bash
cd backend
dotnet restore
dotnet ef database update  # Apply migrations
dotnet run
```

The GraphQL backend will be available at:
- **API Endpoint**: http://localhost:5001
- **GraphQL Playground**: http://localhost:5001/graphql
- **Health Checks**: http://localhost:5001/health

#### 3. Start the REST API (Optional, for comparison)
```bash
cd backend-rest/RestApi
dotnet restore
dotnet run
```

The REST API will be available at:
- **API Endpoint**: http://localhost:5002
- **Swagger UI**: http://localhost:5002/swagger

#### 4. Start the Frontend (React App)
```bash
cd frontend
npm install
npm start
```

The frontend will be available at:
- **React Application**: http://localhost:3000
- **Apollo DevTools**: Available in browser DevTools

#### 5. Test the Connection
```bash
cd frontend
node test-connection.js  # Verify Apollo Client can connect to GraphQL
```

## Authentication

The application implements JWT-based authentication with secure password hashing using BCrypt.

### Demo Credentials

The following test users are available for testing:

#### Customer User
- **Email**: john.doe@example.com
- **Password**: password123

#### Admin User
- **Email**: admin@example.com
- **Password**: admin123

#### Additional User
- **Email**: jane.smith@example.com
- **Password**: password123

### Authentication Flow

1. Visit http://localhost:3000
2. You will be automatically redirected to the login page
3. Enter demo credentials to authenticate
4. After successful login, you will be redirected to the dashboard
5. JWT token is automatically included in all GraphQL requests
6. Protected routes (Dashboard, Profile, Cart) require authentication

### Authentication Features

- BCrypt password hashing for secure storage
- JWT tokens with configurable expiration (24 hours)
- Protected routes with automatic redirects
- Token persistence in localStorage
- Automatic token validation on app load
- Clean logout with token cleanup

For detailed authentication implementation, see [AUTHENTICATION_IMPLEMENTATION.md](AUTHENTICATION_IMPLEMENTATION.md)

## GraphQL Queries and Mutations

### Sample Queries

#### Get All Users
```graphql
query GetUsers {
  users {
    id
    firstName
    lastName
    email
    username
    profile {
      bio
      country
      dob
    }
    preferences {
      theme
      language
      notifications
    }
  }
}
```

#### Get Products with Categories and Variants
```graphql
query GetProducts {
  products {
    nodes {
      id
      name
      description
      price
      stockQuantity
      category {
        id
        name
        slug
      }
      variants {
        id
        name
        price
        stockQuantity
        sku
      }
      images {
        imageUrl
        isPrimary
      }
    }
  }
}
```

#### Get Orders with Items and User
```graphql
query GetOrders {
  orders {
    nodes {
      id
      orderNumber
      status
      totalAmount
      createdAt
      user {
        firstName
        lastName
        email
      }
      orderItems {
        productName
        quantity
        unitPrice
        totalPrice
      }
    }
  }
}
```

### Sample Mutations

#### Create User
```graphql
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
    }
  }
}
```

#### Login
```graphql
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
    }
  }
}
```

## GraphQL Subscriptions

The application supports real-time updates through GraphQL subscriptions using WebSocket connections.

### Available Subscriptions

#### Order Created Subscription
```graphql
subscription OnOrderCreated {
  onOrderCreated {
    id
    orderNumber
    status
    totalAmount
    user {
      id
      username
      email
    }
    orderItems {
      id
      productName
      quantity
      unitPrice
    }
  }
}
```

#### Notification Received Subscription
```graphql
subscription OnNotificationReceived {
  onNotificationReceived {
    id
    title
    message
    type
    priority
    user {
      id
      username
    }
    createdAt
  }
}
```

### WebSocket Connection
- **WebSocket URL**: ws://localhost:5001/graphql
- **Protocol**: graphql-ws
- **Transport**: WebSocket with in-memory pub/sub

For detailed subscription usage and testing instructions, see [backend/SUBSCRIPTION_USAGE.md](backend/SUBSCRIPTION_USAGE.md)

## GraphQL vs REST Comparison

The project includes a REST API implementation to demonstrate the advantages of GraphQL over traditional REST APIs through side-by-side comparisons.

### Comparison Metrics
- **Request Count**: GraphQL requires fewer requests (1 vs 21+)
- **Payload Size**: GraphQL returns only requested fields (60-80% smaller)
- **Response Time**: GraphQL is faster due to fewer round trips (40-70% improvement)
- **Network Overhead**: Reduced latency with single request approach

### Comparison Scenarios

#### Scenario 1: Over-fetching
Display product cards with only name, price, and primary image
- **REST**: Returns all fields (~125 KB for 10 products)
- **GraphQL**: Returns only requested fields (~18 KB for 10 products)
- **Improvement**: 83% smaller payload

#### Scenario 2: Under-fetching (N+1 Problem)
Display 10 products with category names and review counts
- **REST**: 21 requests required (1 for products + 10 for categories + 10 for reviews)
- **GraphQL**: 1 request with DataLoader optimization
- **Improvement**: 95% fewer requests, 81% faster

#### Scenario 3: Complex Nested Query
Get product details with category, reviews with user info, and related products
- **REST**: 7+ requests depending on review count
- **GraphQL**: 1 request with nested fields
- **Improvement**: 86% fewer requests

To run the comparison:
1. Start both GraphQL and REST API backends
2. Navigate to the Comparison page in the frontend
3. Select different scenarios to see performance differences
4. View real-time metrics and visualizations

For detailed REST API documentation and comparison scenarios, see [backend-rest/PLAN.md](backend-rest/PLAN.md) and [backend-rest/RestApi/README.md](backend-rest/RestApi/README.md)

## Database Configuration

The application uses SQLite as the database, with comprehensive configuration for data integrity and performance.

### SQLite Connection Configuration

The database connection is configured in `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=graphql_api.db"
  }
}
```

### Foreign Key Constraints

Foreign key constraints are enabled in the Program.cs using the SQLite connection string builder:
```csharp
var connectionStringBuilder = new SqliteConnectionStringBuilder(connectionString)
{
    ForeignKeys = true
};
```

### Entity Framework Configuration

The `ApplicationDbContext` includes:
- SQLite-specific decimal column types
- SQLite-compatible default value SQL (datetime('now'))
- Automatic audit field updates (CreatedAt, UpdatedAt)
- Cascade delete configurations for related entities

### Database Migrations

Apply migrations after schema changes:
```bash
cd backend
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Seed Data

The application automatically seeds the database with comprehensive test data:

- **4 user roles**: Admin, Customer, Manager, Support
- **8 product categories**: Hierarchical structure with parent-child relationships
- **6 promotional tags**: Various promotional categories
- **3 users**: Complete profiles with preferences
- **3 products**: With variants, images, and full details
- **1 sample order**: With multiple items and status
- **1 product review**: With ratings and votes
- **2 user notifications**: Different types and priorities
- **Payment methods**: Various payment types
- **Addresses**: User shipping and billing addresses
- **Cart items**: Sample shopping cart data

The seed data includes properly hashed passwords using BCrypt for all test users.

## Testing

### Backend Tests

The backend includes comprehensive unit and integration tests:

```bash
cd backend/Tests
dotnet test
```

Test categories:
- **GraphQLIntegrationTests**: Full GraphQL query and mutation tests
- **QueryTests**: Specific query type tests
- **MutationTests**: Mutation operation tests
- **DataLoaderIntegrationTests**: DataLoader optimization tests
- **ScalarTypesTests**: Custom scalar type validation
- **DashboardStatsTests**: Dashboard statistics aggregation tests
- **AppStartupTests**: Application startup and configuration

### Frontend Tests

The frontend includes React component tests with Jest and React Testing Library:

```bash
cd frontend
npm test
```

Test categories:
- **Component Tests**: Component rendering and user interactions
- **GraphQL Tests**: Apollo Client queries and mutations
- **Context Tests**: State management contexts
- **Integration Tests**: Multi-component workflows

### Connection Test

Verify Apollo Client can connect to the GraphQL server:
```bash
cd frontend
node test-connection.js
```

## Development

### Backend Development

#### Running in Development Mode
```bash
cd backend
dotnet run
```

The GraphQL Playground is available at http://localhost:5001/graphql for interactive query testing.

#### Entity Framework Commands
```bash
# Add new migration
dotnet ef migrations add MigrationName

# Apply pending migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# List migrations
dotnet ef migrations list
```

#### Viewing Database

The SQLite database file (`backend/graphql_api.db`) can be viewed using:
- DB Browser for SQLite (https://sqlitebrowser.org)
- VS Code SQLite extension
- Command-line sqlite3 tool

#### Adding New GraphQL Types

1. Create model in `Models/` folder
2. Add to `ApplicationDbContext`
3. Create migration with `dotnet ef migrations add`
4. Create GraphQL type in `GraphQL/Types/`
5. Add fields to `Query.cs`, `Mutation.cs`, or `Subscription.cs`

### Frontend Development

#### Running Development Server
```bash
cd frontend
npm start
```

The application supports hot-reload for both frontend code and GraphQL queries.

#### GraphQL Code Generation

Generate TypeScript types from GraphQL schema:
```bash
cd frontend
npm run codegen
```

This updates the `src/generated/graphql.ts` file with up-to-date types.

#### Adding New Components

1. Create component file in `src/components/`
2. Add corresponding CSS file
3. Add component tests in `src/components/__tests__/`
4. Import and use in `App.tsx` or parent components

#### Adding GraphQL Operations

1. Define query/mutation in appropriate file:
   - `src/graphql/queries.ts` for queries
   - `src/graphql/mutations.ts` for mutations
   - `src/graphql/subscriptions.ts` for subscriptions
2. Run code generation: `npm run codegen`
3. Use generated hooks in components

### Environment Variables

Frontend environment variables (create `.env` file in frontend/):
```
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:5001/graphql
REACT_APP_REST_API_ENDPOINT=http://localhost:5002/api
```

## Troubleshooting

### Common Issues

#### Backend Issues

**Database Migration Errors**
- Problem: Migration fails to apply
- Solution: Delete `graphql_api.db` file and run `dotnet ef database update`

**Port Already in Use**
- Problem: Port 5001 is already in use
- Solution: Modify port in `backend/Properties/launchSettings.json` or stop the conflicting process

**Foreign Key Constraint Violations**
- Problem: Operations fail due to foreign key constraints
- Solution: Ensure related entities exist before creating dependent entities

**GraphQL Schema Errors**
- Problem: Schema fails to load mutations/queries
- Solution: Check that all GraphQL types are properly registered in `Program.cs` and models have correct relationships

#### Frontend Issues

**CORS Errors**
- Problem: Frontend cannot connect to backend
- Solution: Verify CORS configuration in `backend/Program.cs` includes frontend URL

**Apollo Client Connection Failures**
- Problem: GraphQL requests fail with network errors
- Solution: Check backend is running and GraphQL endpoint is correct

**Authentication Token Issues**
- Problem: Protected routes always redirect to login
- Solution: Check browser localStorage for JWT token and verify token is not expired

**Code Generation Errors**
- Problem: `npm run codegen` fails
- Solution: Ensure GraphQL server is running and `codegen.yml` configuration is correct

#### Development Issues

**Hot Reload Not Working**
- Problem: Changes not reflected immediately
- Solution: Restart development server after certain configuration changes

**Type Errors After Codegen**
- Problem: TypeScript errors after generating types
- Solution: Ensure GraphQL server schema is up-to-date and run codegen again

### Debugging Tips

#### Backend Debugging
1. Check logs in console output from `dotnet run`
2. Use SQLite browser to inspect database state
3. Use GraphQL Playground to test queries directly
4. Set breakpoints in Visual Studio or VS Code
5. Review Serilog logs in the `logs/` folder (if configured)

#### Frontend Debugging
1. Use browser DevTools for network inspection
2. Check Apollo DevTools for query/mutation details
3. Review browser console for errors
4. Use React DevTools for component state inspection
5. Monitor localStorage for JWT token and cart data
6. Check Network tab for GraphQL requests and responses

#### Performance Debugging
1. Use Apollo DevTools cache inspector to understand caching behavior
2. Monitor query timing in Network tab
3. Check DataLoader effectiveness through query execution time
4. Compare GraphQL vs REST timing using the Comparison page

## Architecture Decisions

### GraphQL over REST
This project demonstrates GraphQL advantages through:
- Reduced over-fetching: Clients request only needed fields
- Reduced under-fetching: Single request for related data
- Strong typing: Schema validation prevents runtime errors
- Self-documenting: Schema acts as API documentation
- Real-time capabilities: Built-in subscription support

### DataLoader Implementation
DataLoader is used to batch and cache database queries, solving the N+1 problem. When querying multiple products with their categories, DataLoader batches all category requests into a single database query.

### Authentication Strategy
JWT-based authentication provides stateless authentication suitable for distributed systems. Tokens include user claims and roles, enabling authorization decisions on the backend without session storage.

### Database Choice
SQLite was chosen for simplicity and portability:
- Zero configuration required
- File-based storage for easy backups
- Sufficient for development and demonstration
- Easy to share with team members

## Documentation

- **[AUTHENTICATION_IMPLEMENTATION.md](AUTHENTICATION_IMPLEMENTATION.md)**: Detailed JWT authentication implementation guide
- **[backend/SUBSCRIPTION_USAGE.md](backend/SUBSCRIPTION_USAGE.md)**: GraphQL subscriptions usage examples
- **[backend-rest/PLAN.md](backend-rest/PLAN.md)**: REST API comparison implementation plan
- **[backend-rest/RestApi/README.md](backend-rest/RestApi/README.md)**: REST API endpoint documentation

## License

This project is licensed under the MIT License.