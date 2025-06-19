const API_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function createBooking({ showId, seat }) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ showId, seat }),
  });
  if (!res.ok) throw new Error('Booking failed');
  return res.json();
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Cancel failed');
  return res.json();
} 