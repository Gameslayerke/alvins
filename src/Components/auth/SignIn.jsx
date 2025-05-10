import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthForms.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      password: formData.password,
      rememberMe: formData.rememberMe,
    };

    if (formData.emailOrUsername.includes('@')) {
      payload.email = formData.emailOrUsername;
    } else {
      payload.username = formData.emailOrUsername;
      if (typeof login !== 'function') {
        setError('Login function is not available. Please check your AuthContext.');
        setLoading(false);
        return;
      }
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInClick = () => {
    console.log('Google Sign-in button clicked');
    setError('Google Sign-in functionality not yet implemented.');
  };

  const handleFacebookSignInClick = () => {
    console.log('Facebook Sign-in button clicked');
    setError('Facebook Sign-in functionality not yet implemented.');
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
              placeholder="Enter your password"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="/forgotpassword" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="social-auth-buttons">
            <button
              type="button"
              className="google-signin-button"
              onClick={handleGoogleSignInClick}
              disabled={loading}
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google logo"
              />
              Sign in with Google
            </button>
            <button
              type="button"
              className="facebook-signin-button"
              onClick={handleFacebookSignInClick}
              disabled={loading}
            >
              <img
                src="https://img.icons8.com/color/16/000000/facebook-new.png"
                alt="Facebook logo"
              />
              Sign in with Facebook
            </button>
          </div>

          <div className="auth-footer">
            Don&apos;t have an account? <a href="/register">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;