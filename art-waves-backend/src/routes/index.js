const express = require('express');
const router = express.Router();

const productsRouter = require('./products');
const couponsRouter = require('./coupons');
const authRouter = require('./auth');
const addressRouter = require('./address');

// Log all incoming requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/coupons', couponsRouter);
router.use('/address', addressRouter);

module.exports = router;
