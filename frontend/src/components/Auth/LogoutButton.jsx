import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // Clear session storage to reset user session
    sessionStorage.removeItem('session_user_id');
    localStorage.removeItem('auth0_user');
    
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

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