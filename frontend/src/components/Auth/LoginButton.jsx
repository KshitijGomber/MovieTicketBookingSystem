import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginButton = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <Button 
      color="inherit" 
      onClick={() => navigate('/signin')}
      disabled={!!token}
    >
      Log In
    </Button>
  );
};

export default LoginButton; 