import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  Box,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Stack,
  Avatar,
  Paper
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  AccountCircle, 
  Movie, 
  Home, 
  ConfirmationNumber,
  Login,
  PersonAdd,
  LocalMovies
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Auth/LogoutButton';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Movies', path: '/movies', icon: <Movie /> },
    ...(user ? [{ label: 'My Bookings', path: '/my-bookings', icon: <ConfirmationNumber /> }] : [])
  ];

  const authItems = user ? [] : [
    { label: 'Sign In', path: '/signin', icon: <Login /> },
    { label: 'Sign Up', path: '/signup', icon: <PersonAdd /> }
  ];

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            background: isScrolled 
              ? 'rgba(255, 255, 255, 0.98)' 
              : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderBottom: isScrolled 
              ? '1px solid rgba(0,0,0,0.08)' 
              : '1px solid rgba(255,255,255,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: isScrolled ? 'text.primary' : 'white',
            boxShadow: isScrolled 
              ? '0 4px 20px rgba(0,0,0,0.08)' 
              : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 800,
                  textDecoration: 'none',
                  background: isScrolled 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                <Movie sx={{ 
                  fontSize: { xs: 24, md: 28 },
                  color: isScrolled ? '#667eea' : 'white'
                }} /> 
                BookYourMovie
              </Typography>
            </motion.div>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: isScrolled ? 'text.primary' : 'white',
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      borderRadius: 3,
                      px: 3,
                      py: 1.2,
                      fontSize: '0.95rem',
                      background: location.pathname === item.path 
                        ? isScrolled 
                          ? 'rgba(102, 126, 234, 0.12)' 
                          : 'rgba(255, 255, 255, 0.15)'
                        : 'transparent',
                      '&:hover': {
                        background: isScrolled 
                          ? 'rgba(102, 126, 234, 0.08)' 
                          : 'rgba(255, 255, 255, 0.12)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}

              {/* User Menu or Auth Buttons */}
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      color: isScrolled ? 'text.primary' : 'white',
                      background: isScrolled 
                        ? 'rgba(102, 126, 234, 0.08)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      ml: 1,
                      '&:hover': {
                        background: isScrolled 
                          ? 'rgba(102, 126, 234, 0.15)' 
                          : 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                </motion.div>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5, ml: 2 }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/signin"
                      variant="outlined"
                      size="small"
                      sx={{
                        color: isScrolled ? 'primary.main' : 'white',
                        borderColor: isScrolled ? 'primary.main' : 'rgba(255,255,255,0.7)',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: isScrolled ? 'primary.dark' : 'white',
                          background: isScrolled 
                            ? 'rgba(102, 126, 234, 0.08)' 
                            : 'rgba(255, 255, 255, 0.12)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        boxShadow: isScrolled 
                          ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                          : '0 4px 12px rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Box>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center' }}>
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleUserMenuOpen}
                    size="small"
                    sx={{
                      color: isScrolled ? 'text.primary' : 'white',
                      background: isScrolled 
                        ? 'rgba(102, 126, 234, 0.08)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: isScrolled 
                          ? 'rgba(102, 126, 234, 0.15)' 
                          : 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: isScrolled ? 'text.primary' : 'white',
                    background: isScrolled 
                      ? 'rgba(102, 126, 234, 0.08)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: isScrolled 
                        ? 'rgba(102, 126, 234, 0.15)' 
                        : 'rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </motion.div>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {user?.name || user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/my-bookings'); handleUserMenuClose(); }}>
          <ConfirmationNumber sx={{ mr: 1 }} /> My Bookings
        </MenuItem>
        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
          }
        }}
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Box sx={{ pt: 10, px: 3 }}>
            {/* Mobile Logo */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  letterSpacing: '-0.02em'
                }}
              >
                <Movie sx={{ fontSize: 24, color: '#667eea' }} />
                BookYourMovie
              </Typography>
            </Box>

            {/* Mobile Navigation Items */}
            <List sx={{ px: 0 }}>
              {[...menuItems, ...authItems].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 2.5,
                        background: location.pathname === item.path 
                          ? 'rgba(102, 126, 234, 0.12)' 
                          : 'transparent',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.08)',
                          transform: 'translateX(8px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                        minWidth: 40
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 700 : 500,
                          color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                          fontSize: '1rem'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
              
              {user && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: menuItems.length * 0.1 + 0.2 }}
                >
                  <ListItem disablePadding sx={{ mt: 3, mb: 1 }}>
                    <ListItemButton
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 2.5,
                        '&:hover': {
                          background: 'rgba(244, 67, 54, 0.08)',
                          transform: 'translateX(8px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <LogoutButton />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              )}
            </List>
          </Box>
        </motion.div>
      </Drawer>
    </>
  );
};

export default Header;
