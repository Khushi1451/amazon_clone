import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        // Parse images
        let parsedImages = [];
        try {
          const imgs = JSON.parse(data.images);
          parsedImages = Array.isArray(imgs) ? imgs : [imgs];
        } catch(e) {
          parsedImages = [data.images];
        }
        
        setProduct({ ...data, parsedImages });
        setActiveImage(parsedImages[0]);
      } catch (err) {
        console.error('Error fetching product detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  const handleBuyNow = async () => {
    await addToCart(product.id, 1);
    navigate('/cart');
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.thumbnails}>
          {product.parsedImages.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Thumbnail ${idx}`} 
              className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumbnail : ''}`}
              onMouseEnter={() => setActiveImage(img)}
            />
          ))}
        </div>
        <div className={styles.mainImageContainer}>
          <img src={activeImage} alt={product.name} className={styles.mainImage} />
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <h1 className={styles.title}>{product.name}</h1>
        <div className={styles.rating}>
          {"⭐️".repeat(Math.round(product.rating))} 
          <span className={styles.reviewCount}>{product.reviewCount} ratings</span>
        </div>
        <hr className={styles.divider} />
        <div className={styles.priceContainer}>
           <span className={styles.priceSymbol}>₹</span>
           <span className={styles.priceWhole}>{Math.floor(product.price)}</span>
           <span className={styles.priceFraction}>{(product.price % 1).toFixed(2).substring(2)}</span>
        </div>
        <div className={styles.about}>
          <h3>About this item</h3>
          <p>{product.description}</p>
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.actionBox}>
          <div className={styles.priceDisplay}>₹{product.price.toFixed(2)}</div>
          <div className={styles.delivery}>Free Delivery</div>
          <div className={styles.stock}>
            {product.stock > 0 ? <span className={styles.inStock}>In Stock</span> : <span className={styles.outOfStock}>Out of Stock</span>}
          </div>
          
          <button 
            className={`btn-primary ${styles.actionBtn} ${styles.addBtn}`}
            onClick={() => addToCart(product.id)}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
          
          <button 
            className={`btn-secondary ${styles.actionBtn} ${styles.buyBtn}`}
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            Buy Now
          </button>
          
          <div className={styles.secureTransaction}>
            🔒 Secure transaction
          </div>
          
          <hr className={styles.divider} style={{margin: '16px 0', borderColor: '#d5d9d9'}} />
          
          <button 
            className={styles.wishlistBtn}
            onClick={() => toggleWishlist(product.id)}
          >
            {isInWishlist(product.id) ? "Remove from List" : "Add to List"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
