// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function createBooking({ showId, seat, showTime }) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
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
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
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