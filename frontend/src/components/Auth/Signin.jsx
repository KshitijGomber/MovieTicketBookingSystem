import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Stack,
  Divider,
  Link
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signin, getGoogleAuthUrl, handleGoogleAuthResponse } from '../../api/auth';
import GoogleIcon from '@mui/icons-material/Google';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Handle Google OAuth redirect
    const handleGoogleAuth = async () => {
      try {
        // Check for error in URL params first
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        
        if (error) {
          setError(
            error === 'oauth_failed' 
              ? 'Failed to sign in with Google. Please try again.'
              : 'An error occurred during sign in.'
          );
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
        
        const response = await handleGoogleAuthResponse();
        if (response && response.token) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          
          try {
            // Get user info from the token
            const base64Url = response.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const userInfo = JSON.parse(atob(base64));
            
            // Update auth context
            login({
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture
            }, response.token);
            
            // Redirect to home or intended URL
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
          } catch (parseError) {
            console.error('Error parsing user info:', parseError);
            setError('Failed to process user information. Please try again.');
          }
        }
      } catch (err) {
        console.error('Google auth error:', err);
        setError(err.message || 'Failed to sign in with Google');
      }
    };

    // Only run this effect if we have a token in the URL
    const params = new URLSearchParams(window.location.search);
    if (params.has('token') || params.has('error')) {
      handleGoogleAuth();
    }
  }, [login, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signin({ email, password });
      login(res.user, res.token);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = getGoogleAuthUrl();
    } catch (err) {
      setError('Failed to initiate Google sign in. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
        Sign in to continue to Movie Ticket Booking
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{
          mb: 3,
          py: 1.5,
          textTransform: 'none',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'text.primary',
            backgroundColor: 'action.hover'
          }
        }}
      >
        Continue with Google
      </Button>
      
      <Divider sx={{ my: 3, color: 'text.secondary' }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>
      
      <Box component="form" noValidate autoComplete="on" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            type="submit" 
            disabled={loading}
            size="large"
            sx={{ py: 1.5, textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Stack>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign up
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            <Link component={RouterLink} to="/forgot-password" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Forgot password?
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Signin; 