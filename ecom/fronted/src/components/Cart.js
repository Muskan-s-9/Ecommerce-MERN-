import React, { useState, useEffect } from 'react';
import { cartService } from '../services/api';

const Cart = ({ onCheckout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartService.getAll();
      setCartItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }
    try {
      await cartService.updateItem(id, newQuantity);
      loadCart();
    } catch (err) {
      alert('Failed to update quantity');
      console.error(err);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await cartService.removeItem(id);
      loadCart();
    } catch (err) {
      alert('Failed to remove item');
      console.error(err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id || item._id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    className="btn-remove"
                    onClick={() => handleRemoveItem(item.id || item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
            <button className="btn-checkout" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

