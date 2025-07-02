import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../../api/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const token = searchParams.get('token');

  // Validate the reset token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        return;
      }

      try {
        setLoading(true);
        const data = await validateResetToken(token);
        setTokenValid(true);
        setEmail(data.email);
      } catch (err) {
        setError('Invalid or expired reset token');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await resetPassword({ token, password });
      
      setSuccess('Your password has been reset successfully. You can now log in with your new password.');
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Invalid Reset Link
        </Typography>
        <Typography variant="body1" color="error" align="center" mb={3}>
          The password reset link is invalid or has expired.
        </Typography>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/forgot-password" color="primary">
            Request a new reset link
          </Link>
        </Box>
      </Paper>
    );
  }

  if (loading && !tokenValid) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!tokenValid) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Invalid or Expired Link
        </Typography>
        <Typography variant="body1" color="error" align="center" mb={3}>
          The password reset link is invalid or has expired.
        </Typography>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/forgot-password" color="primary">
            Request a new reset link
          </Link>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Reset Your Password
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
        Enter your new password for {email}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ResetPassword;
