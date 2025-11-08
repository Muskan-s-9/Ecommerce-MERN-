const express = require('express');
const router = express.Router();

// Get Cart and Product dynamically to ensure they're initialized
const getModels = () => {
  const { Cart, Product } = require('../config/database');
  if (!Cart || !Product) {
    throw new Error('Database not initialized. Cart or Product model is not available.');
  }
  return { Cart, Product };
};

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const { Cart } = getModels();
    const cartItems = await Cart.find().exec();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { Cart, Product } = getModels();
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId).exec();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = await Cart.findOne({ productId }).exec();
    
    if (existingItem) {
      // Update quantity
      const updatedItem = await Cart.findByIdAndUpdate(existingItem.id || existingItem._id, {
        quantity: existingItem.quantity + quantity
      });
      res.json(updatedItem);
    } else {
      // Add new item
      const cartItem = await Cart.create({
        productId,
        quantity,
        name: product.name,
        price: product.price
      });
      res.json(cartItem);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { Cart } = getModels();
    const { quantity } = req.body;
    const updatedItem = await Cart.findByIdAndUpdate(req.params.id, { quantity });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { Cart } = getModels();
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart (mock checkout)
router.post('/checkout', async (req, res) => {
  try {
    const { Cart } = getModels();
    const cartItems = await Cart.find().exec();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Clear cart
    await Cart.deleteMany();
    
    res.json({ 
      message: 'Order placed successfully!', 
      total: total.toFixed(2),
      items: cartItems.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

