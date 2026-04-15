import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './OrderHistory.module.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className={styles.loading}>Loading orders...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
         <h1>Your Orders</h1>
         <div className={styles.searchBar}>
            <input type="text" placeholder="Search all orders" />
            <button className="btn-secondary">Search Orders</button>
         </div>
      </div>
      
      {orders.length === 0 ? (
        <div className={styles.empty}>You have no past orders.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
               <div className={styles.orderHeaderInfo}>
                 <div className={styles.infoCol}>
                   <span>ORDER PLACED</span>
                   <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className={styles.infoCol}>
                   <span>TOTAL</span>
                   <span>₹{order.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className={styles.infoCol}>
                   <span>SHIP TO</span>
                   <span className={styles.linkText} title={order.shippingAddress}>
                     {user.name} ⯆
                   </span>
                 </div>
               </div>
               <div className={styles.orderHeaderRight}>
                 <span>ORDER # {order.id.split('-')[0]}...</span>
                 <Link to={`/order-confirmation/${order.id}`} className={styles.linkText}>View order details</Link>
               </div>
            </div>
            <div className={styles.orderBody}>
              <h3 className={styles.deliveryStatus}>
                {order.status === 'PENDING' ? 'Preparing for Shipment' : order.status}
              </h3>
              <div className={styles.itemsList}>
                {order.items.map(item => {
                  let imageUrl = '';
                  try {
                    const images = JSON.parse(item.product.images);
                    imageUrl = Array.isArray(images) ? images[0] : images;
                  } catch(e) {
                    imageUrl = item.product.images;
                  }

                  return (
                    <div key={item.id} className={styles.item}>
                      <img src={imageUrl} alt={item.product.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <Link to={`/product/${item.product.id}`} className={styles.itemTitle}>{item.product.name}</Link>
                        <span className={styles.itemReturn}>Return window closed</span>
                        <div className={styles.itemActions}>
                           <button className={`btn-primary ${styles.buyAgainBtn}`}>Buy it again</button>
                           <button className={`btn-secondary ${styles.reviewBtn}`}>Write a product review</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
