# JWT Authentication Implementation

This document describes the complete JWT authentication system implemented for the React + Apollo Client + .NET GraphQL application.

## Overview

The authentication system provides secure login functionality with JWT tokens, protected routes, and seamless integration between frontend and backend.

## Backend Implementation

### 1. JWT Configuration
- Added JWT authentication packages to `GraphQLApi.csproj`
- Configured JWT settings in `appsettings.json`
- Set up authentication middleware in `Program.cs`

### 2. Authentication Mutation
- Added `Login` mutation in `GraphQL/Mutation.cs`
- Implements BCrypt password verification
- Returns JWT token with user information
- Token expires in 24 hours (configurable)

### 3. Password Security
- Updated user creation to use BCrypt password hashing
- Updated seed data with properly hashed passwords
- Secure password verification during login

### 4. JWT Token Generation
- Custom JWT token generation with user claims
- Includes user ID, email, username, name, and roles
- Configurable expiration and signing key

## Frontend Implementation

### 1. React Router v6
- Added React Router v6 for navigation
- Implemented route-based authentication flow
- Automatic redirects for unauthenticated users

### 2. Authentication Context
- `AuthContext` manages global authentication state
- Provides login/logout functionality
- Handles JWT token storage in localStorage
- Automatic token validation on app load

### 3. Login Component
- User-friendly login form with validation
- Error handling and loading states
- Demo credentials display
- Form submission with Apollo Client

### 4. Protected Routes
- `ProtectedRoute` component wraps authenticated content
- Automatic redirect to login for unauthenticated users
- Loading states during authentication checks

### 5. Dashboard
- Protected dashboard showing user information
- Logout functionality
- Integration with existing GraphQL components

### 6. Apollo Client Integration
- JWT token automatically attached to GraphQL requests
- Token stored in localStorage
- Automatic token removal on logout
- Error handling for expired tokens

## File Structure

```
backend/
├── GraphQL/
│   └── Mutation.cs          # Login mutation and JWT generation
├── Data/
│   └── Seed/
│       └── SeedData.cs      # Updated with BCrypt hashed passwords
├── Program.cs               # JWT authentication configuration
├── appsettings.json         # JWT settings
└── GraphQLApi.csproj        # Added JWT packages

frontend/
├── src/
│   ├── components/
│   │   ├── Login.tsx        # Login form component
│   │   ├── Dashboard.tsx    # Protected dashboard
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   └── __tests__/       # Component tests
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── graphql/
│   │   └── mutations.ts     # LOGIN_MUTATION added
│   └── App.tsx              # Updated with routing and auth
└── package.json             # Added react-router-dom
```

## Demo Credentials

The following test users are available:

### Customer User
- **Email:** john.doe@example.com
- **Password:** password123

### Admin User
- **Email:** admin@example.com
- **Password:** admin123

### Additional User
- **Email:** jane.smith@example.com
- **Password:** password123

## Testing the Implementation

### 1. Start the Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Test Authentication Flow
1. Visit http://localhost:3000
2. You will be redirected to `/login`
3. Use demo credentials to log in
4. After successful login, you'll be redirected to `/dashboard`
5. The dashboard shows user information and GraphQL functionality
6. JWT token is automatically included in all GraphQL requests
7. Use logout button to clear authentication

### 4. Test Protected Routes
- Try accessing `/dashboard` without logging in
- You should be redirected to `/login`
- After login, you should be redirected back to the intended page

### 5. Test Token Persistence
- Login and refresh the page
- You should remain logged in (token persists in localStorage)
- Token automatically expires after 24 hours

## Security Features

### Backend Security
- BCrypt password hashing with salt
- JWT tokens with configurable expiration
- Secure token signing with secret key
- Role-based claims in JWT tokens
- CORS configuration for frontend access

### Frontend Security
- Secure token storage in localStorage
- Automatic token cleanup on logout
- Protected route validation
- Error handling for authentication failures
- Loading states to prevent UI flashing

## API Endpoints

### GraphQL Mutations
```graphql
# Login mutation
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
      isActive
    }
  }
}
```

### Input Types
```graphql
input LoginInput {
  email: String!
  password: String!
}
```

## Configuration

### JWT Settings (appsettings.json)
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretJwtSigningKeyThatIsAtLeast32CharactersLong",
    "Issuer": "GraphQLApi",
    "Audience": "GraphQLApi",
    "ExpirationHours": "24"
  }
}
```

### Environment Variables
- `REACT_APP_GRAPHQL_ENDPOINT`: GraphQL endpoint URL (defaults to http://localhost:5001/graphql)

## Features Implemented

### ✅ Backend Features
- JWT authentication with .NET Core
- BCrypt password hashing
- Login mutation with GraphQL
- Token generation and validation
- Authentication middleware
- Secure user seed data

### ✅ Frontend Features
- React Router v6 integration
- Authentication context with React hooks
- Login form with validation
- Protected route wrapper
- Dashboard with user information
- JWT token storage and management
- Apollo Client authentication headers
- Logout functionality
- Loading and error states
- Responsive UI design

### ✅ Security Features
- Secure password storage
- JWT token expiration
- Automatic token cleanup
- Protected route validation
- CORS configuration
- Error handling

## Next Steps

Potential enhancements for the authentication system:

1. **Password Reset**: Add forgot password functionality
2. **Registration**: Add user registration form
3. **Profile Management**: Allow users to update their profiles
4. **Role-Based Access**: Implement role-based route protection
5. **Token Refresh**: Add automatic token refresh
6. **Multi-Factor Authentication**: Add 2FA support
7. **Session Management**: Add session timeout warnings
8. **Audit Logging**: Log authentication events

## Troubleshooting

### Common Issues

1. **Backend not starting**: Ensure all packages are restored with `dotnet restore`
2. **Frontend not connecting**: Check GraphQL endpoint URL in environment variables
3. **Login failing**: Verify demo credentials and check browser console for errors
4. **Token not persisting**: Check browser localStorage for token storage
5. **Protected routes not working**: Verify authentication context is properly wrapped around components

### Debug Tips

1. Check browser developer tools for network requests
2. Verify JWT token format in localStorage
3. Check backend logs for authentication errors
4. Use GraphQL playground to test mutations directly
5. Verify CORS settings if requests are blocked

## Conclusion

The JWT authentication system is now fully implemented and provides a secure, user-friendly authentication experience. The system follows best practices for both security and user experience, with proper error handling, loading states, and token management.