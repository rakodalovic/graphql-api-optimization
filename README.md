# React Frontend with Apollo Client + .NET GraphQL Backend

This project demonstrates a full-stack application with a React TypeScript frontend using Apollo Client connected to a .NET GraphQL backend built with ASP.NET Core and Entity Framework Core.

## Project Structure

```
├── backend/                 # .NET GraphQL API
│   ├── Models/             # Entity models
│   ├── GraphQL/            # GraphQL schema, queries, mutations
│   ├── Data/               # Database context and configurations
│   ├── Tests/              # Unit and integration tests
│   └── Program.cs          # Application entry point
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── graphql/        # Apollo Client configuration and queries
│   │   └── generated/      # Generated TypeScript types (optional)
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Features

### Backend (.NET GraphQL API)
- ✅ **SQLite Database Configuration**: File-based SQLite database for simplicity
- ✅ **Entity Framework Core Integration**: Comprehensive migrations and DbContext setup
- ✅ **Foreign Key Constraints**: Properly configured and enabled for data integrity
- ✅ **Comprehensive Seed Data**: Realistic test data with complex relationships
- ✅ **GraphQL Integration**: HotChocolate GraphQL server with filtering, sorting, and projections
- ✅ **Health Checks**: Database and application health monitoring
- ✅ **Logging**: Structured logging with Serilog
- ✅ **CORS Configuration**: Configured to allow frontend connections
- ✅ **WebSocket Support**: Real-time subscriptions enabled

### Frontend (React + Apollo Client)
- ✅ **React 18+ with TypeScript**: Latest React with full TypeScript support
- ✅ **Apollo Client Integration**: GraphQL client with intelligent caching
- ✅ **Global State Management**: Context API for loading/error states
- ✅ **Error Handling**: Global error handling with user-friendly messages
- ✅ **Loading States**: Global loading state management
- ✅ **GraphQL Code Generation**: Automatic TypeScript type generation
- ✅ **Apollo DevTools Support**: Development tools integration

## Database Schema

The application includes the following entities with complex relationships:

### Core Entities
- **Users**: User accounts with profiles and preferences
- **Products**: Product catalog with variants and images
- **Categories**: Hierarchical product categories
- **Orders**: Order management with items and status history
- **Reviews**: Product reviews with ratings and votes
- **Carts**: Shopping cart functionality
- **Payments**: Payment processing and history
- **Notifications**: User notification system
- **Tags**: Flexible tagging system for products, users, and orders

### Key Relationships
- Users → Orders (One-to-Many)
- Products → Categories (Many-to-One)
- Orders → OrderItems → Products (Many-to-Many through OrderItems)
- Users → Reviews → Products (Many-to-Many through Reviews)
- Products → ProductVariants (One-to-Many)

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- Entity Framework Core Tools

### Installation & Running

#### 1. Start the Backend (.NET GraphQL API)
```bash
cd backend
dotnet restore
dotnet run
```

The backend will be available at:
- **API**: http://localhost:5001
- **GraphQL**: http://localhost:5001/graphql
- **GraphQL Playground**: http://localhost:5001/graphql (in development mode)
- **Health Checks**: http://localhost:5001/health

#### 2. Start the Frontend (React App)
```bash
cd frontend
npm install
npm start
```

The frontend will be available at:
- **React App**: http://localhost:3000

#### 3. Test the Connection
```bash
cd frontend
node test-connection.js
```

This will verify that Apollo Client can successfully connect to the GraphQL server.

### Quick Test
1. Open http://localhost:3000 in your browser
2. Use the GraphQL Test component to test:
   - Version query
   - Users query  
   - Products query
   - Create user mutation

## Database Configuration

### SQLite Connection String
The SQLite database is configured in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=graphql_api.db"
  }
}
```

### Foreign Key Constraints
Foreign key constraints are enabled using the SQLite connection string builder:
```csharp
var connectionStringBuilder = new SqliteConnectionStringBuilder(connectionString)
{
    ForeignKeys = true
};
```

