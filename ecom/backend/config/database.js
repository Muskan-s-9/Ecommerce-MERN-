// Database configuration - supports both MongoDB and JSON file storage
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let Product = null;
let Cart = null;

// JSON file storage (simple, no compilation needed)
const dataDir = path.join(__dirname, '../data');
const productsFile = path.join(dataDir, 'products.json');
const cartFile = path.join(dataDir, 'cart.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readJSON = (file) => {
  ensureDataDir();
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeJSON = (file, data) => {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const initDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'json';

  if (dbType === 'mongodb') {
    // MongoDB setup
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    const productSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      image: String,
      stock: Number
    });

    const cartItemSchema = new mongoose.Schema({
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      name: String,
      price: Number
    });

    Product = mongoose.model('Product', productSchema);
    Cart = mongoose.model('Cart', cartItemSchema);
    
    console.log('MongoDB connected');
  } else {
    // JSON file storage setup
    ensureDataDir();
    
    // Create model-like functions for JSON storage
    Product = {
      find: () => ({
        exec: async () => {
          return readJSON(productsFile);
        }
      }),
      findById: (id) => ({
        exec: async () => {
          const products = readJSON(productsFile);
          return products.find(p => (p.id || p._id) == id) || null;
        }
      }),
      create: async (data) => {
        const products = readJSON(productsFile);
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id || p._id || 0)) + 1 : 1;
        const newProduct = { id: newId, _id: newId, ...data };
        products.push(newProduct);
        writeJSON(productsFile, products);
        return newProduct;
      }
    };

    Cart = {
      find: () => ({
        exec: async () => {
          return readJSON(cartFile);
        }
      }),
      findOne: (query) => ({
        exec: async () => {
          const cartItems = readJSON(cartFile);
          if (query.productId) {
            return cartItems.find(item => item.productId == query.productId) || null;
          }
          return null;
        }
      }),
      create: async (data) => {
        const cartItems = readJSON(cartFile);
        const newId = cartItems.length > 0 ? Math.max(...cartItems.map(item => item.id || item._id || 0)) + 1 : 1;
        const newItem = { id: newId, _id: newId, ...data };
        cartItems.push(newItem);
        writeJSON(cartFile, cartItems);
        return newItem;
      },
      findByIdAndUpdate: async (id, update) => {
        const cartItems = readJSON(cartFile);
        const index = cartItems.findIndex(item => (item.id || item._id) == id);
        if (index === -1) return null;
        if (update.quantity !== undefined) {
          cartItems[index].quantity = update.quantity;
        }
        writeJSON(cartFile, cartItems);
        return cartItems[index];
      },
      findByIdAndDelete: async (id) => {
        const cartItems = readJSON(cartFile);
        const filtered = cartItems.filter(item => (item.id || item._id) != id);
        writeJSON(cartFile, filtered);
        return { _id: id };
      },
      deleteMany: async () => {
        writeJSON(cartFile, []);
        return { deletedCount: 1 };
      }
    };

    // Seed initial products if database is empty
    const existingProducts = readJSON(productsFile);
    if (existingProducts.length === 0) {
      const products = [
        { name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 199.99, image: 'https://via.placeholder.com/300', stock: 50 },
        { name: 'Smart Watch', description: 'Fitness tracking smartwatch', price: 299.99, image: 'https://via.placeholder.com/300', stock: 30 },
        { name: 'Laptop Stand', description: 'Ergonomic aluminum laptop stand', price: 49.99, image: 'https://via.placeholder.com/300', stock: 100 },
        { name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard', price: 129.99, image: 'https://via.placeholder.com/300', stock: 75 },
        { name: 'USB-C Hub', description: 'Multi-port USB-C hub', price: 39.99, image: 'https://via.placeholder.com/300', stock: 200 }
      ];
      writeJSON(productsFile, products.map((p, idx) => ({ id: idx + 1, _id: idx + 1, ...p })));
    }

    console.log('JSON file database initialized');
  }
};

module.exports = { 
  initDatabase, 
  get Product() { return Product; },
  get Cart() { return Cart; }
};

