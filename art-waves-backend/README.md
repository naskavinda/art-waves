# Art Waves Backend API

This is the backend API for Art Waves application with authentication endpoints.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the development server:
```bash
npm run dev
```

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "yourpassword",
    "firstname": "John",
    "lastname": "Doe",
    "imageUrl": "https://example.com/profile.jpg" // Optional
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
    "token": "jwt-token-here",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "imageUrl": "https://example.com/profile.jpg"
    }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  ```json
  {
      "error": "Email, password, firstname, and lastname are required"
  }
  ```
- **Code**: 400 Bad Request
  ```json
  {
      "error": "Invalid email format"
  }
  ```
- **Code**: 400 Bad Request
  ```json
  {
      "error": "Password must be at least 6 characters long"
  }
  ```
- **Code**: 409 Conflict
  ```json
  {
      "error": "User already exists with this email. Please login instead."
  }
  ```

### 2. Login
Login with existing credentials.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
    "email": "user@example.com",     // You can use either email or username
    "username": "user@example.com",  // Both fields work the same way
    "password": "yourpassword"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
    "token": "jwt-token-here",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "imageUrl": "https://example.com/profile.jpg"
    }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  ```json
  {
      "error": "Email/username and password are required"
  }
  ```
- **Code**: 401 Unauthorized
  ```json
  {
      "error": "Invalid credentials"
  }
  ```

### 3. Get Current User
Get information about the currently logged-in user.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Headers Required**: 
  - `Authorization: Bearer your-jwt-token`

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "imageUrl": "https://example.com/profile.jpg",
    "createdAt": "2024-02-02T10:30:00.000Z"
}
```

**Error Response**:
- **Code**: 401 Unauthorized
  ```json
  {
      "error": "Please authenticate."
  }
  ```

## Authentication Flow

1. **Sign Up**:
   - Call the signup endpoint with required user details
   - Store the returned JWT token and user information

2. **Login**:
   - Call the login endpoint with email and password
   - Store the returned JWT token and user information

3. **Authenticated Requests**:
   - Add the JWT token to the Authorization header
   - Format: `Authorization: Bearer your-jwt-token`

4. **Logout**:
   - Client-side: Remove the stored JWT token and user information
   - No server-side endpoint needed as JWT is stateless

## Security Notes

1. All passwords are hashed using bcrypt before storage
2. JWT tokens include user's basic information (id, email, firstname, lastname)
3. Password must be at least 6 characters long
4. Email format is validated
5. All endpoints use HTTPS in production
6. Change the JWT_SECRET in production to a strong, unique value
