# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY BlogPlatform.Api/BlogPlatform.Api.csproj BlogPlatform.Api/
RUN dotnet restore BlogPlatform.Api/BlogPlatform.Api.csproj

# Copy source code
COPY . .
WORKDIR /src/BlogPlatform.Api

# Build the application
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy published application
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "BlogPlatform.Api.dll"]