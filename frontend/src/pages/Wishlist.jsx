import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data || { items: [] });
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const removeFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const handleMoveToCart = async (item) => {
    await addToCart(item.product.id, 1);
    await removeFromWishlist(item.id);
  };

  if (loading) return <div className={styles.loading}>Loading your list...</div>;

  const items = wishlist.items || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Lists</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
           <div className={styles.activeList}>Shopping List</div>
           <div className={styles.newList}>+ Create a List</div>
        </div>

        <div className={styles.mainArea}>
           <div className={styles.listHeader}>
              <h2>Shopping List</h2>
              <span className={styles.privacy}>Private</span>
           </div>
           
           <hr className={styles.divider} />

           {items.length === 0 ? (
             <div className={styles.empty}>
                Your Shopping List is empty.
             </div>
           ) : (
             <div className={styles.itemsList}>
               {items.map(item => {
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
                       <div className={styles.rating}>
                          {"⭐️".repeat(Math.round(item.product.rating))}
                          <span className={styles.reviewCount}>({item.product.reviewCount})</span>
                       </div>
                       <div className={styles.price}>₹{item.product.price.toFixed(2)}</div>
                       <div className={styles.actions}>
                         <button className={`btn-secondary ${styles.addToCartBtn}`} onClick={() => handleMoveToCart(item)}>
                           Add to Cart
                         </button>
                         <button className={styles.removeBtn} onClick={() => removeFromWishlist(item.id)}>Remove</button>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
