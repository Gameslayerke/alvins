import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Settings.css';
import {
  faUser, faMapMarkerAlt, faCreditCard, faShoppingBag,
  faBell, faShieldAlt, faHeart, faGlobe, faLock, faAward,
  faBars, faTimes, faCheck, faEdit, faTrash, faShare
} from '@fortawesome/free-solid-svg-icons';

const UserSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'First Name',
    lastName: ' Last Name',
    email: 'Youremail@example.com',
    phone: '254XXXX-XXXX',
    profilePicture: '/public/images/1.webp'
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Home Address',
      name: 'name',
      street1: '123 Main Street',
      street2: 'Apartment 4B',
      city: 'Your City',
      state: 'Ky',
      zip: '10001',
      country: 'Your Country',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      title: 'Work Address',
      name: 'John Doe',
      street1: '456 Business Avenue',
      street2: 'Floor 10, Suite 1002',
      city: 'New York',
      state: 'NY',
      zip: '10005',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'MasterCard',
      last4: '5555',
      expiry: '06/24',
      isDefault: false
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-12345',
      date: '2023-05-15',
      items: 3,
      total: 149.99,
      status: 'Delivered'
    },
    {
      id: 'ORD-12344',
      date: '2023-05-10',
      items: 1,
      total: 59.99,
      status: 'Shipped'
    }
  ]);

  const [notificationPrefs, setNotificationPrefs] = useState({
    marketing: true,
    orderUpdates: true,
    promotions: false,
    frequency: 'only-important'
  });

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'iPhone 13',
      browser: 'Safari',
      location: 'New York, NY',
      ip: '192.168.1.1',
      lastActive: '2023-05-20T14:30:00',
      isCurrent: true
    },
    {
      id: 2,
      device: 'MacBook Pro',
      browser: 'Chrome',
      location: 'New York, NY',
      ip: '192.168.1.2',
      lastActive: '2023-05-19T09:15:00',
      isCurrent: false
    }
  ]);

  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129.99,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/80'
    }
  ]);

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD'
  });

  const [loyalty, setLoyalty] = useState({
    points: 650,
    tier: 'Silver',
    nextTier: 'Gold',
    pointsNeeded: 350
  });

  const toggleSection = (section) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  };

  const handleProfileEdit = () => {
    setEditMode(true);
  };

  const handleProfileCancel = () => {
    setEditMode(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Here you would typically send the updated data to your backend
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const deletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const toggleNotificationPref = (pref) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [pref]: !notificationPrefs[pref]
    });
  };

  const logoutSession = (id) => {
    setActiveSessions(activeSessions.filter(session => session.id !== id));
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="user-settings-container">
      <div className="settings-header">
        <button 
          className="mobile-nav-toggle" 
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <FontAwesomeIcon icon={mobileNavOpen ? faTimes : faBars} />
        </button>
        <h1>Account Settings</h1>
      </div>

      {mobileNavOpen && (
        <div 
          className="settings-overlay" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="settings-container">
        <div className={`settings-sidebar ${mobileNavOpen ? 'active' : ''}`}>
          <nav className="settings-nav">
            <div 
              className={`settings-nav-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => toggleSection('account')}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Account Information</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'address' ? 'active' : ''}`}
              onClick={() => toggleSection('address')}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Address Book</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'payment' ? 'active' : ''}`}
              onClick={() => toggleSection('payment')}
            >
              <FontAwesomeIcon icon={faCreditCard} />
              <span>Payment Methods</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => toggleSection('orders')}
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>Order History</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => toggleSection('notifications')}
            >
              <FontAwesomeIcon icon={faBell} />
              <span>Notifications</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => toggleSection('security')}
            >
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>Security</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => toggleSection('wishlist')}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span>Wish List</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => toggleSection('preferences')}
            >
              <FontAwesomeIcon icon={faGlobe} />
              <span>Preferences</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => toggleSection('privacy')}
            >
              <FontAwesomeIcon icon={faLock} />
              <span>Privacy & Data</span>
            </div>
            <div 
              className={`settings-nav-item ${activeSection === 'loyalty' ? 'active' : ''}`}
              onClick={() => toggleSection('loyalty')}
            >
              <FontAwesomeIcon icon={faAward} />
              <span>Loyalty Rewards</span>
            </div>
          </nav>
        </div>

        <div className="settings-content">
          {/* Account Information Section */}
          {activeSection === 'account' && (
            <>
              <div className="settings-card">
                <div className="settings-card-header">
                  <h2>Profile Information</h2>
                  {!editMode ? (
                    <button onClick={handleProfileEdit}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  ) : null}
                </div>
                <div className="profile-picture-container">
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="profile-picture" 
                  />
                  <div>
                    <button className="btn btn-outline btn-sm">
                      Change Photo
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Remove
                    </button>
                  </div>
                </div>
                <form onSubmit={handleProfileSave}>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-control"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  {editMode && (
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-outline" 
                        onClick={handleProfileCancel}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>

              <div className="settings-card">
                <div className="settings-card-header">
                  <h2>Change Password</h2>
                </div>
                <form>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Address Book Section */}
          {activeSection === 'address' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Saved Addresses</h2>
                <button className="btn btn-primary btn-sm">
                  Add New Address
                </button>
              </div>
              
              {addresses.map(address => (
                <div key={address.id} className="address-card">
                  {address.isDefault && (
                    <span className="default-badge">
                      <FontAwesomeIcon icon={faCheck} /> Default
                    </span>
                  )}
                  <h4>{address.title}</h4>
                  <p>{address.name}</p>
                  <p>{address.street1}</p>
                  {address.street2 && <p>{address.street2}</p>}
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                  <p>Phone: {address.phone}</p>
                  <div className="address-actions">
                    <button className="btn btn-outline btn-sm">
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    {!address.isDefault && (
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => deleteAddress(address.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Methods Section */}
          {activeSection === 'payment' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Payment Methods</h2>
                <button className="btn btn-primary btn-sm">
                  Add Payment Method
                </button>
              </div>
              
              {paymentMethods.map(payment => (
                <div key={payment.id} className="payment-card">
                  {payment.isDefault && (
                    <span className="default-badge">
                      <FontAwesomeIcon icon={faCheck} /> Default
                    </span>
                  )}
                  <h4>{payment.type} ending in {payment.last4}</h4>
                  <p>Expires {payment.expiry}</p>
                  <div className="payment-actions">
                    <button className="btn btn-outline btn-sm">
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    {!payment.isDefault && (
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setDefaultPayment(payment.id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => deletePaymentMethod(payment.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order History Section */}
          {activeSection === 'orders' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Order History</h2>
              </div>
              
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <div>
                    <h4>Order #{order.id}</h4>
                    <p>{order.date} • {order.items} item{order.items !== 1 ? 's' : ''}</p>
                    <p className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-right">${order.total.toFixed(2)}</p>
                    <button className="btn btn-outline btn-sm">
                      View Details
                    </button>
                    <button className="btn btn-primary btn-sm">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Email & Notification Preferences</h2>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Marketing Emails</h4>
                  <p>Receive newsletters and promotional offers</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationPrefs.marketing}
                    onChange={() => toggleNotificationPref('marketing')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Order Updates</h4>
                  <p>Get notifications about your order status</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationPrefs.orderUpdates}
                    onChange={() => toggleNotificationPref('orderUpdates')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Promotional Notifications</h4>
                  <p>Special offers and discounts</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationPrefs.promotions}
                    onChange={() => toggleNotificationPref('promotions')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="notificationFrequency">Notification Frequency</label>
                <select
                  id="notificationFrequency"
                  className="select-control"
                  value={notificationPrefs.frequency}
                  onChange={(e) => setNotificationPrefs({
                    ...notificationPrefs,
                    frequency: e.target.value
                  })}
                >
                  <option value="only-important">Only important updates</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Security Settings</h2>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn btn-primary">
                  Enable 2FA
                </button>
              </div>
              
              <h3 style={{margin: '20px 0 10px'}}>Active Sessions</h3>
              <p>These are devices that are currently or have recently logged into your account.</p>
              
              {activeSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <h4>
                      {session.device} • {session.browser}
                      {session.isCurrent && (
                        <span className="session-active"> (Current)</span>
                      )}
                    </h4>
                    <p>{session.location} • {session.ip}</p>
                    <p>Last active: {new Date(session.lastActive).toLocaleString()}</p>
                  </div>
                  {!session.isCurrent && (
                    <button 
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => logoutSession(session.id)}
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Wish List Section */}
          {activeSection === 'wishlist' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Wish List & Saved Items</h2>
              </div>
              
              {wishlist.map(item => (
                <div key={item.id} className="wishlist-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="wishlist-img" 
                  />
                  <div className="wishlist-details">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="wishlist-actions">
                    <button className="btn btn-primary btn-sm">
                      Add to Cart
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Language & Currency Preferences</h2>
              </div>
              
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  className="select-control"
                  value={preferences.language}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    language: e.target.value
                  })}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  className="select-control"
                  value={preferences.currency}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    currency: e.target.value
                  })}
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Data Section */}
          {activeSection === 'privacy' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Privacy & Data Management</h2>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Data Sharing with Third Parties</h4>
                  <p>Allow us to share your data with trusted partners for personalized offers</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="form-group">
                <label>Download Your Data</label>
                <p>You can request a copy of all personal data we have about you.</p>
                <button className="btn btn-outline">
                  Request Data Download
                </button>
              </div>
              
              <div className="form-group">
                <label>Delete Your Account</label>
                <p>Permanently delete your account and all associated data.</p>
                <button className="btn btn-outline btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Loyalty Rewards Section */}
          {activeSection === 'loyalty' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2>Loyalty Rewards</h2>
              </div>
              
              <div>
                <h4>{loyalty.tier} Member</h4>
                <p>You have {loyalty.points} points</p>
                
                <div className="loyalty-progress">
                  <div 
                    className="loyalty-progress-bar"
                    style={{width: `${(loyalty.points / (loyalty.points + loyalty.pointsNeeded)) * 100}%`}}
                  >
                    {loyalty.points}/{loyalty.points + loyalty.pointsNeeded}
                  </div>
                </div>
                
                <p>{loyalty.pointsNeeded} more points to reach {loyalty.nextTier} status</p>
              </div>
              
              <div className="notification-item" style={{marginTop: '20px'}}>
                <div>
                  <h4>Auto-Redeem Points</h4>
                  <p>Automatically use points for discounts when available</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;