# Art Waves Backend API

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

## API Documentation

### Products

#### Advanced Product Filtering
```http
POST /api/products/filter
Content-Type: application/json
```

All filter parameters are optional. The endpoint will only apply filters that are provided and valid.

**Request Body Parameters:**
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

**Response Format:**
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
    // Only includes filters that were actually applied
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

### Filter Examples

#### 1. Basic Pagination (No Filters)
```json
{
  "page": 1,
  "limit": 10
}
```

#### 2. Price Range Only
```json
{
  "price": {
    "max": 500
  }
}
```

#### 3. Category and Rating
```json
{
  "categories": [1],
  "rating": 4
}
```

#### 4. Search with Sort
```json
{
  "search": "abstract",
  "sortBy": "price",
  "sortOrder": "desc"
}
```

#### 5. Multiple Filters
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

### Filter Behavior

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

4. **Response Format**
   - The `filters` object in the response only includes filters that were actually applied
   - Pagination info is always included
   - Products are always sorted (by id if no sort specified)

### Other Endpoints

#### Get Product Details
```http
GET /api/products/:id
```

#### Get Product Reviews
```http
GET /api/products/:id/reviews
```

#### Add Product Review
```http
POST /api/products/:id/reviews
Content-Type: application/json

{
  "rating": 5,
  "comment": "Beautiful artwork!",
  "reviewer_name": "Jane Smith"
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Server Error

Error Response Format:
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

## Development

### Scripts
- `npm run dev`: Start development server
- `npm run seed`: Generate sample data
- `npm test`: Run tests

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
