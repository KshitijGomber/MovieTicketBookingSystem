const API_URL = import.meta.env.VITE_API_URL || 'https://movieticketbookingsystem-7suc.onrender.com/api';

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export async function signup({ name, email, password }) {
  return fetchWithAuth(`${API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function signin({ email, password }) {
  return fetchWithAuth(`${API_URL}/auth/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getGoogleAuthUrl() {
  // Get the current origin (e.g., http://localhost:3000 or your production URL)
  const redirectUri = `${window.location.origin}${window.location.pathname}`;
  
  // Encode the redirect URI to be used as a URL parameter
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  
  // Return the Google OAuth URL with the redirect_uri parameter
  return `${API_URL}/auth/google?redirect_uri=${encodedRedirectUri}`;
}

export function handleGoogleAuthResponse() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const name = params.get('name') ? decodeURIComponent(params.get('name')) : null;
  const email = params.get('email') ? decodeURIComponent(params.get('email')) : null;
  const error = params.get('error');
  
  // Clean up the URL
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
  
  if (error) {
    throw new Error(error);
  }
  
  if (token) {
    return { 
      token, 
      user: { 
        name, 
        email,
        // Other user info will be extracted from the token
      } 
    };
  }
  
  return null;
}

export async function forgotPassword(email) {
  return fetchWithAuth(`${API_URL}/password-reset/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ token, password }) {
  return fetchWithAuth(`${API_URL}/password-reset/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export async function validateResetToken(token) {
  const response = await fetch(`${API_URL}/password-reset/validate-reset-token/${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Invalid or expired token');
  }
  
  return data;
}