// Categories data
const categories = [
  {
    name: 'Paintings',
    description: 'Original paintings in various styles and mediums'
  },
  {
    name: 'Digital Art',
    description: 'Digital artwork created using various software and techniques'
  },
  {
    name: 'Photography',
    description: 'Fine art photography prints in various styles'
  },
  {
    name: 'Sculptures',
    description: '3D artworks in various materials'
  },
  {
    name: 'Mixed Media',
    description: 'Artworks combining multiple mediums and techniques'
  },
  {
    name: 'Drawings',
    description: 'Hand-drawn artwork using various materials'
  },
  {
    name: 'Abstract',
    description: 'Non-representational artwork in various styles'
  },
  {
    name: 'Portrait',
    description: 'Portrait artwork in various styles and mediums'
  }
];

// Art styles for generating product names
const artStyles = [
  'Abstract', 'Modern', 'Contemporary', 'Classic', 'Impressionist',
  'Surreal', 'Minimalist', 'Vibrant', 'Ethereal', 'Dynamic',
  'Urban', 'Natural', 'Mystical', 'Serene'
];

// Subjects for generating product names
const subjects = [
  'Landscape', 'Portrait', 'Still Life', 'Figure', 'Nature',
  'Cityscape', 'Seascape', 'Abstract Composition', 'Geometric Pattern',
  'Floral Study'
];

// Function to generate random product data
function generateProducts(categoryName, categoryId) {
  const numProducts = Math.floor(Math.random() * 10) + 10; // 10-20 products per category
  const products = [];

  for (let i = 1; i <= numProducts; i++) {
    const style = artStyles[Math.floor(Math.random() * artStyles.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const name = `${style} ${subject} #${i}`;
    
    const price = Math.floor(Math.random() * 900) + 100; // 100-1000
    const discount = Math.random() < 0.3 ? Math.floor(Math.random() * 30) : 0; // 30% chance of discount
    const final_price = price - (price * (discount / 100));
    
    const product = {
      name,
      description: `Beautiful ${style.toLowerCase()} ${subject.toLowerCase()} piece in the ${categoryName} category.`,
      price,
      discount,
      final_price,
      category_id: categoryId,
      stock: Math.floor(Math.random() * 10) + 1, // 1-10 items in stock
      images: [
        {
          url: `https://picsum.photos/800/600?random=${Math.random()}`,
          is_primary: true
        },
        {
          url: `https://picsum.photos/800/600?random=${Math.random()}`,
          is_primary: false
        },
        {
          url: `https://picsum.photos/800/600?random=${Math.random()}`,
          is_primary: false
        }
      ]
    };
    
    products.push(product);
  }

  return products;
}

module.exports = {
  categories,
  generateProducts
};
