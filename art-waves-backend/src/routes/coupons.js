const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Function to read the latest db.json data
function getDb() {
  const dbPath = path.join(__dirname, '../data/db.json');
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Calculate discount for cart
router.post('/apply', (req, res) => {
  const { code, cart_amount } = req.body;

  // Validate input
  if (!code || !cart_amount) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['code', 'cart_amount']
    });
  }

  // Validate cart amount is a positive number
  if (typeof cart_amount !== 'number' || cart_amount <= 0) {
    return res.status(400).json({
      error: 'cart_amount must be a positive number'
    });
  }

  const db = getDb();
  const coupon = db.coupons.find(c => c.code === code.toUpperCase());

  if (!coupon) {
    return res.status(404).json({
      error: 'Invalid coupon code'
    });
  }

  // Calculate discount
  const discount_amount = (cart_amount * coupon.discount_amount) / 100;
  const final_amount = cart_amount - discount_amount;

  res.json({
    original_amount: cart_amount,
    discount_percentage: coupon.discount_amount,
    discount_amount: Number(discount_amount.toFixed(2)),
    final_amount: Number(final_amount.toFixed(2))
  });
});

module.exports = router;
