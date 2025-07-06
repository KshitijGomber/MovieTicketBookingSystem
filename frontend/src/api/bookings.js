const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
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

// Format time to 12-hour format with AM/PM for API consistency
const formatTimeForApi = (timeString) => {
  if (!timeString) return '';
  
  // If it's already in the correct format, return as is
  if (/^\d{1,2}:\d{2} [AP]M$/.test(timeString)) {
    return timeString;
  }
  
  // If it's a Date object or ISO string, format it
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString; // Return as is if not a valid date
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export async function getBookedSeats(showId, showTime) {
  if (!showTime) {
    console.error('Show time is required');
    return { bookedSeats: [] };
  }

  try {
    const formattedTime = formatTimeForApi(showTime);
    const headers = getAuthHeader();
    const res = await fetch(
      `${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(formattedTime)}`,
      { headers }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch booked seats');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    // Return an empty array if there's an error (e.g., network error or unauthorized)
    return { bookedSeats: [] };
  }
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

export async function createBooking(bookingData) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      ...bookingData,
      showTime: formatTimeForApi(bookingData.showTime),
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create booking');
  }
  
  // The backend returns { success, data, ... } but we just want the data array
  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    return { data: data.data };
  }
  
  // Fallback in case the response format is different
  return { data: [data] };
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
