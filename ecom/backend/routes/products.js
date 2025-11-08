const express = require('express');
const router = express.Router();

// Get Product dynamically to ensure it's initialized
const getProduct = () => {
  const { Product } = require('../config/database');
  if (!Product) {
    throw new Error('Database not initialized. Product model is not available.');
  }
  return Product;
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const Product = getProduct();
    const products = await Product.find().exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const Product = getProduct();
    const product = await Product.findById(req.params.id).exec();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

