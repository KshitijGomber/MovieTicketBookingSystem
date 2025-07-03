const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Process a payment for a booking
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment result
 */
export async function processPayment(paymentData) {
  const res = await fetch(`${API_URL}/payments/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(paymentData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Payment processing failed');
  }
  
  return res.json();
}

/**
 * Get user's booking history
 * @returns {Promise<Array>} List of user's bookings
 */
export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch bookings');
  }
  
  return res.json();
}

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Created booking
 */
export async function createBooking(bookingData) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(bookingData),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Booking failed');
  }
  
  return res.json();
}

/**
 * Cancel a booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Cancelled booking
 */
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

/**
 * Get booked seats for a specific show and showtime
 * @param {string} showId - Show ID
 * @param {string} showTime - Show time
 * @returns {Promise<Object>} Booked seats data
 */
// export async function getBookedSeats(showId, showTime) {
//   const res = await fetch(
//     `${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`,
//     {
//       headers: getAuthHeader(),
//     }
//   );
  
//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || 'Failed to fetch booked seats');
//   }
  
//   return res.json();
// }

export async function getBookedSeats(showId, showTime) {
  const res = await fetch(
    `${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch booked seats');
  }
  
  return res.json();
}

/**
 * Get booking details by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export async function getBookingById(id) {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch booking details');
  }
  
  return res.json();
}

/**
 * Get booking details by payment ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Booking details
 */
export async function getBookingByPaymentId(paymentId) {
  const res = await fetch(`${API_URL}/bookings/payment/${paymentId}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch booking by payment ID');
  }
  
  return res.json();
} 