import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signin, getGoogleAuthUrl, handleGoogleAuthResponse } from '../../api/auth';
import { 
  Google as GoogleIcon, 
  Visibility, 
  VisibilityOff,
  Email,
  Lock,
  LocalMovies
} from '@mui/icons-material';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 120,
          height: 120,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(20px)'
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 80,
          height: 80,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          filter: 'blur(15px)'
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header with Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <LocalMovies 
                    sx={{ 
                      fontSize: 48, 
                      color: 'primary.main',
                      filter: 'drop-shadow(0 4px 8px rgba(102,126,234,0.3))'
                    }} 
                  />
                </motion.div>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center',
                    letterSpacing: '-0.5px'
                  }}
                >
                  Welcome Back
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontSize: '1rem',
                    maxWidth: 300
                  }}
                >
                  Sign in to continue your movie journey
                </Typography>
              </Stack>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#f44336'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign In */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{
                  mb: 3,
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102,126,234,0.2)'
                  }
                }}
              >
                Continue with Google
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Divider sx={{ my: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    px: 2
                  }}
                >
                  OR
                </Typography>
              </Divider>
            </motion.div>

            {/* Sign In Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          }
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
                        }
                      }
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          }
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
                        }
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link 
                      component={RouterLink} 
                      to="/forgot-password" 
                      sx={{
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 500,
                        '&:hover': { 
                          textDecoration: 'underline',
                          color: 'primary.dark'
                        }
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button 
                      variant="contained" 
                      fullWidth 
                      type="submit" 
                      disabled={loading}
                      size="large"
                      sx={{ 
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(102,126,234,0.4)',
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, rgba(102,126,234,0.6) 0%, rgba(118,75,162,0.6) 100%)',
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.div>
                </Stack>
              </Box>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/signup" 
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signin; 