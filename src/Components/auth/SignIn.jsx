import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/AuthForms.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Please complete the CAPTCHA before signing in.');
      return;
    }

    const payload = {
      password: formData.password,
      captchaToken,
    };

    // determine if input is email or username
    if (formData.emailOrUsername.includes('@')) {
      payload.email = formData.emailOrUsername;
    } else {
      payload.username = formData.emailOrUsername;
    }

    try {
      const result = await login(payload);
      if (result.success) {
        navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your email or username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey="6Lc11TMrAAAAAKZfvr1henD3Ihrqd86fGVfI1NhW"
              onChange={handleCaptchaChange}
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgotpassword" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={!captchaToken}
          >
            Sign In
          </button>

          <div className="auth-footer">
            Don&apos;t have an account? <a href="/register">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
