import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading order details...</div>;

  if (!order) {
    return (
      <div className={styles.container}>
         <div className={styles.errorBox}>
           <h2>Order not found</h2>
           <Link to="/" className={styles.link}>Return to Home</Link>
         </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
       <div className={styles.successBox}>
          <div className={styles.checkCircle}>✓</div>
          <h1 className={styles.title}>Order placed, thank you!</h1>
          <p className={styles.subtitle}>Confirmation will be sent to your email.</p>
          
          <div className={styles.orderDetails}>
            <div className={styles.orderNumber}>
               <strong>Order Number:</strong> {order.id}
            </div>
            <div className={styles.orderTotal}>
               <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
            </div>
            <div className={styles.deliveryText}>
               <strong>Shipping to:</strong><br/>
               {order.shippingAddress}
            </div>
            <div className={styles.deliveryEstimate}>
               <strong>Estimated Delivery:</strong><br/>
               {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()} - {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString()}
            </div>
          </div>

          <Link to="/" className={`btn-primary ${styles.homeBtn}`}>Continue Shopping</Link>
       </div>
    </div>
  );
};

export default OrderConfirmation;
