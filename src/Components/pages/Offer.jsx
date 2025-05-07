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

        if (!data.offers || data.offers.length === 0) {
          const mockOffers = [
            {
              id: 1,
              title: "Gaming Laptop",
              current_price: 54270.0,
              original_price: 67000.0,
              items_left: 15,
              image_url: "/gaming-laptop.jpg",
            },
            {
              id: 2,
              title: "EMO Desktop",
              current_price: 93500.0,
              original_price: null,
              items_left: 20,
              image_url: "/emo-desktop.jpg",
            },
            {
              id: 3,
              title: "qwerty",
              current_price: 9500.0,
              original_price: null,
              items_left: 10,
              image_url: "/qwerty.jpg",
            },
            {
              id: 4,
              title: "Wi-Fi Pineapple",
              current_price: 84550.0,
              original_price: 89000.0,
              items_left: 5,
              image_url: "/wifi-pineapple.jpg",
            },
            {
              id: 5,
              title: "LG Ex-boom",
              current_price: 61600.0,
              original_price: 88000.0,
              items_left: 8,
              image_url: "/lg-exboom.jpg",
            },
            {
              id: 6,
              title: "Hisense-100\"\nHSense-100\"",
              current_price: 200100.0,
              original_price: 230000.0,
              items_left: 3,
              image_url: "/hisense-tv.jpg",
            },
          ];
          setOffers(mockOffers);
        } else {
          const offersWithStock = data.offers.map((offer) => ({
            ...offer,
            current_price: offer.current_price || 0,
            original_price: offer.original_price || null,
            items_left: Math.floor(Math.random() * 20) + 1,
          }));
          setOffers(offersWithStock);
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

  return (
    <div className="flash-sales-container">
      <div className="flash-sales-header">
        <h1>Flash Sales | Live Now</h1>
        <div className="time-left">
          <span>Time Left: </span>
          <CountdownTimer
            endTime={new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()} // 3 hours from now
            showLabels={false}
          />
        </div>
      </div>

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
                KSh {offer.current_price.toLocaleString()}
              </span>
              {offer.original_price !== null && (
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
                KSh {offers[5].current_price.toLocaleString()}
              </span>
              {offers[5].original_price !== null && (
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
    </div>
  );
};

export default Offer;
