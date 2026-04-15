import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from '@phosphor-icons/react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const isSaved = isInWishlist(product.id);
  
  // Format the image url correctly. It might be a stringified array
  let imageUrl = '';
  try {
    const images = JSON.parse(product.images);
    imageUrl = Array.isArray(images) ? images[0] : images;
  } catch(e) {
    imageUrl = product.images;
  }

  return (
    <div className={`${styles.card} animate-fade-in`}>
      <button 
        className={styles.heartBtn} 
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label="Toggle Wishlist"
      >
        <Heart size={24} weight={isSaved ? "fill" : "regular"} color={isSaved ? "#c45500" : "#a6a6a6"} />
      </button>
      <Link to={`/product/${product.id}`} className={styles.imageContainer}>
        <img src={imageUrl} alt={product.name} className={styles.image} />
      </Link>
      <div className={styles.info}>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {product.name}
        </Link>
        <div className={styles.rating}>
          {"⭐️".repeat(Math.round(product.rating))} 
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.currency}>₹</span>
          <span className={styles.price}>{Math.floor(product.price)}</span>
          <span className={styles.cents}>
            {(product.price % 1).toFixed(2).substring(2)}
          </span>
        </div>
        <div className={styles.shipping}>Ships to your location</div>
        <button 
          className={`btn-primary ${styles.addToCartBtn}`} 
          onClick={() => addToCart(product.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
