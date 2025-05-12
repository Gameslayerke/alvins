import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../common/CountdownTimer";
import '../styles/Offer.css';

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://alvins.pythonanywhere.com/api/getOfferProducts",
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched offers:", data);

        if (data.offers && data.offers.length > 0) {
          const formattedOffers = data.offers.map(offer => ({
            id: offer.id,
            title: offer.title,
            current_price: offer.discounted_price || offer.original_price,
            original_price: offer.discount_percentage ? offer.original_price : null,
            items_left: offer.stock_quantity,
            image_url: offer.image_url,
            end_date: offer.end_date
          }));
          setOffers(formattedOffers);
        }
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    const interval = setInterval(fetchOffers, 300000); // every 5 mins
    return () => clearInterval(interval);
  }, []);

  const handleOfferClick = (offer) => {
    navigate(`/productoffercard/${offer.id}`, {
      state: {
        product: offer,
      },
    });
  };

  if (loading) {
    return (
      <div className="offer-loading">
        <div className="spinner"></div>
        <p>Loading exciting offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offer-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to load offers</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  // Find the earliest end date for countdown timer
  const earliestEndDate = offers.length > 0 
    ? new Date(Math.min(...offers.map(o => new Date(o.end_date))))
    : new Date(Date.now() + 3 * 60 * 60 * 1000); // Fallback 3 hours

  return (
    <div className="flash-sales-container">
      <div className="flash-sales-header">
        <h1>Flash Sales | Live Now</h1>
        {offers.length > 0 && (
          <div className="time-left">
            <span>Time Left: </span>
            <CountdownTimer
              endTime={earliestEndDate.toISOString()}
              showLabels={false}
            />
          </div>
        )}
      </div>

      {offers.length > 0 ? (
        <>
          <div className="flash-sales-grid">
            {offers.slice(0, 5).map((offer) => (
              <div key={offer.id} className="flash-sale-item" onClick={() => handleOfferClick(offer)}>
                <div className="product-image-container">
                  <img
                    src={offer.image_url || "/placeholder-product.jpg"}
                    alt={offer.title}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>
                <h3 className="flash-sale-title">
                  {offer.title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h3>
                <div className="flash-sale-prices">
                  <span className="current-price">
                    KSh {offer.current_price?.toLocaleString() || 'N/A'}
                  </span>
                  {offer.original_price && (
                    <span className="original-price">
                      KSh {offer.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="items-left">{offer.items_left} items left</div>
              </div>
            ))}
          </div>

          {offers.length > 5 && (
            <div className="flash-sales-grid single-item">
              <div
                className="flash-sale-item"
                onClick={() => handleOfferClick(offers[5])}
              >
                <div className="product-image-container">
                  <img
                    src={offers[5].image_url || "/placeholder-product.jpg"}
                    alt={offers[5].title}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                </div>
                <h3 className="flash-sale-title">
                  {offers[5].title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h3>
                <div className="flash-sale-prices">
                  <span className="current-price">
                    KSh {offers[5].current_price?.toLocaleString() || 'N/A'}
                  </span>
                  {offers[5].original_price && (
                    <span className="original-price">
                      KSh {offers[5].original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="items-left">{offers[5].items_left} items left</div>
              </div>
            </div>
          )}

          <div className="see-all">
            <button onClick={() => navigate("/all-offers")}>See All ></button>
          </div>
        </>
      ) : (
        <div className="no-offers">
          <p>No current offers available. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Offer;