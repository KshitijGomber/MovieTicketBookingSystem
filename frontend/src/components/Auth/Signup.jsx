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
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signup, getGoogleAuthUrl, handleGoogleAuthResponse } from '../../api/auth';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signup: signupCtx } = useAuth();

  // Handle Google OAuth redirect
  useEffect(() => {
    try {
      const response = handleGoogleAuthResponse();
      if (response) {
        signupCtx(response.user, response.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  }, [signupCtx, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const res = await signup({ name, email, password });
      signupCtx(res.user, res.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    try {
      window.location.href = getGoogleAuthUrl();
    } catch (err) {
      setError('Failed to initiate Google sign up. Please try again.');
    }
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        Create an Account
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
        Join Movie Ticket Booking today
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
        onClick={handleGoogleSignup}
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
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
          />
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            disabled={loading}
            helperText="Password must be at least 8 characters long"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            type="submit" 
            disabled={loading}
            size="large"
            sx={{ py: 1.5, textTransform: 'none', mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Signup; 