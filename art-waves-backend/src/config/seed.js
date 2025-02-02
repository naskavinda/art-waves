const db = require('./database');
const { categories, generateProducts } = require('./seedData');

async function waitForTables() {
  return new Promise((resolve) => {
    const checkTables = () => {
      db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
          console.error('Error checking tables:', err);
          setTimeout(checkTables, 1000);
          return;
        }

        const requiredTables = ['users', 'categories', 'products', 'product_images'];
        const allTablesExist = requiredTables.every(table => 
          tables.some(t => t.name === table)
        );

        if (allTablesExist) {
          console.log('All required tables are ready');
          resolve();
        } else {
          console.log('Waiting for tables to be created...');
          setTimeout(checkTables, 1000);
        }
      });
    };

    checkTables();
  });
}

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  await waitForTables();

  // Insert categories
  for (const category of categories) {
    await new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
      stmt.run(category.name, category.description, function(err) {
        if (err) {
          console.error('Error inserting category:', err);
          reject(err);
          return;
        }
        
        const categoryId = this.lastID;
        console.log(`Inserted category ${category.name} with ID ${categoryId}`);
        
        // Generate products for this category
        const products = generateProducts(category.name, categoryId);
        
        // Insert products sequentially
        const insertProducts = async () => {
          for (const product of products) {
            await new Promise((resolve, reject) => {
              const stmt = db.prepare(
                'INSERT INTO products (name, description, price, discount, final_price, category_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?)'
              );
              
              stmt.run(
                product.name,
                product.description,
                product.price,
                product.discount,
                product.final_price,
                product.category_id,
                product.stock,
                function(err) {
                  if (err) {
                    console.error('Error inserting product:', err);
                    reject(err);
                    return;
                  }
                  
                  const productId = this.lastID;
                  console.log(`Inserted product ${product.name} with ID ${productId}`);
                  
                  // Insert images for this product
                  const insertImages = async () => {
                    for (const image of product.images) {
                      await new Promise((resolve, reject) => {
                        const stmt = db.prepare(
                          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)'
                        );
                        
                        stmt.run(
                          productId,
                          image.url,
                          image.is_primary ? 1 : 0,
                          (err) => {
                            if (err) {
                              console.error('Error inserting image:', err);
                              reject(err);
                            } else {
                              resolve();
                            }
                          }
                        );
                      });
                    }
                  };
                  
                  insertImages()
                    .then(resolve)
                    .catch(reject);
                }
              );
            });
          }
        };
        
        insertProducts()
          .then(() => {
            console.log(`Completed seeding for category: ${category.name}`);
            resolve();
          })
          .catch(reject);
      });
    });
  }
  
  console.log('Database seeding completed successfully!');
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully');
  })
  .catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
  });
