import React from 'react';
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
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
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
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
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
              <li><a href="/policy">Privacy Policy</a></li>
              <li><a href="/policy">Terms of Service</a></li>
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
              <a href="#">Privacy Policy</a>
              <span> | </span>
              <a href="#">Terms of Use</a>
              <span> | </span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;