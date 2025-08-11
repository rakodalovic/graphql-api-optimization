# GraphQL API with .NET 8 and HotChocolate

A comprehensive .NET 8 Web API implementation with HotChocolate GraphQL Framework, featuring structured logging, health checks, and development-ready configuration.

## 🚀 Features

- ✅ .NET 8 Web API with HotChocolate GraphQL
- ✅ Comprehensive GraphQL schema with Query and Mutation types
- ✅ Structured logging with Serilog
- ✅ Health check endpoints with detailed reporting
- ✅ CORS configuration for frontend integration
- ✅ Development environment with hot reload support
- ✅ GraphQL IDE (Banana Cake Pop) integration
- ✅ Environment-based configuration

## 📦 NuGet Packages

- **HotChocolate.AspNetCore** (13.9.0) - GraphQL server implementation
- **HotChocolate.Data.EntityFramework** (13.9.0) - Entity Framework integration
- **Serilog.AspNetCore** (8.0.0) - Structured logging
- **Microsoft.AspNetCore.Diagnostics.HealthChecks** (2.2.0) - Health monitoring
- **Serilog.Sinks.Console** (5.0.1) - Console logging output
- **Serilog.Sinks.File** (5.0.0) - File logging output

## 🏗️ Project Structure

```
GraphQLApi/
├── GraphQL/
│   ├── Query.cs           # GraphQL query definitions
│   └── Mutation.cs        # GraphQL mutation definitions
├── Properties/
│   └── launchSettings.json # Development launch configuration
├── logs/                  # Serilog output directory
├── Program.cs             # Application entry point and configuration
├── appsettings.json       # Production configuration
├── appsettings.Development.json # Development configuration
├── GraphQLApi.csproj      # Project file
├── global.json            # .NET SDK version specification
├── test-api.sh           # API testing script
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- (Optional) jq for JSON formatting in test script

### Running the Application

1. **Clone and navigate to the project directory**
   ```bash
   cd GraphQLApi
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Build the project**
   ```bash
   dotnet build
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

   Or for development with specific URLs:
   ```bash
   dotnet run --urls "https://localhost:7000;http://localhost:5000"
   ```

5. **Access the GraphQL IDE**
   Open your browser and navigate to: `http://localhost:5000/graphql/`

## 🌐 Available Endpoints

| Endpoint | Description | Method |
|----------|-------------|---------|
| `/` | API information and status | GET |
| `/graphql` | GraphQL API endpoint | POST |
| `/graphql/` | GraphQL IDE (Banana Cake Pop) | GET |
| `/health` | Detailed health check with JSON response | GET |
| `/health/ready` | Readiness health check | GET |
| `/health/live` | Liveness health check | GET |

## 📊 GraphQL Schema

### Queries

- **`hello`**: Returns "Hello World"
- **`greeting(name: String)`**: Returns personalized greeting
- **`serverTime`**: Returns current server UTC time
- **`version`**: Returns API version information

### Mutations

- **`echo(message: String!)`**: Echo mutation that returns the input message
- **`calculate(a: Float!, b: Float!, operation: CalculationOperation!)`**: Performs basic calculations

### Example Queries

**Hello World Query:**
```graphql
{
  hello
}
```

**Personalized Greeting:**
```graphql
{
  greeting(name: "Developer")
}
```

**Version Information:**
```graphql
{
  version {
    version
    environment
    buildDate
  }
}
```

**Echo Mutation:**
```graphql
mutation {
  echo(message: "Hello GraphQL!") {
    message
    timestamp
    success
  }
}
```

**Calculation Mutation:**
```graphql
mutation {
  calculate(a: 10, b: 5, operation: ADD) {
    result
    operation
    inputA
    inputB
    success
  }
}
```

## 🧪 Testing

Run the comprehensive test script:

```bash
./test-api.sh
```

This script will:
- Start the API server
- Test all endpoints
- Verify GraphQL queries and mutations
- Check health endpoints
- Validate GraphQL IDE accessibility
- Clean up resources

## ⚙️ Configuration

### Environment Variables

- `ASPNETCORE_ENVIRONMENT`: Set to `Development` for development features

### appsettings.json

The application uses hierarchical configuration:
- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development overrides

Key configuration sections:
- **Logging**: ASP.NET Core logging configuration
- **Serilog**: Structured logging configuration
- **GraphQL**: GraphQL-specific settings

### Development Features

When running in Development environment:
- Enhanced exception details in GraphQL responses
- GraphQL IDE (Banana Cake Pop) enabled
- Detailed logging
- Developer exception page

## 📝 Logging

The application uses Serilog for structured logging with:
- Console output with timestamps
- File output with daily rolling (in `logs/` directory)
- Request logging middleware
- Contextual enrichment

Log files are created in the `logs/` directory with the pattern `log-YYYY-MM-DD.txt`.

## 🔧 Hot Reload

The application supports .NET hot reload for development:
- Enabled in `launchSettings.json`
- Works with `dotnet watch run`
- Automatic reload on code changes

## 🏥 Health Checks

Multiple health check endpoints are available:

- **`/health`**: Detailed JSON response with check status
- **`/health/ready`**: Simple readiness check
- **`/health/live`**: Simple liveness check

Health checks include:
- Self-check to verify API is running
- Detailed timing information
- Exception reporting

## 🔒 CORS Configuration

CORS is configured to allow:
- Any origin
- Any method
- Any header

**Note**: In production, configure CORS more restrictively based on your frontend requirements.

## 🚀 Deployment

For production deployment:

1. Set `ASPNETCORE_ENVIRONMENT=Production`
2. Update CORS policy for specific origins
3. Configure appropriate logging levels
4. Set up proper SSL certificates
5. Configure health check monitoring

## 📚 Additional Resources

- [HotChocolate Documentation](https://chillicream.com/docs/hotchocolate)
- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Serilog Documentation](https://serilog.net/)
- [ASP.NET Core Health Checks](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks)
