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
  InputAdornment,
  IconButton,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signup, getGoogleAuthUrl, handleGoogleAuthResponse } from '../../api/auth';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { PersonAdd, Email, Lock } from '@mui/icons-material';

const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' }
  }
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '25px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
  color: 'white',
  maxWidth: '450px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.5s',
  },
  
  '&:hover::before': {
    left: '100%',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    
    '& fieldset': {
      border: 'none',
    },
    
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
    
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    }
  },
  
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500,
    
    '&.Mui-focused': {
      color: 'white',
    }
  },
  
  '& .MuiOutlinedInput-input': {
    color: 'white',
    fontWeight: 500,
    
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
    }
  }
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '15px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 700,
  fontSize: '1.1rem',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    color: 'white',
    border: 'none',
    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
    
    '&:hover': {
      background: 'linear-gradient(135deg, #45b7aa 0%, #3d8b73 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 35px rgba(78, 205, 196, 0.4)',
    },
    
    '&:disabled': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.5)',
      transform: 'none',
      boxShadow: 'none',
    }
  }),
  
  ...(variant === 'google' && {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 255, 255, 0.1)',
    }
  }),
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  
  '&:hover::before': {
    left: '100%',
  }
}));

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
    <AuthContainer maxWidth={false}>
      {/* Background decorative elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <AuthPaper elevation={0}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <PersonAdd sx={{ fontSize: 60, mb: 2, color: 'white', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' }} />
              </motion.div>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: 'white',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                Join BookYourMovie
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Create your account and start booking amazing movie experiences
              </Typography>
            </Box>
          </motion.div>
          
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '15px',
                    background: 'rgba(255, 107, 107, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAlert-icon': {
                      color: '#ff6b6b'
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Google Sign Up */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ActionButton
              fullWidth
              variant="google"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              disabled={loading}
              sx={{ mb: 3, py: 2 }}
            >
              Continue with Google
            </ActionButton>
          </motion.div>
          
          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.3)' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  px: 2, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500
                }}
              >
                OR
              </Typography>
              <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.3)' }} />
            </Box>
          </motion.div>
          
          {/* Sign Up Form */}
          <Box component="form" noValidate autoComplete="on" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <StyledTextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAdd sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <StyledTextField
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
                        <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <StyledTextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  disabled={loading}
                  helperText="Password must be at least 8 characters long"
                  FormHelperTextProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <ActionButton 
                  variant="primary"
                  fullWidth 
                  type="submit" 
                  disabled={loading}
                  sx={{ py: 2, mt: 2 }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      <Typography>Creating Account...</Typography>
                    </Box>
                  ) : (
                    '✨ Create Account'
                  )}
                </ActionButton>
              </motion.div>
            </Stack>
          </Box>
          
          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500
                }}
              >
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/signin" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderBottomColor: 'white',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </AuthPaper>
      </motion.div>
    </AuthContainer>
  );
};

export default Signup; 