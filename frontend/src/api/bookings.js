const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch bookings');
  }
  
  return res.json();
}

export async function checkSeatAvailability({ showId, seats, showTime }) {
  const res = await fetch(`${API_URL}/bookings/check-seats`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ showId, seats, showTime })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to check seat availability');
  }
  
  return data;
}

export async function getBookedSeats(showId, showTime) {
  const res = await fetch(`${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`, {
    headers: getAuthHeader()
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch booked seats');
  }
  
  return res.json();
}

export async function processPayment({ amount, paymentDetails }) {
  const res = await fetch(`${API_URL}/bookings/process-payment`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ amount, paymentDetails })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Payment processing failed');
  }
  
  return data;
}

export async function createBooking({ showId, seats, showTime, paymentDetails }) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ 
      showId, 
      seats, 
      showTime,
      paymentDetails: {
        ...paymentDetails,
        method: 'card' // or 'upi' based on user selection
      }
    })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Booking failed');
  }
  
  return data;
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: 'POST',
    headers: getAuthHeader()
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel booking');
  }
  
  return data;
}

export async function getBookedSeats(showId, showTime) {
  const res = await fetch(`${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`);
  if (!res.ok) throw new Error('Failed to fetch booked seats');
  return res.json();
} 