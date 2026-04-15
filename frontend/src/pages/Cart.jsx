import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className={styles.loading}>Loading cart...</div>;

  const items = cart?.items || [];

  return (
    <div className={styles.container}>
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h1>Shopping Cart</h1>
          <span className={styles.priceHeader}>Price</span>
        </div>
        <hr className={styles.divider} />

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
             <h2>Your Amazon Clone Cart is empty.</h2>
             <Link to="/" className={styles.shopLink}>Continue shopping</Link>
          </div>
        ) : (
          items.map(item => {
            let imageUrl = '';
            try {
              const images = JSON.parse(item.product.images);
              imageUrl = Array.isArray(images) ? images[0] : images;
            } catch(e) {
              imageUrl = item.product.images;
            }

            return (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImageContainer}>
                  <img src={imageUrl} alt={item.product.name} className={styles.itemImage} />
                </div>
                <div className={styles.itemDetails}>
                  <Link to={`/product/${item.product.id}`} className={styles.itemTitle}>
                    {item.product.name}
                  </Link>
                  <div className={styles.itemStock}>In Stock</div>
                  <div className={styles.giftOption}>
                    <input type="checkbox" id={`gift-${item.id}`} />
                    <label htmlFor={`gift-${item.id}`}>This is a gift</label>
                  </div>
                  <div className={styles.itemActions}>
                    <select 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className={styles.quantitySelect}
                    >
                      {[...Array(Math.min(10, item.product.stock)).keys()].map(x => (
                         <option key={x+1} value={x+1}>Qty: {x+1}</option>
                      ))}
                    </select>
                    <span className={styles.actionSeparator}>|</span>
                    <button className={styles.deleteBtn} onClick={() => removeFromCart(item.id)}>
                      Delete
                    </button>
                    <span className={styles.actionSeparator}>|</span>
                    <span className={styles.saveForLater}>Save for later</span>
                  </div>
                </div>
                <div className={styles.itemPrice}>
                  ₹{item.product.price.toFixed(2)}
                </div>
              </div>
            );
          })
        )}
        {items.length > 0 && (
          <div className={styles.cartFooter}>
            <span className={styles.subtotalText}>Subtotal ({cartCount} items):</span>
            <span className={styles.subtotalPrice}>₹{cartSubtotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.checkoutSection}>
           <div className={styles.checkoutBox}>
             <div className={styles.freeShipping}>
               <span className={styles.checkIcon}>✓</span>
               <span>Your order qualifies for FREE Shipping.</span>
             </div>
             <div className={styles.checkoutSubtotal}>
                 Subtotal ({cartCount} items): <span className={styles.checkoutPrice}>₹{cartSubtotal.toFixed(2)}</span>
             </div>
             <div className={styles.giftCheckout}>
                <input type="checkbox" id="gift-order" />
                <label htmlFor="gift-order">This order contains a gift</label>
             </div>
             <button 
               className={`btn-primary ${styles.proceedBtn}`}
               onClick={() => navigate('/checkout')}
             >
               Proceed to checkout
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
