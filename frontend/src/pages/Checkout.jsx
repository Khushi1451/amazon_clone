import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cart, cartSubtotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Go to Homepage</button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a shipping address');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shippingAddress: address, totalAmount: cartSubtotal })
      });
      if (res.ok) {
        const order = await res.json();
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        setError('Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.checkoutSection}>
        <h1 className={styles.title}>Checkout ({cartCount} items)</h1>
        <hr className={styles.divider} />

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handlePlaceOrder} className={styles.form}>
           <div className={styles.step}>
             <div className={styles.stepNumber}>1</div>
             <div className={styles.stepContent}>
                <h3>Shipping address</h3>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full shipping address..."
                  className={styles.textarea}
                  rows="3"
                ></textarea>
             </div>
           </div>
           <hr className={styles.divider} />

           <div className={styles.step}>
             <div className={styles.stepNumber}>2</div>
             <div className={styles.stepContent}>
                <h3>Payment method</h3>
                <div className={styles.paymentBox}>
                   Default Payment Method Used (Demo)
                </div>
             </div>
           </div>
           <hr className={styles.divider} />

           <div className={styles.step}>
             <div className={styles.stepNumber}>3</div>
             <div className={styles.stepContent}>
                <h3>Review items and shipping</h3>
                <div className={styles.reviewItems}>
                  {items.map(item => {
                    let imageUrl = '';
                    try {
                      const images = JSON.parse(item.product.images);
                      imageUrl = Array.isArray(images) ? images[0] : images;
                    } catch(e) {
                      imageUrl = item.product.images;
                    }

                    return (
                      <div key={item.id} className={styles.reviewItem}>
                        <img src={imageUrl} alt={item.product.name} className={styles.reviewImage} />
                        <div className={styles.reviewDetails}>
                            <div className={styles.reviewName}>{item.product.name}</div>
                            <div className={styles.reviewPrice}>₹{item.product.price.toFixed(2)}</div>
                            <div className={styles.reviewQty}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
           </div>
           
           <div className={styles.formActions}>
             <button type="submit" className={`btn-primary ${styles.placeOrderBtn}`} disabled={loading}>
               {loading ? 'Placing Order...' : 'Place your order'}
             </button>
             <div className={styles.orderTotal}>
               Order total: ₹{cartSubtotal.toFixed(2)}
             </div>
           </div>
        </form>
      </div>
      
      <div className={styles.summarySection}>
        <button 
          className={`btn-primary ${styles.summaryPlaceBtn}`}
          onClick={handlePlaceOrder}
          disabled={loading}
        >
           {loading ? 'Placing...' : 'Place your order'}
        </button>
        <p className={styles.terms}>By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.</p>
        <hr className={styles.divider} />
        <h3>Order Summary</h3>
        <div className={styles.summaryRow}>
          <span>Items:</span>
          <span>₹{cartSubtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping & handling:</span>
          <span>₹0.00</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total before tax:</span>
          <span>₹{cartSubtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Estimated tax to be collected:</span>
          <span>₹0.00</span>
        </div>
        <hr className={styles.divider} />
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Order total:</span>
          <span>₹{cartSubtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
