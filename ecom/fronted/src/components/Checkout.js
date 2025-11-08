import React, { useState } from 'react';
import { cartService } from '../services/api';

const Checkout = ({ onBack, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Mock checkout - no real payment processing
      const response = await cartService.checkout();
      alert(`Order placed successfully! Total: $${response.data.total}`);
      onOrderComplete();
    } catch (err) {
      alert('Checkout failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="checkout-actions">
          <button type="button" onClick={onBack} className="btn-back">
            Back to Cart
          </button>
          <button type="submit" disabled={processing} className="btn-submit">
            {processing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

