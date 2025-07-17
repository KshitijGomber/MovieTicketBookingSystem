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
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  AccountCircle, 
  Movie, 
  Home, 
  ConfirmationNumber,
  Login,
  PersonAdd
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
          elevation={isScrolled ? 4 : 0}
          sx={{
            background: isScrolled 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderBottom: isScrolled 
              ? '1px solid rgba(0,0,0,0.1)' 
              : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            color: isScrolled ? 'text.primary' : 'white'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  background: isScrolled 
                    ? 'linear-gradient(45deg, #667eea, #764ba2)'
                    : 'linear-gradient(45deg, #fff, #f0f0f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Movie /> BookYourMovie
              </Typography>
            </motion.div>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
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
                      fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      background: location.pathname === item.path 
                        ? 'rgba(102, 126, 234, 0.1)' 
                        : 'transparent',
                      '&:hover': {
                        background: isScrolled 
                          ? 'rgba(102, 126, 234, 0.1)' 
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'all 0.3s ease'
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
                      background: 'rgba(102, 126, 234, 0.1)',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.2)',
                      }
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                </motion.div>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/signin"
                      variant="outlined"
                      sx={{
                        color: isScrolled ? 'primary.main' : 'white',
                        borderColor: isScrolled ? 'primary.main' : 'white',
                        borderRadius: 3,
                        '&:hover': {
                          borderColor: isScrolled ? 'primary.dark' : 'rgba(255,255,255,0.8)',
                          background: isScrolled 
                            ? 'rgba(102, 126, 234, 0.1)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: 3,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </Box>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: isScrolled ? 'text.primary' : 'white',
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
            width: 300,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <Box sx={{ pt: 8 }}>
          <List>
            {[...menuItems, ...authItems].map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ListItem 
                  button 
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 2,
                    mb: 1,
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              </motion.div>
            ))}
            
            {user && (
              <motion.div
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ListItem sx={{ px: 2, mt: 2 }}>
                  <LogoutButton />
                </ListItem>
              </motion.div>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
