# Art Waves Backend API

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [API Documentation](#api-documentation)
   - [Authentication](#authentication)
   - [Products](#products)
   - [Coupons](#coupons)
   - [Address](#address)
4. [Error Handling](#error-handling)
5. [Development](#development)

## Overview
Art Waves is a modern e-commerce platform for art enthusiasts. This backend API provides endpoints for managing products, categories, reviews, and user authentication.

## Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/art-waves-backend.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables
```env
PORT=3000              # Server port (default: 3000)
NODE_ENV=development   # Environment (development/production)
```

## API Documentation

### Authentication

#### 1. Sign Up
Create a new user account.

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe",
  "imageUrl": "https://example.com/profile.jpg" // Optional
}
```

##### Required Fields
- `email`: Valid email address
- `password`: At least 6 characters long
- `firstname`: User's first name
- `lastname`: User's last name
- `imageUrl`: Optional profile image URL

##### Success Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "imageUrl": "https://example.com/profile.jpg"
  }
}
```

##### Error Responses
```json
{
  "error": "Email, password, firstname, and lastname are required"
}
```
```json
{
  "error": "Invalid email format"
}
```
```json
{
  "error": "Password must be at least 6 characters long"
}
```
```json
{
  "error": "User already exists with this email. Please login instead."
}
```

#### 2. Login
Authenticate an existing user.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",  // Can use either email or username
  "password": "password123"
}
```

##### Required Fields
- `email` or `username`: User's email address or username
- `password`: User's password

##### Success Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "imageUrl": "https://example.com/profile.jpg"
  }
}
```

##### Error Responses
```json
{
  "error": "Email/username and password are required"
}
```
```json
{
  "error": "Invalid credentials"
}
```

#### 3. Authentication Method
The API uses JWT (JSON Web Token) for authentication. For protected endpoints, include the token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Products

#### 1. Advanced Product Filtering
```http
POST /api/products/filter
Content-Type: application/json
```

##### Request Body Parameters
```javascript
{
  // Pagination (optional, defaults provided)
  "page": 1,        // Default: 1
  "limit": 10,      // Default: 10, Max: 50

  // Category Filter (optional)
  "categories": [1, 2],  // Array of category IDs

  // Price Filter (optional)
  "price": {
    "min": 100,    // Optional minimum price
    "max": 1000    // Optional maximum price
  },

  // Discount Filter (optional)
  "discount": {
    "min": 10,     // Optional minimum discount percentage
    "max": 30      // Optional maximum discount percentage
  },

  // Rating Filter (optional)
  "rating": 4,     // Minimum rating threshold

  // Sorting (optional)
  "sortBy": "price",    // Options: "id", "price", "name", "rating", "discount"
  "sortOrder": "desc",  // Options: "asc", "desc", Default: "asc"

  // Search (optional)
  "search": "abstract"  // Search in name and description
}
```

##### Response Format
```javascript
{
  "products": [
    {
      "id": 1,
      "name": "Abstract Composition",
      "description": "Beautiful abstract artwork...",
      "price": 899.99,
      "discount": 15,
      "final_price": 764.99,
      "category_id": 1,
      "stock": 5,
      "average_rating": 4.5,
      "review_count": 12,
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "is_primary": true
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  },
  "filters": {
    "categories": [1, 2],
    "price": {
      "min": 100,
      "max": 1000
    },
    "rating": 4,
    "sortBy": "price",
    "sortOrder": "desc"
  }
}
```

##### Filter Examples

###### Basic Pagination (No Filters)
```json
{
  "page": 1,
  "limit": 10
}
```

###### Price Range Only
```json
{
  "price": {
    "max": 500
  }
}
```

###### Category and Rating
```json
{
  "categories": [1],
  "rating": 4
}
```

###### Search with Sort
```json
{
  "search": "abstract",
  "sortBy": "price",
  "sortOrder": "desc"
}
```

###### Multiple Filters
```json
{
  "categories": [1, 2],
  "price": {
    "min": 100,
    "max": 1000
  },
  "rating": 4,
  "sortBy": "rating",
  "sortOrder": "desc"
}
```

##### Filter Behavior
1. **Missing Parameters**
   - Any missing filter parameter will be ignored
   - The API will return all products that match the provided filters only
   - Pagination defaults will still apply

2. **Invalid Values**
   - Invalid category IDs are ignored
   - Invalid numeric values are ignored
   - Invalid sort fields default to 'id'
   - Invalid sort order defaults to 'asc'

3. **Empty or Partial Filters**
   - Empty category arrays are ignored
   - Price ranges can have either min, max, or both
   - Discount ranges can have either min, max, or both
   - Empty search strings are ignored

#### 2. Other Product Endpoints

##### Get Product Details
```http
GET /api/products/:id
```

##### Get Product Reviews
```http
GET /api/products/:id/reviews
```

##### Add Product Review
```http
POST /api/products/:id/reviews
Content-Type: application/json

{
  "rating": 5,
  "comment": "Beautiful artwork!",
  "reviewer_name": "Jane Smith"
}
```

### Coupons

#### 1. List Active Coupons
```http
GET /api/coupons
```

##### Response
```json
{
  "coupons": [
    {
      "code": "WELCOME20",
      "description": "Welcome discount for new customers",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_purchase": 100,
      "max_discount": 1000,
      "valid_until": "2025-12-31T00:00:00.000Z"
    }
  ]
}
```

#### 2. Validate Coupon
```http
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "WELCOME20",
  "cart_items": [
    {
      "id": 1,
      "category_id": 1,
      "price": 899.99,
      "quantity": 1
    }
  ],
  "total_amount": 899.99
}
```

##### Response
```json
{
  "valid": true,
  "coupon": {
    "code": "WELCOME20",
    "description": "Welcome discount for new customers",
    "discount_type": "percentage",
    "discount_value": 20,
    "applies_to": "all"
  },
  "discount_amount": 180.00
}
```

#### 3. Apply Coupon
```http
POST /api/coupons/apply
Content-Type: application/json

{
  "code": "WELCOME20"
}
```

#### 4. Coupon Types and Rules

##### Available Coupon Types
1. **Percentage Discount**
   - Applies percentage off the eligible amount
   - Example: WELCOME20 (20% off entire purchase)

2. **Fixed Amount Discount**
   - Applies fixed dollar amount off
   - Example: ART100 ($100 off paintings)

3. **Category-Specific Discount**
   - Only applies to specific product categories
   - Example: DIGITAL30 (30% off digital art)

##### Validation Rules
1. **Minimum Purchase**
   - Each coupon has a minimum order amount
   - Cart total must meet this requirement

2. **Maximum Discount**
   - Caps the maximum discount amount
   - Prevents excessive discounts on large orders

3. **Usage Limits**
   - Maximum number of times a coupon can be used
   - Tracked globally across all users

4. **Validity Period**
   - Start and end dates for the coupon
   - Automatically expires after end date

5. **Category Restrictions**
   - Some coupons only apply to specific categories
   - Discount calculated only on eligible items

### Address

#### 1. Get User Address
Get address by user ID and type. Type can be 'normal', 'shipping', 'billing', or 'all' to get all addresses.

```http
GET /api/address/:userId/:type
```

##### Parameters
- `userId`: User ID (number)
- `type`: Address type (string) - 'normal', 'shipping', 'billing', or 'all'

##### Success Response
```json
{
  "addresses": [
    {
      "userId": 1,
      "type": "shipping",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "updatedAt": "2025-02-03T22:25:05.688Z"
    }
  ]
}
```

##### Error Responses
```json
{
  "error": "User ID must be a number"
}
```
```json
{
  "error": "Invalid address type",
  "validTypes": ["all", "normal", "shipping", "billing"]
}
```
```json
{
  "message": "No addresses found for this user"
}
```

#### 2. Save User Address
Save or update a user's address of a specific type.

```http
POST /api/address/save
```

##### Request Body
```json
{
  "userId": 1,
  "type": "shipping",
  "address": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

##### Fields
- `userId`: User ID (number, required)
- `type`: Address type (string, required) - 'normal', 'shipping', or 'billing'
- `address`: Address object (required)
  - `address`: Street address (string, required)
  - `city`: City name (string, required)
  - `state`: State name (string, required)
  - `postalCode`: Postal code (string, required)
  - `country`: Country name (string, required)

##### Success Response
```json
{
  "message": "Address saved successfully",
  "address": {
    "userId": 1,
    "type": "shipping",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "updatedAt": "2025-02-03T22:25:05.688Z"
  }
}
```

##### Error Responses
```json
{
  "error": "Missing required fields",
  "required": ["userId", "type", "address"]
}
```
```json
{
  "error": "userId must be a number"
}
```
```json
{
  "error": "Invalid address type",
  "validTypes": ["normal", "shipping", "billing"]
}
```
```json
{
  "error": "Missing required address field: address",
  "requiredFields": ["address", "city", "state", "postalCode", "country"]
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

### Common Error Cases
1. Invalid coupon code
2. Expired coupon
3. Minimum purchase not met
4. Usage limit exceeded
5. Invalid product ID
6. Missing required fields

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run seed`: Generate sample data
- `npm test`: Run tests
- `npm run lint`: Run ESLint

### Data Generation
The seed script generates:
- 8 product categories
- 100 sample products
- 10 sample coupons (3 fixed + 7 random)

### Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
