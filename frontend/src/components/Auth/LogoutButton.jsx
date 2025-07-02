import React from "react";
import { Button, MenuItem } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = ({ variant = 'button' }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (variant === 'menuitem') {
    return (
      <MenuItem onClick={handleLogout}>
        Log Out
      </MenuItem>
    );
  }

  return (
    <Button 
      color="inherit" 
      onClick={handleLogout}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton; 