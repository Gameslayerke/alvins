import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Carousel.css';

const Carousel = () => {
  const [carousels, setCarousels] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carouselRes, productRes] = await Promise.all([
          axios.get('https://alvins.pythonanywhere.com/carousels'),
          axios.get('https://alvins.pythonanywhere.com/api/getproducts'),
        ]);

        // Process main carousel
        const processedCarousels = carouselRes.data.data.map(item => ({
          ...item,
          image_url: item.image_url.startsWith('http')
            ? item.image_url
            : `https://alvins.pythonanywhere.com${item.image_url}`
        }));
        setCarousels(processedCarousels);

        setProducts(productRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(carousels.length, 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [carousels]);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex(prev => prev === 0 ? carousels.length - 1 : prev - 1);
  const goToNext = () => setCurrentIndex(prev => (prev + 1) % carousels.length);

  const getSafeIndex = (list) => {
    return list.length > 0 ? currentIndex % list.length : 0;
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="carousel-flex-wrapper">
      {/* Left Box - Products */}
      <div className="side-box left-box">
        {products.length > 0 && (
          <img
            src={`https://alvins.pythonanywhere.com/static/images/${products[getSafeIndex(products)].image}`}
            alt="Product"
            className="side-image"
            onError={(e) => {
              e.target.src = '1.gif';
              e.target.alt = 'Fallback content';
            }}
          />
        )}
      </div>

      {/* Main Carousel */}
      <div className="carousel-container">
        <div className="carousel">
          <button className="carousel-button prev" onClick={goToPrev}>&lt;</button>

          <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {carousels.map((carousel, index) => (
              <div
                key={carousel.id}
                className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              >
                <img
                  src={carousel.image_url}
                  alt={carousel.alt_text}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                    e.target.alt = 'Fallback content';
                  }}
                />
                <div className="slide-content centered">
                  <button className="shop-now-btn" onClick={() => window.location.href = '/shop'}>
                    SHOP NOW
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-button next" onClick={goToNext}>&gt;</button>
        </div>

        <div className="carousel-dots">
          {carousels.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

