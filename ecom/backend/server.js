const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check (works before DB init)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vibe Commerce API is running' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    // Load routes AFTER database is initialized
    const productRoutes = require('./routes/products');
    const cartRoutes = require('./routes/cart');
    
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });

