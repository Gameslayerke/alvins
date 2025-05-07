import React, { useState } from 'react';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days. Express delivery is available for an additional fee with 1-2 business day delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused and in their original packaging with all tags attached. Some items like perishables or personalized products may not be eligible for return."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can enter this number in the 'Track Order' section of our website or directly on the carrier's website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. We also offer installment payment options through select providers."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination. Additional customs fees may apply depending on your country's import regulations."
    },
    {
      question: "How do I contact customer service?",
      answer: "You can reach our customer service team 24/7 through live chat on our website, by email at support@yourstore.com, or by phone at +1 (800) 123-4567 during business hours (9am-5pm EST)."
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to common questions about our products and services</p>
      </div>

      <div className="faq-search">
        <input 
          type="text" 
          placeholder="Search FAQs..." 
        />
        <button>Search</button>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question" 
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>
              <span className="faq-toggle">
                {activeIndex === index ? '−' : '+'}
              </span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h2>Still have questions?</h2>
        <p>Our customer service team is ready to help you with any additional questions you may have.</p>
        <button>Contact Support</button>
      </div>
    </div>
  );
};

export default FAQPage;