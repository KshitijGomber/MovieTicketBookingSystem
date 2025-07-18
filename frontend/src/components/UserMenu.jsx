import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  AccountCircle,
  ConfirmationNumber,
  Logout,
  Person,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserMenu = ({ isScrolled = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    handleClose();
    if (action === 'logout') {
      logout();
      navigate('/');
    } else if (action === 'bookings') {
      navigate('/my-bookings');
    } else if (action === 'profile') {
      // Navigate to profile page when implemented
      console.log('Profile page not implemented yet');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            background: isScrolled 
              ? 'rgba(102, 126, 234, 0.08)' 
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: isScrolled 
                ? 'rgba(102, 126, 234, 0.15)' 
                : 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.2s ease'
          }}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {user?.profilePicture ? (
            <Avatar
              src={user.profilePicture}
              alt={user.name}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Avatar
              sx={{ 
                width: 32, 
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
          )}
        </IconButton>
      </motion.div>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.1)',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {user?.email}
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Menu Items */}
        <MenuItem onClick={() => handleMenuItemClick('profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick('bookings')}>
          <ListItemIcon>
            <ConfirmationNumber fontSize="small" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuItemClick('settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleMenuItemClick('logout')}
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'inherit' }} />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;