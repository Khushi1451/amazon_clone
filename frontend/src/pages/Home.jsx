import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') ? `?search=${queryParams.get('search')}` : '';
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products${searchQuery}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
         <div className={styles.heroGradient}></div>
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading amazing products...</div>
        ) : (
          <div className={styles.productGrid}>
            {products.length === 0 ? (
              <div className={styles.noResults}>No products found.</div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
