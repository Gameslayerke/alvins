import React, { useState } from 'react';
import { FaSearch, FaPhone, FaEnvelope, FaCommentDots, FaChevronDown } from 'react-icons/fa';
import '../styles/HelpPage.css';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle search here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const helpCategories = [
    {
      title: "Order Assistance",
      items: [
        { title: "Track your order", link: "#" },
        { title: "Cancel or change order", link: "#" },
        { title: "Returns & refunds", link: "#", popular: true },
        { title: "Damaged or defective items", link: "#" },
        { title: "Order not received", link: "#" }
      ]
    },
    {
      title: "Payment Issues",
      items: [
        { title: "Payment methods", link: "#" },
        { title: "Failed payments", link: "#", popular: true },
        { title: "Refund status", link: "#" },
        { title: "Payment security", link: "#" }
      ]
    },
    {
      title: "Account Help",
      items: [
        { title: "Reset password", link: "/forgotpassword" },
        { title: "Update account details", link: "/account" },
        { title: "Delete account", link: "#" },
        { title: "Two-factor authentication", link: "#", popular: true }
      ]
    },
    {
      title: "Shipping Information",
      items: [
        { title: "Shipping options", link: "#" },
        { title: "Delivery times", link: "#" },
        { title: "International shipping", link: "#" },
        { title: "Track package", link: "#", popular: true }
      ]
    }
  ];

  const popularArticles = helpCategories
    .flatMap(category => 
      category.items.filter(item => item.popular)
    )
    .slice(0, 4);

  return (
    <div className="help-container">
      <header className="help-header">
        <div className="header-content">
          <h1>How can we help you?</h1>
          <p>Find answers to common questions or contact our support team</p>
          
          <form className="help-search" onSubmit={handleSubmit}>
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Describe your issue..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">Search</button>
            </div>
            {isSubmitted && (
              <div className="search-feedback">
                Showing results for: <strong>{searchQuery || "all topics"}</strong>
              </div>
            )}
          </form>
        </div>
      </header>

      <main className="help-main">
        {popularArticles.length > 0 && (
          <section className="popular-articles">
            <h2>Popular Help Topics</h2>
            <div className="popular-grid">
              {popularArticles.map((article, index) => (
                <a href={article.link} key={index} className="popular-card">
                  <div className="popular-badge">Most read</div>
                  <h3>{article.title}</h3>
                  <p>Find solutions to common issues</p>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="help-sections">
          <h2>Browse Help Categories</h2>
          <div className="accordion-container">
            {helpCategories.map((category, index) => (
              <div className="accordion-item" key={index}>
                <div 
                  className="accordion-header" 
                  onClick={() => toggleAccordion(index)}
                >
                  <h3>{category.title}</h3>
                  <FaChevronDown className={`accordion-icon ${activeAccordion === index ? 'active' : ''}`} />
                </div>
                <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a href={item.link}>
                          {item.title}
                          {item.popular && <span className="popular-tag">Popular</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-header">
            <h2>Still need help?</h2>
            <p>Our customer support team is ready to assist you</p>
          </div>
          <div className="contact-methods">
            <div className="contact-card">
              <div className="contact-icon live-chat">
                <FaCommentDots />
              </div>
              <h3>Live Chat</h3>
              <p>Get instant help from our support agents</p>
              <p className="availability">Available 24/7</p>
              <button className="contact-button">
                Start Chat Now
              </button>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon email">
                <FaEnvelope />
              </div>
              <h3>Email Us</h3>
              <p>Send us a message and we'll respond promptly</p>
              <p className="availability">Response within 24 hours</p>
              <button className="contact-button">
                Send Email
              </button>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon phone">
                <FaPhone />
              </div>
              <h3>Call Support</h3>
              <p>Speak directly with a support representative</p>
              <p className="availability">
                <strong>+254 110 447 217</strong><br />
                Mon-Fri, 9am-5pm EAT
              </p>
              <button className="contact-button">
                Call Now
              </button>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I track my order?</h3>
              <p>Once your order ships, you'll receive a tracking number via email. You can enter this number in our Track Order page to see real-time updates.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept M-Pesa, Visa, Mastercard, PayPal, and bank transfers. All payments are securely processed.</p>
            </div>
            <div className="faq-item">
              <h3>Can I change my delivery address?</h3>
              <p>You can change your address within 1 hour of placing your order. After that, please contact our support team immediately.</p>
            </div>
            <div className="faq-item">
              <h3>How do returns work?</h3>
              <p>You have 14 days to initiate a return for most items. Visit our Returns Center to start the process and get return instructions.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HelpPage;