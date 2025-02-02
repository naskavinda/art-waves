const fs = require('fs');
const path = require('path');

// Art-related words for generating names and descriptions
const styles = [
  'Abstract', 'Impressionist', 'Modern', 'Contemporary', 'Classical',
  'Minimalist', 'Surreal', 'Expressionist', 'Pop Art', 'Art Nouveau',
  'Gothic', 'Renaissance', 'Baroque', 'Urban', 'Folk Art'
];

const subjects = [
  'Landscape', 'Seascape', 'Portrait', 'Still Life', 'Nature',
  'City Scene', 'Figure', 'Animal', 'Architecture', 'Garden',
  'Mountain', 'Forest', 'Ocean', 'Street Scene', 'Abstract Composition'
];

const mediums = [
  'Oil', 'Acrylic', 'Watercolor', 'Digital', 'Mixed Media',
  'Charcoal', 'Pencil', 'Bronze', 'Marble', 'Clay',
  'Photography', 'Ink', 'Pastel', 'Metal', 'Glass'
];

const descriptors = [
  'Vibrant', 'Serene', 'Dynamic', 'Ethereal', 'Bold',
  'Delicate', 'Dramatic', 'Mystical', 'Elegant', 'Whimsical',
  'Powerful', 'Subtle', 'Intricate', 'Minimalist', 'Complex'
];

// Function to generate a random number within a range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random price
function generatePrice() {
  const basePrice = randomRange(100, 5000);
  return Number(basePrice.toFixed(2));
}

// Function to generate a random discount
function generateDiscount() {
  const hasDiscount = Math.random() < 0.3; // 30% chance of having a discount
  if (hasDiscount) {
    return randomRange(5, 30); // 5-30% discount
  }
  return 0;
}

// Function to generate a product name
function generateName() {
  const style = styles[Math.floor(Math.random() * styles.length)];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  return `${style} ${subject}`;
}

// Function to generate a product description
function generateDescription(categoryName) {
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  const medium = mediums[Math.floor(Math.random() * mediums.length)];
  return `${descriptor} ${medium} artwork in the ${categoryName} category, showcasing unique artistic vision and masterful technique.`;
}

// Function to generate product images
function generateImages(productId) {
  const baseId = productId * 3; // Each product has 3 images
  return [
    {
      url: `https://picsum.photos/800/600?random=${baseId}`,
      is_primary: true
    },
    {
      url: `https://picsum.photos/800/600?random=${baseId + 1}`,
      is_primary: false
    },
    {
      url: `https://picsum.photos/800/600?random=${baseId + 2}`,
      is_primary: false
    }
  ];
}

// Add review-related arrays
const reviewComments = [
  "Absolutely stunning piece! The colors are vibrant and the detail is incredible.",
  "Beautiful artwork that exceeded my expectations. Shipping was fast and secure.",
  "A masterpiece that brings life to my living room. Very happy with this purchase.",
  "The quality is exceptional. Even better in person than in the photos.",
  "Unique and captivating piece. The artist's talent really shines through.",
  "Great addition to my collection. The craftsmanship is outstanding.",
  "Love the artistic style and technique. A real conversation starter.",
  "Impressive work that shows great attention to detail.",
  "The colors and composition are perfectly balanced.",
  "A wonderful piece that brings joy every time I look at it."
];

const reviewerNames = [
  "John D.", "Sarah M.", "Michael R.", "Emma W.", "David L.",
  "Lisa K.", "Robert P.", "Anna S.", "James B.", "Maria C."
];

// Function to generate a random date within the last year
function generateReviewDate() {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
  return new Date(randomTime).toISOString();
}

// Function to generate reviews for a product
function generateReviews() {
  const numReviews = randomRange(0, 8); // 0-8 reviews per product
  const reviews = [];
  
  for (let i = 0; i < numReviews; i++) {
    const rating = randomRange(3, 5); // Ratings from 3-5 stars
    reviews.push({
      id: i + 1,
      rating,
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      reviewer_name: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
      date: generateReviewDate()
    });
  }
  
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : 0;
  
  return {
    reviews,
    average_rating: avgRating,
    review_count: reviews.length
  };
}

// Function to generate products
function generateProducts(categories, count) {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const categoryId = randomRange(1, categories.length);
    const category = categories.find(c => c.id === categoryId);
    const price = generatePrice();
    const discount = generateDiscount();
    const final_price = Number((price * (1 - discount / 100)).toFixed(2));
    
    products.push({
      id: i,
      name: generateName(),
      description: generateDescription(category.name),
      price,
      discount,
      final_price,
      category_id: categoryId,
      stock: randomRange(1, 10),
      images: generateImages(i),
      ...generateReviews() // Add reviews to each product
    });
  }
  
  return products;
}

// Categories data
const categories = [
  {
    id: 1,
    name: "Paintings",
    description: "Original paintings in various styles and mediums"
  },
  {
    id: 2,
    name: "Digital Art",
    description: "Digital artwork created using various software and techniques"
  },
  {
    id: 3,
    name: "Photography",
    description: "Fine art photography prints in various styles"
  },
  {
    id: 4,
    name: "Sculptures",
    description: "3D artworks in various materials"
  },
  {
    id: 5,
    name: "Mixed Media",
    description: "Artworks combining multiple mediums and techniques"
  },
  {
    id: 6,
    name: "Drawings",
    description: "Hand-drawn artwork using various materials"
  },
  {
    id: 7,
    name: "Abstract",
    description: "Non-representational artwork in various styles"
  },
  {
    id: 8,
    name: "Portrait",
    description: "Portrait artwork in various styles and mediums"
  }
];

// Generate data
const data = {
  categories,
  products: generateProducts(categories, 100) // Generate 100 products
};

// Write to file
const outputPath = path.join(__dirname, '../data/db.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Generated ${data.products.length} products in ${data.categories.length} categories`);
console.log(`Data written to ${outputPath}`);
