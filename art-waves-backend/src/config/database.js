const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.initialize();
    Database.instance = this;
    return this;
  }

  initialize() {
    // Create database directory if it doesn't exist
    const dbDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'database.sqlite');
    console.log('Database path:', this.dbPath);

    // Check if database exists and delete it
    if (fs.existsSync(this.dbPath)) {
      console.log('Database file exists, deleting...');
      try {
        fs.unlinkSync(this.dbPath);
        console.log('Existing database deleted');
      } catch (err) {
        console.error('Error deleting database:', err);
      }
    }

    // Create new database connection
    this.db = new sqlite3.Database(
      this.dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error('Error opening database:', err);
          process.exit(1);
        }
        console.log('Connected to database');
        
        // Enable foreign keys
        this.db.run('PRAGMA foreign_keys = ON');
        
        // Create tables
        this.createTables();
      }
    );

    // Handle process termination
    process.on('SIGINT', () => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
        process.exit(0);
      });
    });
  }

  createTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Drop existing tables
        this.db.run('DROP TABLE IF EXISTS product_images');
        this.db.run('DROP TABLE IF EXISTS products');
        this.db.run('DROP TABLE IF EXISTS categories');
        this.db.run('DROP TABLE IF EXISTS users');

        // Create users table
        this.db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, err => {
          if (err) {
            console.error('Error creating users table:', err);
            reject(err);
          } else {
            console.log('Users table created');
          }
        });

        // Create categories table
        this.db.run(`
          CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, err => {
          if (err) {
            console.error('Error creating categories table:', err);
            reject(err);
          } else {
            console.log('Categories table created');
          }
        });

        // Create products table
        this.db.run(`
          CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            discount DECIMAL(5,2),
            final_price DECIMAL(10,2) NOT NULL,
            category_id INTEGER,
            stock INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id)
          )
        `, err => {
          if (err) {
            console.error('Error creating products table:', err);
            reject(err);
          } else {
            console.log('Products table created');
          }
        });

        // Create product_images table
        this.db.run(`
          CREATE TABLE product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            image_url TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
          )
        `, err => {
          if (err) {
            console.error('Error creating product_images table:', err);
            reject(err);
          } else {
            console.log('Product images table created');
            resolve();
          }
        });
      });
    });
  }

  get() {
    return this.db;
  }
}

// Create a single instance
const database = new Database();

// Export the database instance
module.exports = database.get();
