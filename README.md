# GraphQL API with SQLite Database

This project demonstrates a GraphQL API built with ASP.NET Core and Entity Framework Core, using SQLite as the database provider.

## Features

- ✅ **SQLite Database Configuration**: File-based SQLite database for simplicity
- ✅ **Entity Framework Core Integration**: Comprehensive migrations and DbContext setup
- ✅ **Foreign Key Constraints**: Properly configured and enabled for data integrity
- ✅ **Comprehensive Seed Data**: Realistic test data with complex relationships
- ✅ **GraphQL Integration**: HotChocolate GraphQL server with filtering, sorting, and projections
- ✅ **Health Checks**: Database and application health monitoring
- ✅ **Logging**: Structured logging with Serilog

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
- Entity Framework Core Tools

### Installation

1. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

2. **Apply database migrations** (automatically done on startup):
   ```bash
   dotnet ef database update
   ```

3. **Run the application**:
   ```bash
   dotnet run
   ```

The application will be available at:
- **API**: http://localhost:5000
- **GraphQL**: http://localhost:5000/graphql
- **GraphQL Playground**: http://localhost:5000/graphql (in development mode)
- **Health Checks**: http://localhost:5000/health

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

## Key Features Implemented

### ✅ Acceptance Criteria Met

1. **EF Core DbContext properly configured for SQLite** ✅
   - Connection string configured with foreign key support
   - SQLite-specific configurations applied

2. **Database migrations create all tables with relationships** ✅
   - Comprehensive initial migration created
   - All foreign key relationships properly defined

3. **Seed data populates all tables with realistic test data** ✅
   - Users, products, orders, reviews, and more
   - Complex relationships maintained

4. **Foreign key constraints enabled and working** ✅
   - Configured at connection level
   - Verified through application logs

5. **Database accessible from GraphQL resolvers** ✅
   - HotChocolate integration with EF Core
   - Filtering, sorting, and projections enabled

6. **SQLite database file included in .gitignore but seed data reproducible** ✅
   - Database files excluded from version control
   - Seed data automatically applied on startup

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Errors**: Ensure foreign key constraints are enabled in the connection string.

2. **Migration Issues**: If migrations fail, try removing the database file and running the application again.

3. **Port Conflicts**: If port 5000 is in use, the application will automatically select an available port.

## Contributing

1. Make your changes
2. Add appropriate tests
3. Update documentation
4. Submit a pull request

## License

This project is licensed under the MIT License.