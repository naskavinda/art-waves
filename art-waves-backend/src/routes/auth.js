const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstname, lastname, imageUrl } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ 
        error: 'Email, password, firstname, and lastname are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (existingUser) {
        return res.status(409).json({ 
          error: 'User already exists with this email. Please login instead.' 
        });
      }

      try {
        // If user doesn't exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
          'INSERT INTO users (email, password, firstname, lastname, image_url) VALUES (?, ?, ?, ?, ?)', 
          [email, hashedPassword, firstname, lastname, imageUrl || null], 
          function(err) {
            if (err) {
              console.error('Error inserting user:', err);
              return res.status(500).json({ error: 'Error creating user: ' + err.message });
            }
            
            const token = jwt.sign({ 
              id: this.lastID, 
              email,
              firstname,
              lastname
            }, JWT_SECRET);

            res.status(201).json({ 
              token,
              user: {
                id: this.lastID,
                email,
                firstname,
                lastname,
                imageUrl: imageUrl || null
              }
            });
          }
        );
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ error: 'Error processing password' });
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userEmail = email || username; // Accept either email or username field

    if (!userEmail || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [userEmail], async (err, user) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ 
        id: user.id, 
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }, JWT_SECRET);

      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          imageUrl: user.image_url
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  db.get(
    'SELECT id, email, firstname, lastname, image_url, created_at FROM users WHERE id = ?', 
    [req.user.id], 
    (err, user) => {
      if (err) {
        console.error('Error getting user:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        imageUrl: user.image_url,
        createdAt: user.created_at
      });
    }
  );
});

// Debug route to check users (Remove in production)
router.get('/debug/users', (req, res) => {
  db.all('SELECT id, email, firstname, lastname, image_url, created_at FROM users', [], (err, users) => {
    if (err) {
      console.error('Error getting users:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ users });
  });
});

module.exports = router;
