import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [currentView, setCurrentView] = useState('products');
  const [cartUpdated, setCartUpdated] = useState(0);

  const handleCartUpdate = () => {
    setCartUpdated(prev => prev + 1);
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleOrderComplete = () => {
    setCurrentView('products');
    handleCartUpdate();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1> E-Commerce</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('products')}
            className={currentView === 'products' ? 'active' : ''}
          >
            Products
          </button>
          <button 
            onClick={() => setCurrentView('cart')}
            className={currentView === 'cart' ? 'active' : ''}
          >
            Cart
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'products' && (
          <ProductList onCartUpdate={handleCartUpdate} />
        )}
        {currentView === 'cart' && (
          <Cart onCheckout={handleCheckout} />
        )}
        {currentView === 'checkout' && (
          <Checkout 
            onBack={() => setCurrentView('cart')}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App;

