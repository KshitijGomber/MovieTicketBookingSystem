import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Link,
  Container
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await forgotPassword(email);
      setMessage('If an account exists with this email, you will receive a password reset link.');
    } catch (err) {
      setError(err.message || 'Failed to process your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {message ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/signin" 
                variant="body2"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Back to Sign In
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
