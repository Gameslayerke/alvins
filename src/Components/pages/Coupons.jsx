import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isBefore, isValid } from 'date-fns';
import '../styles/Coupons.css'; // Make sure this path is correct

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://alvins.pythonanywhere.com/coupons');
        console.log('Coupons data received:', response.data); // Log the received data
        setCoupons(response.data);
      } catch (err) {
        console.error('Error fetching coupons:', err);
        setError('Failed to fetch coupons. Please try again later.'); // More user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const copyToClipboard = (code) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      console.warn("Clipboard API not available in this browser.");
      alert("Copy functionality is not supported in your browser. Please copy the code manually.");
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch =
      coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // Show all coupons regardless of expiry
  });

  if (loading) {
    return (
      <div className="coupons-loading">
        <div className="spinner"></div>
        <p>Loading available coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coupons-error">
        <h2>Oops! Couldn't load coupons</h2>
        <p>{error}</p>
        <button
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="coupons-container">
      <header className="coupons-header">
        <h1><span className="discount-icon">%</span> All Discounts & Promotions</h1>
        <p className="subtitle">Here are all the currently available and past discounts</p>

        <div className="coupons-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>
      </header>

      {filteredCoupons.length === 0 ? (
        <div className="no-coupons">
          <div className="coupon-icon">🎁</div>
          <h3>No coupons found</h3>
          <p>{searchTerm ? 'Try a different search' : 'No coupons available.'}</p>
        </div>
      ) : (
        <div className="coupons-grid">
          {filteredCoupons.map((coupon) => {
            const expiryDate = coupon.expiration_date ? parseISO(coupon.expiration_date) : null;
            const isValidDate = expiryDate && isValid(expiryDate);
            const isExpired = isValidDate && isBefore(expiryDate, new Date());

            return (
              <div
                key={coupon.coupon_id}
                className={`coupon-card ${isExpired ? 'expired' : ''}`}
              >
                {isExpired && (
                  <div className="expired-banner">Expired on {isValidDate ? format(expiryDate, 'MMM d, yyyy') : 'Invalid Date'}</div>
                )}

                <div className="coupon-value">
                  <span>{coupon.discount_percentage}%</span>
                  <small>OFF</small>
                </div>

                <div className="coupon-content">
                  <div className="coupon-code-row">
                    <h4>{coupon.code}</h4>
                    <button
                      className={`copy-btn ${copiedCode === coupon.code ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(coupon.code)}
                      disabled={isExpired}
                    >
                      {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {coupon.description && (
                    <p className="coupon-description">{coupon.description}</p>
                  )}

                  <div className="coupon-details">
                    <div className="detail">
                      <span className="detail-icon">📅</span>
                      <span>
                        Expires:{' '}
                        {isValidDate
                          ? format(expiryDate, 'MMM d, yyyy')
                          : 'Invalid date'}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="detail-icon">💰</span>
                      <span>Min. order: Ksh {coupon.min_order_value || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="coupons-footer">
        <p>All available and past coupons are shown here.</p>
      </div>
    </div>
  );
};

export default CouponsPage;