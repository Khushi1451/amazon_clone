import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      fetchWishlist();
    } catch (err) {
      console.error('Failed to add to wishlist', err);
    }
  };

  const removeFromWishlistByProductId = async (productId) => {
    const item = wishlistItems.find(i => i.productId === productId);
    if (!item) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/wishlist/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(i => i.productId === productId);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlistByProductId(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, fetchWishlist, addToWishlist, removeFromWishlistByProductId, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
