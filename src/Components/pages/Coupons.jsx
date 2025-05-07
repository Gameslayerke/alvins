import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Coupons.css';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://alvins.pythonanywhere.com/coupons');
        setCoupons(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isCouponExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading coupons</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="coupons-page">
      <header className="page-header">
        <h1>Special Offers & Discounts</h1>
        <p>Save more with these exclusive coupons and promotional codes</p>
      </header>

      {coupons.length === 0 ? (
        <div className="no-coupons">
          <h3>No active coupons available at the moment</h3>
          <p>Check back later for new offers!</p>
        </div>
      ) : (
        <div className="coupons-grid">
          {coupons.map((coupon) => (
            <div 
              key={coupon.id} 
              className={`coupon-card ${isCouponExpired(coupon.expiry_date) ? 'expired' : ''}`}
            >
              {isCouponExpired(coupon.expiry_date) && (
                <span className="expired-tag">Expired</span>
              )}
              
              <div className="coupon-header">
                <h3>{coupon.discount_value}{coupon.discount_type === 'percentage' ? '% OFF' : '$ OFF'}</h3>
                <div className="coupon-code">{coupon.code}</div>
                <small>Use at checkout</small>
              </div>

              <div className="coupon-body">
                <h4 className="coupon-title">{coupon.name}</h4>
                <p className="coupon-description">{coupon.description}</p>
                
                <div className="coupon-details">
                  <div className="detail-item">
                    <span className="detail-label">Valid Until:</span>
                    <span className="detail-value">{formatDate(coupon.expiry_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Min. Purchase:</span>
                    <span className="detail-value">
                      {coupon.min_purchase ? `$${coupon.min_purchase}` : 'None'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Usage Limit:</span>
                    <span className="detail-value">
                      {coupon.usage_limit || 'Unlimited'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="coupon-footer">
                <button 
                  onClick={() => copyToClipboard(coupon.code)}
                  disabled={isCouponExpired(coupon.expiry_date)}
                  className="copy-button"
                >
                  {isCouponExpired(coupon.expiry_date) ? 'Expired' : 'Copy Code'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;