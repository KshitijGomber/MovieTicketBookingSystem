// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_URL = import.meta.env.VITE_API_URL;

// Get user ID from Auth0 or generate a unique one
const getUserId = () => {
  // Try to get user from Auth0
  const auth0User = JSON.parse(localStorage.getItem('auth0_user') || 'null');
  if (auth0User && auth0User.sub) {
    return auth0User.sub;
  }
  
  // Fallback to session-based user ID
  let sessionUserId = sessionStorage.getItem('session_user_id');
  if (!sessionUserId) {
    sessionUserId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_user_id', sessionUserId);
  }
  return sessionUserId;
};

export async function getBookings() {
  const userId = getUserId();
  const res = await fetch(`${API_URL}/bookings`, {
    headers: { 
      'Content-Type': 'application/json',
      'X-User-ID': userId 
    },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function createBooking({ showId, seat, showTime }) {
  const userId = getUserId();
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    },
    body: JSON.stringify({ showId, seat, showTime }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Booking failed');
  }
  return res.json();
}

export async function cancelBooking(id) {
  const userId = getUserId();
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-User-ID': userId 
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Cancel failed');
  }
  return res.json();
}

export async function getBookedSeats(showId, showTime) {
  const res = await fetch(`${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`);
  if (!res.ok) throw new Error('Failed to fetch booked seats');
  return res.json();
} 