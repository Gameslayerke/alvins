import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import {
  FaShoppingCart,
  FaHeart,
  FaBell,
  FaUser,
  FaSearch,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaHome,
  FaShoppingBag,
  FaTag,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaStar
} from 'react-icons/fa';
import '../styles/Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [activeCart] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoverStates, setHoverStates] = useState({
    shop: false,
    account: false,
    notifications: false,
    wishlist: false,
    orders: false,
    cart: false
  });


  const [unreadCount] = useState(0);
  const [wishlist] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://alvins.pythonanywhere.com/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    document.body.style.overflow = isMobileMenuOpen ? 'auto' : 'hidden';
  };

  const toggleHoverState = (key, value) => {
    setHoverStates(prev => ({ ...prev, [key]: value }));
  };

  const renderNotificationsPreview = () => (
    <div className="nav-preview">No new notifications.</div>
  );

  const renderWishlistPreview = () => (
    <div className="nav-preview">Your wishlist is empty.</div>
  );

  const renderCartPreview = () => (
    <div className="nav-preview">Your cart is empty.</div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="desktop-navbar">
        <div className="navbar-container">
          <div className="logo">
            <Link to="/">QuickCart</Link>
          </div>

          <div className="menu">
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li
                className="dropdown"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <span>Shop <FaChevronDown className={`icon-sm ${showCategories ? 'rotate' : ''}`} /></span>
                {showCategories && categories.length > 0 && (
                  <ul className="dropdown-menu active">
                    {categories.map(category => (
                      <li key={category.category_id}>
                        <Link to={`/category/${category.category_id}`}>
                          {category.category_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/Help">Help</Link></li>
            </ul>

            <form className="search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"><FaSearch /></button>
            </form>

            <div className="nav-icons">
              {isAuthenticated ? (
                <>
                  <div className="nav-icon-dropdown"
                       onMouseEnter={() => toggleHoverState('notifications', true)}
                       onMouseLeave={() => toggleHoverState('notifications', false)}>
                    <div className="nav-icon-wrapper">
                      <FaBell />
                      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </div>
                    {hoverStates.notifications && renderNotificationsPreview()}
                  </div>

                  <div className="nav-icon-dropdown"
                       onMouseEnter={() => toggleHoverState('wishlist', true)}
                       onMouseLeave={() => toggleHoverState('wishlist', false)}>
                    <div className="nav-icon-wrapper">
                      <FaHeart />
                      {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </div>
                    {hoverStates.wishlist && renderWishlistPreview()}
                  </div>

                  <div className="nav-icon-dropdown"
                       onMouseEnter={() => toggleHoverState('cart', true)}
                       onMouseLeave={() => toggleHoverState('cart', false)}>
                    <div className="nav-icon-wrapper">
                      <FaShoppingCart />
                      <span className="badge">{activeCart?.item_count || 0}</span>
                    </div>
                    {hoverStates.cart && renderCartPreview()}
                  </div>

                  <div className="account-dropdown"
                       onMouseEnter={() => toggleHoverState('account', true)}
                       onMouseLeave={() => toggleHoverState('account', false)}>
                    <div className="user-greeting">
                      <div className="user-avatar"><FaUser /></div>
                      <FaChevronDown className={`dropdown-arrow ${hoverStates.account ? 'rotate' : ''}`} />
                    </div>
                    {hoverStates.account && (
                      <div className="account-menu">
                        <div className="user-info-mobile">
                          <span className="username">Hi, {user?.username || 'User'}</span>
                          <span className="user-role">{user?.role}</span>
                        </div>
                        <Link to="/account" className="account-menu-item"><FaUser className="menu-icon" /> My Profile</Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="account-menu-item"><FaCog className="menu-icon" /> Admin Dashboard</Link>
                        )}
                        <Link to="/orders" className="account-menu-item"><FaHistory className="menu-icon" /> Order History</Link>
                        <Link to="/wishlist" className="account-menu-item"><FaStar className="menu-icon" /> My Wishlist</Link>
                        <Link to="/settings" className="account-menu-item"><FaCog className="menu-icon" /> Settings</Link>
                        <button onClick={handleLogout} className="account-menu-item logout"><FaSignOutAlt className="menu-icon" /> Logout</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="auth-link"><FaUser className="icon-sm" /> Login</Link>
                  <Link to="/register" className="auth-link">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="mobile-navbar">
        <div className="mobile-navbar-container">
          <div className="mobile-logo">
            <Link to="/">QuickCart</Link>
          </div>

          <div className="mobile-icons">
            <button className="mobile-search-icon" onClick={() => setIsMobileMenuOpen(false)}>
              <FaSearch />
            </button>
            {isAuthenticated && (
              <div className="mobile-cart-icon">
                <Link to="/cart">
                  <FaShoppingCart />
                  {activeCart?.item_count > 0 && (
                    <span className="mobile-badge">{activeCart.item_count}</span>
                  )}
                </Link>
              </div>
            )}
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>

          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={toggleMobileMenu}><FaHome /> Home</Link></li>
            <li className="mobile-dropdown">
              <div className="mobile-dropdown-header">
                <span><FaShoppingBag /> Shop</span>
                <FaChevronDown />
              </div>
              <ul className="mobile-dropdown-menu">
                {categories.map(category => (
                  <li key={category.category_id}>
                    <Link to={`/category/${category.category_id}`} onClick={toggleMobileMenu}>
                      {category.category_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link to="/deals" onClick={toggleMobileMenu}><FaTag /> Deals</Link></li>
            <li><Link to="/track-order" onClick={toggleMobileMenu}><FaMapMarkerAlt /> Help</Link></li>

            {isAuthenticated ? (
              <>
                <li><Link to="/notifications" onClick={toggleMobileMenu}><FaBell /> Notifications {unreadCount > 0 && `(${unreadCount})`}</Link></li>
                <li><Link to="/wishlist" onClick={toggleMobileMenu}><FaHeart /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</Link></li>
                <li><Link to="/orders" onClick={toggleMobileMenu}><FaHistory /> Orders</Link></li>
                <li><Link to="/account" onClick={toggleMobileMenu}><FaUser /> My Account</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin" onClick={toggleMobileMenu}><FaCog /> Admin</Link></li>
                )}
                <li>
                  <button onClick={handleLogout} className="mobile-logout">
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMobileMenu}><FaUser /> Login</Link></li>
                <li><Link to="/register" onClick={toggleMobileMenu}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
