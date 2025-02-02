const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const dbDir = path.resolve(__dirname, '..');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'database.sqlite');

// If database exists, delete it to recreate with new schema
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Existing database deleted');
  } catch (err) {
    console.error('Error deleting existing database:', err);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to database at:', dbPath);
});

// Create users table with new schema
db.serialize(() => {
  // Drop existing table if it exists
  db.run('DROP TABLE IF EXISTS users', (err) => {
    if (err) {
      console.error('Error dropping users table:', err);
      return;
    }
    console.log('Dropped existing users table');
  });

  // Create new table with updated schema
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created with new schema');
  });
});

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      return;
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = db;
