import React, { useState, useEffect } from 'react';
import { productService, cartService } from '../services/api';
import ProductCard from './ProductCard';

const ProductList = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addItem(productId, 1);
      onCartUpdate();
    } catch (err) {
      alert('Failed to add item to cart');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

