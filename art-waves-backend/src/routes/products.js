const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Load data from JSON file
function loadData() {
  const dbPath = path.join(__dirname, '../data/db.json');
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading data:', err);
    return { categories: [], products: [] };
  }
}

// Debug route to check data
router.get('/debug/database', (req, res) => {
  const dbPath = path.join(__dirname, '../data/db.json');
  const exists = fs.existsSync(dbPath);
  
  try {
    const data = loadData();
    res.json({
      dbPath,
      exists,
      data
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading data',
      details: err.message
    });
  }
});

// Debug route to check categories
router.get('/debug/categories', (req, res) => {
  try {
    const { categories } = loadData();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading categories',
      details: err.message
    });
  }
});

// Debug route to check products
router.get('/debug/all', (req, res) => {
  try {
    const { products } = loadData();
    res.json({ products });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading products',
      details: err.message
    });
  }
});

// Debug route to check database tables
router.get('/debug/tables', (req, res) => {
  try {
    const data = loadData();
    res.json({ tables: Object.keys(data) });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading tables',
      details: err.message
    });
  }
});

// Get all categories
router.get('/categories', (req, res) => {
  try {
    const { categories } = loadData();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading categories',
      details: err.message
    });
  }
});

// Get products by category
router.get('/category/:categoryId', (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const { products, categories } = loadData();
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const categoryProducts = products.filter(p => p.category_id === categoryId);
    
    res.json({
      category,
      products: categoryProducts
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading category products',
      details: err.message
    });
  }
});

// Search products
router.get('/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const { products } = loadData();
    
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
    
    res.json({
      query,
      results: searchResults,
      total: searchResults.length
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error searching products',
      details: err.message
    });
  }
});

// Get product by ID with related products
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { products } = loadData();
    
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Find related products from same category
    const relatedProducts = products
      .filter(p => p.category_id === product.category_id && p.id !== id)
      .slice(0, 4); // Get up to 4 related products
    
    res.json({
      product,
      relatedProducts
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading product',
      details: err.message
    });
  }
});

// Get product reviews
router.get('/:id/reviews', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { products } = loadData();
    
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      product_id: id,
      reviews: product.reviews,
      average_rating: product.average_rating,
      review_count: product.review_count
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading reviews',
      details: err.message
    });
  }
});

// Add a new review
router.post('/:id/reviews', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rating, comment, reviewer_name } = req.body;
    
    // Validate input
    if (!rating || !comment || !reviewer_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Load current data
    const dbPath = path.join(__dirname, '../data/db.json');
    const data = loadData();
    
    // Find product
    const productIndex = data.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Add new review
    const newReview = {
      id: (data.products[productIndex].reviews.length + 1),
      rating,
      comment,
      reviewer_name,
      date: new Date().toISOString()
    };
    
    data.products[productIndex].reviews.push(newReview);
    
    // Update average rating and review count
    const reviews = data.products[productIndex].reviews;
    data.products[productIndex].average_rating = Number(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    );
    data.products[productIndex].review_count = reviews.length;
    
    // Save updated data
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    res.json({
      message: 'Review added successfully',
      review: newReview
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error adding review',
      details: err.message
    });
  }
});

// Helper function to parse range query parameter
function parseRange(rangeStr) {
  if (!rangeStr) return null;
  try {
    const range = JSON.parse(rangeStr);
    return {
      min: typeof range.min === 'number' ? range.min : null,
      max: typeof range.max === 'number' ? range.max : null
    };
  } catch (err) {
    return null;
  }
}

// Helper function to parse array query parameter
function parseArrayParam(param) {
  if (!param) return null;
  if (Array.isArray(param)) return param;
  if (typeof param === 'string') {
    try {
      const parsed = JSON.parse(param);
      return Array.isArray(parsed) ? parsed : [param];
    } catch (err) {
      return [param];
    }
  }
  return null;
}

// Get paginated products with advanced filtering
router.post('/filter', (req, res) => {
  try {
    // Extract only provided fields from request body
    const {
      page,
      limit,
      categories,
      price,
      discount,
      rating,
      sortBy,
      sortOrder,
      search
    } = req.body;

    // Load data
    let { products } = loadData();

    // Only apply category filter if categories array is provided and not empty
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const validCategories = categories.map(c => parseInt(c)).filter(c => !isNaN(c));
      if (validCategories.length > 0) {
        products = products.filter(p => validCategories.includes(p.category_id));
      }
    }

    // Only apply price filter if price object with valid min or max is provided
    if (price && typeof price === 'object') {
      const minPrice = typeof price.min === 'number' ? price.min : null;
      const maxPrice = typeof price.max === 'number' ? price.max : null;

      if (minPrice !== null) {
        products = products.filter(p => p.final_price >= minPrice);
      }
      if (maxPrice !== null) {
        products = products.filter(p => p.final_price <= maxPrice);
      }
    }

    // Only apply discount filter if discount object with valid min or max is provided
    if (discount && typeof discount === 'object') {
      const minDiscount = typeof discount.min === 'number' ? discount.min : null;
      const maxDiscount = typeof discount.max === 'number' ? discount.max : null;

      if (minDiscount !== null) {
        products = products.filter(p => p.discount >= minDiscount);
      }
      if (maxDiscount !== null) {
        products = products.filter(p => p.discount <= maxDiscount);
      }
    }

    // Only apply rating filter if valid rating is provided
    if (typeof rating === 'number' && !isNaN(rating) && rating > 0) {
      products = products.filter(p => p.average_rating >= rating);
    }

    // Only apply search filter if search string is provided
    if (typeof search === 'string' && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination with defaults
    const currentPage = Math.max(1, parseInt(page) || 1);
    const itemsPerPage = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Apply sorting if valid sortBy is provided
    const validSortFields = ['id', 'price', 'name', 'rating', 'discount'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
    const finalSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    products.sort((a, b) => {
      let comparison = 0;
      switch (finalSortBy) {
        case 'price':
          comparison = a.final_price - b.final_price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = b.average_rating - a.average_rating;
          break;
        case 'discount':
          comparison = b.discount - a.discount;
          break;
        default:
          comparison = a.id - b.id;
      }
      return finalSortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Return response with only applied filters
    const response = {
      products: paginatedProducts,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage
      },
      filters: {}
    };

    // Only include filters that were actually applied
    if (categories && Array.isArray(categories) && categories.length > 0) {
      response.filters.categories = categories;
    }
    if (price && typeof price === 'object' && (typeof price.min === 'number' || typeof price.max === 'number')) {
      response.filters.price = price;
    }
    if (discount && typeof discount === 'object' && (typeof discount.min === 'number' || typeof discount.max === 'number')) {
      response.filters.discount = discount;
    }
    if (typeof rating === 'number' && !isNaN(rating) && rating > 0) {
      response.filters.rating = rating;
    }
    if (typeof search === 'string' && search.trim()) {
      response.filters.search = search.trim();
    }
    if (validSortFields.includes(sortBy)) {
      response.filters.sortBy = sortBy;
      response.filters.sortOrder = finalSortOrder;
    }

    res.json(response);
  } catch (err) {
    console.error('Error in /filter route:', err);
    res.status(500).json({
      error: 'Error filtering products',
      details: err.message
    });
  }
});

// Get paginated products with filters
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category ? parseInt(req.query.category) : null;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || 'id'; // id, price, name
    const sortOrder = req.query.sortOrder || 'asc'; // asc, desc
    
    let { products } = loadData();
    
    // Apply filters
    if (categoryId) {
      products = products.filter(p => p.category_id === categoryId);
    }
    
    if (minPrice !== null) {
      products = products.filter(p => p.final_price >= minPrice);
    }
    
    if (maxPrice !== null) {
      products = products.filter(p => p.final_price <= maxPrice);
    }
    
    // Apply sorting
    products.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.final_price - b.final_price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = a.id - b.id;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = products.length;
    
    // Get paginated results
    const results = products.slice(startIndex, endIndex);
    
    res.json({
      products: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error loading products',
      details: err.message
    });
  }
});

module.exports = router;
