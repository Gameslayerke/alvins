import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ProductOfferCard.css';

const ProductOfferCard = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://alvins.pythonanywhere.com/api/getOfferProduct/${productId}`
        );
        
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      navigate("/", { replace: true });
    }
  }, [productId, navigate]);

  const validatePhoneNumber = (phone) => /^254\d{9}$/.test(phone);

  const handleBuyNow = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      navigate("/signin", { state: { from: "product-offer", productId } });
      return;
    }

    setPaymentError(""); 
    setPaymentSuccess(false);

    if (!phone) {
      setPaymentError("Please enter your phone number.");
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setPaymentError("Invalid phone number. Use format: 2547XXXXXXXX.");
      return;
    }

    setPaymentLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("amount", product.original_price);
      formData.append("phone", phone);

      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/mpesa_payment",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        setPaymentError(response.data.message || "Payment failed. Try again.");
      }
    } catch (err) {
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-offer-container">
      <Card className="product-offer-card">
        <div className="row g-0">
          {/* Product Image Section */}
          <div className="col-md-6">
            <Card.Img 
              variant="top" 
              src={product.image_url} 
              alt={product.title}
              className="product-image"
            />
            <Badge bg="danger" className="discount-badge">
              {Math.round(product.discount_percentage)}% OFF
            </Badge>
          </div>

          {/* Product Details Section */}
          <div className="col-md-6">
            <Card.Body className="product-details">
              <Card.Title className="product-title">{product.title}</Card.Title>
              <Card.Text className="product-description">{product.description}</Card.Text>
              
              <div className="price-section mb-3">
                <h4 className="discounted-price">KSh {product.discounted_price}</h4>
                <span className="original-price">KSh {product.original_price}</span>
              </div>

              {/* Payment Section */}
              <div className="payment-section">
                {!localStorage.getItem("user_id") ? (
                  <Alert variant="warning" className="login-alert">
                    You must be <Link to="/signin" state={{ from: "product-offer", productId }}>logged in</Link> to proceed with payment.
                  </Alert>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Enter your phone number to pay via M-Pesa:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="2547XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="phone-input"
                      />
                    </Form.Group>

                    {paymentError && <Alert variant="danger">{paymentError}</Alert>}
                    {paymentSuccess && <Alert variant="success">Payment initiated! Check your phone.</Alert>}
                  </>
                )}
              </div>

              <div className="action-buttons d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleBuyNow}
                  disabled={paymentLoading || !localStorage.getItem("user_id")}
                  className="buy-now-btn"
                >
                  {paymentLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>

                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate("/")}
                  className="back-btn"
                >
                  Back to Home
                </Button>
              </div>
            </Card.Body>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductOfferCard;