### Entity Framework Configuration
The `ApplicationDbContext` is configured with:
- SQLite-specific decimal column types
- SQLite-compatible default value SQL (`datetime('now')`)
- Automatic audit field updates (CreatedAt, UpdatedAt)

## Seed Data

The application automatically seeds the database with realistic test data including:
- 4 user roles (Admin, Customer, Manager, Support)
- 8 product categories (hierarchical structure)
- 6 promotional tags
- 3 users with profiles and preferences
- 3 products with variants
- 1 sample order with items
- 1 product review
- 2 user notifications

## GraphQL Queries

### Sample Queries

**Get all users:**
```graphql
query {
  users {
    id
    firstName
    lastName
    email
    profile {
      bio
      country
    }
    preferences {
      theme
      language
    }
  }
}
```

**Get products with categories:**
```graphql
query {
  products {
    id
    name
    price
    category {
      name
      slug
    }
    variants {
      name
      price
      stockQuantity
    }
  }
}
```

**Get orders with items:**
```graphql
query {
  orders {
    id
    orderNumber
    status
    totalAmount
    user {
      firstName
      lastName
    }
    orderItems {
      productName
      quantity
      unitPrice
    }
  }
}
```

## Development

### Adding New Migrations
```bash
dotnet ef migrations add MigrationName
```

### Updating Database
```bash
dotnet ef database update
```

### Viewing Database
The SQLite database file (`graphql_api.db`) can be viewed using any SQLite browser or command-line tools.

## Project Structure

```
├── Data/
│   ├── ApplicationDbContext.cs          # EF Core DbContext
│   ├── Configurations/                  # Entity configurations
│   └── Seed/
│       └── SeedData.cs                  # Database seeding logic
├── Models/                              # Entity models
├── GraphQL/                             # GraphQL queries and mutations
├── Migrations/                          # EF Core migrations
├── Program.cs                           # Application startup
├── appsettings.json                     # Configuration
└── GraphQLApi.csproj                    # Project file
```

## Acceptance Criteria Met ✅

### React Frontend Setup
- [x] **React app connects successfully to .NET GraphQL server**
  - Apollo Client configured with proper endpoint
  - CORS enabled on backend for cross-origin requests
  - Connection verified through automated tests

- [x] **Apollo DevTools shows queries and responses**
  - Apollo Client configured with `connectToDevTools: true` in development
  - GraphQL operations visible in browser DevTools
  - Cache inspection and query monitoring available

- [x] **Loading and error states handled globally**
  - Global AppContext for managing loading states
  - Error boundary implementation with user-friendly messages
  - Apollo Client error link for centralized error handling
  - Loading spinners and error components created

### Additional Features Implemented

#### Apollo Client Configuration
- ✅ **Cache Policies**: Intelligent caching with merge strategies for lists
- ✅ **Authentication Ready**: Bearer token support built-in
- ✅ **Error Handling**: Global error link with network error handling
- ✅ **TypeScript Support**: Full type safety throughout the application

#### Repository Organization
- ✅ **Backend Folder**: All .NET components organized in `/backend`
- ✅ **Frontend Folder**: React application in `/frontend`
- ✅ **Clear Structure**: Logical separation of concerns

#### GraphQL Operations Tested
- ✅ **Queries**: Version info, users list, products list
- ✅ **Mutations**: Create user with validation
- ✅ **Error Scenarios**: Network errors, GraphQL errors
- ✅ **Loading States**: All operations show loading indicators

#### Development Experience
- ✅ **Hot Reload**: Both backend and frontend support hot reload
- ✅ **TypeScript**: Full TypeScript support with strict typing
- ✅ **Code Generation**: GraphQL CodeGen setup for type generation
- ✅ **Testing**: Connection test script for verification

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**: Ensure foreign key constraints are enabled in the connection string.

2. **Migration Issues**: If migrations fail, try removing the database file and running the application again.

3. **Port Conflicts**: If port 5001 is in use, the application will automatically select an available port.

## Contributing

1. Make your changes
2. Add appropriate tests
3. Update documentation
4. Submit a pull request

## License

This project is licensed under the MIT License.