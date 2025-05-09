import React, { useState } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaCcAmex,
  FaGooglePay,

} from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import '../styles/Footer.css';
import '../styles/Celebration.css'; // Import CSS for celebration effect

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionStatus({ message: 'Please enter your email address.', error: true });
      return;
    }

    try {
      const response = await fetch('https://alvins.pythonanywhere.com/subscribe', { // Replace with your actual backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus({ message: data.message, error: false });
        setEmail(''); // Clear the input field on success
        setIsCelebrating(true); // Trigger celebration
        setTimeout(() => setIsCelebrating(false), 3000); // Stop celebration after 3 seconds
      } else {
        setSubscriptionStatus({ message: data.message || 'Subscription failed.', error: true });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubscriptionStatus({ message: 'Failed to connect to the server.', error: true });
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={subscriptionStatus && !subscriptionStatus.error && subscriptionStatus.message === 'Subscription successful! Thank-you email sent.'}>
              {subscriptionStatus && !subscriptionStatus.error && subscriptionStatus.message === 'Subscription successful! Thank-you email sent.' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          {subscriptionStatus && (
            <p className={`subscription-message ${subscriptionStatus.error ? 'error' : 'success'}`}>
              {subscriptionStatus.message}
            </p>
          )}
        </div>
      </div>

      <div className="footer-top">
        <div className="footer-section about-section">
          <div className="logo-container">
            <SiShopify className="logo-icon" />
            <h4>QuickCart</h4>
          </div>
          <p className="company-description">
            Your one-stop shop for all your needs. We provide quality products,
            fast delivery, and excellent customer service to ensure your complete satisfaction.
          </p>

          <div className="social-icons">
            <a href="/help" aria-label="Facebook"><FaFacebook /></a>
            <a href="/help" aria-label="Twitter"><FaTwitter /></a>
            <a href="/help" aria-label="Instagram"><FaInstagram /></a>
            <a href="/help" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-links-container">
          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li><a href="/home">All Products</a></li>
              <li><a href="/deals">Featured Items</a></li>
              <li><a href="/deals">New Arrivals</a></li>
              <li><a href="/home">Sale Items</a></li>
              <li><a href="/coupons">Gift Cards</a></li>
              <li><a href="/deals">Weekly Deals</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/help">Contact Us</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/policy">Shipping Policy</a></li>
              <li><a href="/help">Returns & Refunds</a></li>
              <li><a href="/help">Track Order</a></li>
              <li><a href="/help">Size Guide</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="/help">About Us</a></li>
              <li><a href="/help">Blog</a></li>
              <li><a href="/policy">Careers</a></li>
              <li><a href="/terms">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/help">Sustainability</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="payment-methods">
            <span>We accept:</span>
            <div className="payment-icons">
              <FaCcVisa className="payment-icon" title="Visa" />
              <FaCcMastercard className="payment-icon" title="Mastercard" />
              <FaCcPaypal className="payment-icon" title="PayPal" />
              <FaCcApplePay className="payment-icon" title="Apple Pay" />
              <FaCcAmex className="payment-icon" title="American Express" />
              <FaGooglePay className="payment-icon" title="Google Pay" />
            </div>
          </div>
          <div className="copyright">
            <p>&copy; {currentYear} QuickCart. All rights reserved.</p>
            <div className="legal-links">
              <a href="/terms">Privacy Policy</a>
              <span> | </span>
              <a href="/terms">Terms of Use</a>
              <span> | </span>
              <a href="/terms">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {isCelebrating && (
        <div className="celebration">
          <div className="flower petal-1"></div>
          <div className="flower petal-2"></div>
          <div className="flower petal-3"></div>
          <div className="flower petal-4"></div>
          <div className="flower petal-5"></div>
          <div className="flower petal-6"></div>
          <div className="flower petal-7"></div>
          <div className="flower petal-8"></div>

          <div className="flower flower-2">
            <div className="petal petal-1"></div>
            <div className="petal petal-2"></div>
            <div className="petal petal-3"></div>
            <div className="petal petal-4"></div>
            <div className="petal petal-5"></div>
            <div className="petal petal-6"></div>
            <div className="petal petal-7"></div>
            <div className="petal petal-8"></div>
          </div>

          <div className="flower flower-3">
            <div className="petal petal-1"></div>
            <div className="petal petal-2"></div>
            <div className="petal petal-3"></div>
            <div className="petal petal-4"></div>
            <div className="petal petal-5"></div>
            <div className="petal petal-6"></div>
            <div className="petal petal-7"></div>
            <div className="petal petal-8"></div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;