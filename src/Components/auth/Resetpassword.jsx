import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Paper, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(8),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is valid when component mounts
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://alvins.pythonanywhere.com/api/reset-password', {
        token,
        password
      });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={3}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Invalid Token
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            The password reset link is invalid or has expired. Please request a new one.
          </Alert>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/forgotpassword')}
            >
              Request New Link
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          Please enter your new password below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || !tokenValid}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default ResetPasswordForm;