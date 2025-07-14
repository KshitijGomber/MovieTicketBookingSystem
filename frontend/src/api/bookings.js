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

export async function getBooking(bookingId, token) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch booking details');
  }
  
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data; // Handle both array and single object responses
}

export async function checkSeatAvailability({ showId, theaterId, seats, showTime }) {
  const res = await fetch(`${API_URL}/bookings/check-seats`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ showId, theaterId, seats, showTime })
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

export async function getBookedSeats(showId, showTime, theaterId) {
  if (!showTime) {
    console.error('Show time is required');
    return { bookedSeats: [] };
  }
  
  if (!theaterId) {
    console.error('Theater ID is required');
    return { bookedSeats: [] };
  }

  try {
    const formattedTime = formatTimeForApi(showTime);
    const headers = getAuthHeader();
    const res = await fetch(
      `${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(formattedTime)}&theaterId=${theaterId}`,
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
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        ...bookingData,
        showTime: formatTimeForApi(bookingData.showTime),
      })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create booking');
    }
    
    console.log('Booking response:', responseData);
    
    // Handle different response formats
    if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      // Format 1: { success: true, data: [{...}] }
      return { data: responseData.data };
    } else if (responseData.booking) {
      // Format 2: { success: true, booking: {...} }
      return { data: [responseData.booking] };
    } else if (Array.isArray(responseData)) {
      // Format 3: [{...}] (direct array)
      return { data: responseData };
    } else if (typeof responseData === 'object') {
      // Format 4: { ...bookingData }
      return { data: [responseData] };
    }
    
    throw new Error('Unexpected response format from server');
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

export async function cancelBooking(bookingId) {
  try {
    const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: getAuthHeader()
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Failed to cancel booking');
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Cancellation was not successful');
    }
    
    return {
      success: true,
      message: data.message || 'Booking cancelled successfully',
      booking: data.booking,
      refund: data.refund
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}
