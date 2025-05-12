import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          `https://alvins.pythonanywhere.com/api/getOfferProducts`
        );
        
        // Find the specific product from the offers array
        const foundProduct = response.data.offers.find(
          offer => offer.id.toString() === productId
        );

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            discounted_price: foundProduct.discounted_price || foundProduct.original_price,
            discount_percentage: foundProduct.discount_percentage || 0,
            end_date: foundProduct.end_date || new Date().toISOString()
          });
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
      formData.append("amount", product.discounted_price); // Use discounted price for payment
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
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate("/offers")}>
              Back to Offers
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container py-5">
      <Card className="shadow">
        <div className="row g-0">
          {/* Product Image Section */}
          <div className="col-md-6">
            <Card.Img 
              variant="top" 
              src={product.image_url || "/placeholder-product.jpg"} 
              alt={product.title}
              className="img-fluid rounded-start"
              style={{ height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
            {product.discount_percentage > 0 && (
              <Badge bg="danger" className="position-absolute top-0 start-0 m-3 fs-5">
                {Math.round(product.discount_percentage)}% OFF
              </Badge>
            )}
          </div>

          {/* Product Details Section */}
          <div className="col-md-6">
            <Card.Body className="h-100 d-flex flex-column p-4">
              <Card.Title className="mb-3 fs-2">{product.title}</Card.Title>
              <Card.Text className="mb-4 text-muted">{product.description}</Card.Text>
              
              <div className="price-section mb-4">
                <h3 className="text-primary fw-bold">
                  KSh {product.discounted_price?.toLocaleString()}
                </h3>
                {product.discount_percentage > 0 && (
                  <span className="text-decoration-line-through text-muted ms-2 fs-5">
                    KSh {product.original_price?.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <Badge bg="info" className="me-2 p-2">
                  Stock: {product.stock_quantity}
                </Badge>
                <Badge bg="warning" text="dark" className="p-2">
                  Offer ends: {new Date(product.end_date).toLocaleDateString()}
                </Badge>
              </div>

              {/* Payment Section */}
              <div className="payment-section mt-auto">
                {!localStorage.getItem("user_id") ? (
                  <Alert variant="warning" className="text-center">
                    You must be <Link to="/signin" state={{ from: "product-offer", productId }}>logged in</Link> to purchase.
                  </Alert>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>M-Pesa Payment</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="2547XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="py-2"
                      />
                      <Form.Text className="text-muted">
                        Enter your Safaricom phone number
                      </Form.Text>
                    </Form.Group>

                    {paymentError && <Alert variant="danger">{paymentError}</Alert>}
                    {paymentSuccess && (
                      <Alert variant="success">
                        Payment initiated! Check your phone for M-Pesa prompt.
                      </Alert>
                    )}
                  </>
                )}
              </div>

              <div className="d-flex gap-3 mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={paymentLoading || !localStorage.getItem("user_id")}
                  className="flex-grow-1 py-2"
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
                  size="lg"
                  onClick={() => navigate("/offers")}
                  className="py-2"
                >
                  Back to Offers
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