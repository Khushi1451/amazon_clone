import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlass, ShoppingCart, MapPin, List, CaretDown, User } from '@phosphor-icons/react';
import styles from './Header.module.css';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    let q = `/?category=${category}`;
    if (searchTerm.trim()) {
      q += `&search=${searchTerm}`;
    }
    navigate(q);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
             <List size={28} color="#fff" />
          </div>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink}>
               <img src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="Amazon Logo" className={styles.logo} />
               
            </Link>
          </div>
          
          <div className={`${styles.navLocation} ${styles.desktopOnly}`}>
            <MapPin size={20} weight="fill" color="#fff" />
            <div className={styles.navLocationText}>
              <span className={styles.navLine1}>Deliver to {user ? user.name.split(' ')[0] : 'Guest'}</span>
              <span className={styles.navLine2}>New York 10001</span>
            </div>
          </div>
        </div>

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <select className={styles.searchSelect} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Amazon Clone" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <MagnifyingGlass size={22} weight="bold" />
          </button>
        </form>

        <div className={styles.navRight}>
          <div 
            className={`${styles.navItem} ${styles.accountDropdownTrigger}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onClick={() => {
              // Mobile behavior
              if (window.innerWidth <= 768) {
                setDropdownOpen(!dropdownOpen);
              }
            }}
          >
            <span className={styles.navLine1}>Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
            <span className={styles.navLine2}>Account & Lists <CaretDown size={12} weight="bold"/></span>
            
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {!user ? (
                  <div className={styles.dropdownGuest}>
                    <Link to="/login" className={`btn-primary ${styles.dropdownSigninBtn}`}>Sign in</Link>
                    <div className={styles.newCustomer}>New customer? <Link to="/signup">Start here.</Link></div>
                  </div>
                ) : (
                  <div className={styles.dropdownUser}>
                     <h4>Your Account</h4>
                     <Link to="/orders">Orders</Link>
                     <Link to="/wishlist">Wishlist</Link>
                     <div onClick={handleLogout} className={styles.logoutBtn}>Sign Out</div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Link to={user ? "/orders" : "/login"} className={`${styles.navItem} ${styles.desktopOnly}`}>
            <span className={styles.navLine1}>Returns</span>
            <span className={styles.navLine2}>& Orders</span>
          </Link>

          <Link to="/cart" className={styles.cartContainer}>
            <div className={styles.cartIconWrapper}>
              <ShoppingCart size={34} color="#fff" />
              <span className={styles.cartCount}>{cartCount}</span>
            </div>
            <span className={`${styles.navLine2} ${styles.cartText} ${styles.desktopOnly}`}>Cart</span>
          </Link>
        </div>
      </header>

      {/* Mobile Search Bar that appears below header when width < 768 */}
      <div className={styles.mobileSearchBarWrapper}>
         <form className={styles.mobileSearchBar} onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search Amazon Clone" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <MagnifyingGlass size={22} weight="bold" />
            </button>
         </form>
      </div>

      <nav className={`${styles.subheader} ${menuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.subheaderItem} onClick={() => setMenuOpen(!menuOpen)}>
          <List size={22} weight="bold" />
          <span>All</span>
        </div>
        <Link to="/wishlist" className={styles.subheaderItem}>Waitlist & Lists</Link>
        <Link to="/orders" className={styles.subheaderItem}>Customer Orders</Link>
        <div className={styles.subheaderItem}>Today's Deals</div>
        <div className={styles.subheaderItem}>Gift Cards</div>
        <div className={styles.subheaderItem}>Sell</div>
      </nav>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Header;
