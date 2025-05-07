import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "../styles/ProductCard.css";
import PropTypes from "prop-types";

// Constants for better maintainability
const API_BASE_URL = "https://alvins.pythonanywhere.com";
const DEFAULT_PRODUCT_IMAGE = "https://alvins.pythonanywhere.com/static/images/placeholder.jpg";
const PHONE_REGEX = /^254\d{9}$/;
const STOCK_RANGE = { min: 10, max: 50 };
const COLORS = ["Red", "Blue", "Green", "Black"];
const SIZES = ["S", "M", "L", "XL"];

const ProductCard = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Product state
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);

  // Product options
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);

  // Payment state
  const [phone, setPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Generate random stock (memoized to prevent re-renders)
  const stock = React.useMemo(() => (
    Math.floor(Math.random() * (STOCK_RANGE.max - STOCK_RANGE.min + 1)) + STOCK_RANGE.min
  ), []);

  // Fetch product with error handling and cancellation
  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    const source = axios.CancelToken.source();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getproduct/${productId}`,
        { cancelToken: source.token }
      );
      setProduct(response.data);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.message || "Failed to load product details");
        console.error("Product fetch error:", err);
      }
    } finally {
      if (!source.token.reason) {
        setLoading(false);
      }
    }

    return () => source.cancel("Component unmounted, request canceled");
  }, [productId]);

  // Fetch reviews with error handling
  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    const source = axios.CancelToken.source();
    setLoadingReviews(true);
    setErrorReviews(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/reviews/${productId}`,
        { cancelToken: source.token }
      );
      setReviews(response.data || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setErrorReviews(err.response?.data?.message || "Failed to load reviews");
        console.error("Review fetch error:", err);
      }
    } finally {
      if (!source.token.reason) {
        setLoadingReviews(false);
      }
    }

    return () => source.cancel("Component unmounted, request canceled");
  }, [productId]);

  // Fetch data on mount or when productId changes
  useEffect(() => {
    if (!product && productId) {
      fetchProduct();
    }
  }, [product, productId, fetchProduct]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  // Review submission handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!review.trim() || rating === 0) {
      setErrorReviews("Please provide both a review and a rating");
      return;
    }

    const newReview = {
      id: Date.now(), // Better unique ID generation
      user: currentUser?.username || "Anonymous",
      rating,
      comment: review,
      date: new Date().toLocaleDateString(),
    };

    try {
      // In a real app, you would POST to your API here
      setReviews(prev => [newReview, ...prev]);
      setShowReviewForm(false);
      setReview("");
      setRating(0);
      setErrorReviews(null);
    } catch (err) {
      setErrorReviews("Failed to submit review. Please try again.");
      console.error("Review submission error:", err);
    }
  };

  // Payment handler with validation
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!selectedColor || !selectedSize) {
      setPaymentError("Please select both color and size");
      return;
    }

    if (!phone) {
      setPaymentError("Please enter your phone number");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      setPaymentError("Please enter a valid Kenyan phone number (format: 254XXXXXXXXX)");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/mpesa_payment`,
        new URLSearchParams({
          amount: product.product_cost,
          phone,
          product_id: productId,
          color: selectedColor,
          size: selectedSize,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.response?.data?.message || err.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="error-container">
        <p className="error-message">Product not found</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0;

  return (
    <div className="product-card-container">
      <div className="product-image-section">
        <img
          src={product.product_photo}
          alt={product.product_name}
          className="product-card-image"
          onError={(e) => {
            e.target.src = DEFAULT_PRODUCT_IMAGE;
            e.target.onerror = null; // Prevent infinite loop
          }}
          loading="lazy"
        />
        {product.discount && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="product-details-section">
        <h1 className="product-card-name">{product.product_name}</h1>
        
        <div className="price-container">
          <p className="product-card-price">
            KSh {product.product_cost.toLocaleString()}
          </p>
          {product.original_price && (
            <p className="original-price">
              KSh {product.original_price.toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="product-card-ratings">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(averageRating) ? "filled" : ""}`}>
                ★
              </span>
            ))}
          </div>
          <span>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
          {reviews.length > 0 && (
            <span className="average-rating">{averageRating.toFixed(1)}/5</span>
          )}
        </div>
        
        <div className="stock-status">
          {stock > 10 ? (
            <span className="in-stock">In Stock ({stock} available)</span>
          ) : stock > 0 ? (
            <span className="low-stock">Only {stock} left!</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        <div className="product-options">
          <div className="option-group">
            <h3>Color:</h3>
            <div className="option-buttons">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`option-btn ${selectedColor === color ? "active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          <div className="option-group">
            <h3>Size:</h3>
            <div className="option-buttons">
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`option-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                  aria-label={`Select ${size} size`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.product_description || "No description available."}</p>
        </div>

        <div className="product-actions">
          <button className="secondary-btn">
            <i className="icon-cart"></i> Add to Cart
          </button>
          <button
            className="primary-btn"
            onClick={handleBuyNow}
            disabled={paymentLoading || !isAuthenticated || stock === 0}
          >
            {paymentLoading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              <>
                <i className="icon-bolt"></i> Buy Now
              </>
            )}
          </button>
        </div>

        {!isAuthenticated && (
          <div className="auth-prompt">
            <Link to="/login" className="auth-link">Log in</Link> or{" "}
            <Link to="/register" className="auth-link">register</Link> to make a purchase.
          </div>
        )}

        {isAuthenticated && (
          <div className="payment-section">
            <div className="form-group">
              <label htmlFor="phone">M-Pesa Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 12));
                  setPaymentError(null);
                }}
                className={`form-input ${paymentError ? "error" : ""}`}
                disabled={paymentLoading}
              />
              <small>Format: 254 followed by 9 digits (e.g., 254712345678)</small>
            </div>
            
            {paymentError && (
              <div className="alert error">
                <i className="icon-warning"></i> {paymentError}
              </div>
            )}
            
            {paymentSuccess && (
              <div className="alert success">
                <i className="icon-check"></i> Payment initiated! Check your phone to complete the transaction.
              </div>
            )}
          </div>
        )}

        <div className="reviews-section">
          <div className="section-header">
            <h2>Customer Reviews</h2>
            <button
              className="text-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= rating ? "active" : ""}`}
                      onClick={() => setRating(star)}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="review">Your Review</label>
                <textarea
                  id="review"
                  placeholder="Share your thoughts about this product..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={!review.trim() || rating === 0}>
                Submit Review
              </button>
            </form>
          )}

          {loadingReviews ? (
            <div className="loading-reviews">
              <div className="spinner small"></div>
              <p>Loading reviews...</p>
            </div>
          ) : errorReviews ? (
            <div className="alert info">
              <i className="icon-info"></i> {errorReviews}
            </div>
          ) : reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <span className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert info">
              <i className="icon-info"></i> No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>

        <div className="product-meta">
          <div className="meta-item">
            <i className="icon-tag"></i>
            <span>SKU: {product.sku || "N/A"}</span>
          </div>
          <div className="meta-item">
            <i className="icon-category"></i>
            <span>Category: {product.category || "N/A"}</span>
          </div>
          <div className="meta-item">
            <i className="icon-truck"></i>
            <span>Delivery: Free shipping on orders over KSh 2000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  productId: PropTypes.string,
};

export default ProductCard;