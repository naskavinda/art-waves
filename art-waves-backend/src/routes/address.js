const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Function to read the latest db.json data
function getDb() {
  const dbPath = path.join(__dirname, '../data/db.json');
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Function to write to db.json
function writeDb(data) {
  const dbPath = path.join(__dirname, '../data/db.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Get address by user ID and type
router.get('/:userId/:type', (req, res) => {
  const userId = parseInt(req.params.userId);
  const type = req.params.type.toLowerCase();

  // Validate userId
  if (isNaN(userId)) {
    return res.status(400).json({
      error: 'User ID must be a number'
    });
  }

  // Validate type
  const validTypes = ['all', 'normal', 'shipping', 'billing'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: 'Invalid address type',
      validTypes
    });
  }

  const db = getDb();
  const addresses = db.addresses || [];

  // Filter addresses by userId and type
  const userAddresses = type === 'all' 
    ? addresses.filter(a => a.userId === userId)
    : addresses.filter(a => a.userId === userId && a.type === type);

  if (userAddresses.length === 0) {
    return res.status(404).json({
      message: type === 'all' 
        ? 'No addresses found for this user'
        : `No ${type} address found for this user`
    });
  }

  res.json({
    addresses: userAddresses
  });
});

// Save user address
router.post('/save', (req, res) => {
  const { userId, type, address } = req.body;

  // Validate input
  if (!userId || !type || !address) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['userId', 'type', 'address']
    });
  }

  // Validate userId is a number
  if (typeof userId !== 'number') {
    return res.status(400).json({
      error: 'userId must be a number'
    });
  }

  // Validate address type
  const validTypes = ['normal', 'shipping', 'billing'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: 'Invalid address type',
      validTypes
    });
  }

  // Validate address fields
  const requiredFields = ['address', 'city', 'state', 'postalCode', 'country'];
  for (const field of requiredFields) {
    if (!address[field]) {
      return res.status(400).json({
        error: `Missing required address field: ${field}`,
        requiredFields
      });
    }
  }

  const db = getDb();

  // Initialize addresses array if it doesn't exist
  if (!db.addresses) {
    db.addresses = [];
  }

  // Check if user already has this type of address
  const existingAddressIndex = db.addresses.findIndex(
    a => a.userId === userId && a.type === type
  );

  const addressData = {
    userId,
    type,
    ...address,
    updatedAt: new Date().toISOString()
  };

  if (existingAddressIndex >= 0) {
    // Update existing address
    db.addresses[existingAddressIndex] = addressData;
  } else {
    // Add new address
    db.addresses.push(addressData);
  }

  writeDb(db);

  res.json({
    message: 'Address saved successfully',
    address: addressData
  });
});

// Get user addresses
router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({
      error: 'User ID must be a number'
    });
  }

  const db = getDb();
  const addresses = db.addresses?.filter(a => a.userId === userId) || [];

  res.json({ addresses });
});

module.exports = router;
