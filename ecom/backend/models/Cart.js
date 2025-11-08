// Cart model (if using MongoDB directly)
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 
    'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  name: String,
  price: Number
});

module.exports = mongoose.model('Cart', cartItemSchema);

