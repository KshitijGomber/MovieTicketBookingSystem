import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  alpha,
  useScrollTrigger
} from '@mui/material';
import { 
  Movie as MovieIcon,
  AccountCircle,
  Home,
  LocalMovies
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar 
        position="fixed" 
        elevation={trigger ? 8 : 0}
        sx={{
          backgroundColor: trigger 
            ? alpha(theme.palette.background.paper, 0.95)
            : 'transparent',
          backdropFilter: trigger ? 'blur(20px)' : 'none',
          borderBottom: trigger 
            ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
            : 'none',
          transition: 'all 0.3s ease-in-out',
          color: theme.palette.text.primary
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo and Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  '&:hover': {
                    '& .logo-icon': {
                      transform: 'rotate(360deg)',
                    }
                  }
                }}
                onClick={() => handleNavigation('/')}
              >
                <Box
                  className="logo-icon"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    mr: 1.5,
                    transition: 'transform 0.6s ease',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <MovieIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)'
                      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.3px',
                    fontSize: '1.1rem'
                  }}
                >
                  BookYourMovie
                </Typography>
              </Box>
            </motion.div>

            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<Home />}
                  onClick={() => handleNavigation('/')}
                  sx={{
                    color: isActivePage('/') 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    fontWeight: isActivePage('/') ? 'bold' : 'medium',
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    background: isActivePage('/') 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Home
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<LocalMovies />}
                  onClick={() => handleNavigation('/movies')}
                  sx={{
                    color: isActivePage('/movies') 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    fontWeight: isActivePage('/movies') ? 'bold' : 'medium',
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    background: isActivePage('/movies') 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Movies
                </Button>
              </motion.div>
            </Box>

            {/* Right Side - Theme Toggle and User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ThemeToggle />
              </motion.div>

              {user ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <UserMenu />
                </motion.div>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleNavigation('/signin')}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 'medium',
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleNavigation('/signup')}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Header;
