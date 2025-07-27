const API_URL = import.meta.env.VITE_API_URL || 'https://movieticketbookingsystem-7suc.onrender.com/api';

// Mock theater data for fallback - structured to match API response
const mockTheaters = [
  {
    theater: {
      _id: '68750a5d92525e896adc216a',
      name: 'Cineplex Downtown',
      location: {
        address: '123 Main St',
        city: 'Downtown',
        state: 'NY',
        zipCode: '10001',
        fullAddress: '123 Main St, Downtown, NY 10001'
      },
      rating: 4.5,
      amenities: ['Parking', 'Food Court', 'IMAX', 'Recliner Seats'],
      contactInfo: {
        phone: '+1 (555) 123-4567'
      },
      screens: 12,
      features: ['Dolby Atmos', '4DX', 'Premium Seating']
    },
    showTimes: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
    availableSeats: 150
  },
  {
    theater: {
      _id: '68750a5d92525e896adc216b',
      name: 'Regal Cinema Plaza',
      location: {
        address: '456 Oak Ave',
        city: 'Midtown',
        state: 'NY',
        zipCode: '10002',
        fullAddress: '456 Oak Ave, Midtown, NY 10002'
      },
      rating: 4.2,
      amenities: ['Parking', 'Concessions', 'Digital', 'Stadium Seating'],
      contactInfo: {
        phone: '+1 (555) 987-6543'
      },
      screens: 8,
      features: ['Digital Projection', 'Surround Sound']
    },
    showTimes: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
    availableSeats: 120
  },
  {
    theater: {
      _id: '68750a5d92525e896adc216c',
      name: 'AMC Northgate',
      location: {
        address: '789 Pine St',
        city: 'Northside',
        state: 'NY',
        zipCode: '10003',
        fullAddress: '789 Pine St, Northside, NY 10003'
      },
      rating: 4.7,
      amenities: ['Parking', 'Restaurant', 'IMAX', 'Luxury Loungers'],
      contactInfo: {
        phone: '+1 (555) 456-7890'
      },
      screens: 16,
      features: ['IMAX', 'Dolby Cinema', 'Reclining Seats']
    },
    showTimes: ['9:30 AM', '12:30 PM', '3:30 PM', '6:30 PM', '9:30 PM'],
    availableSeats: 200
  }
];

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

export async function getTheaters(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        // Ensure we convert objects to strings appropriately
        const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : String(params[key]);
        queryParams.append(key, value);
      }
    });

    const url = `${API_URL}/theaters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const res = await fetch(url, {
      headers: getAuthHeader()
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.warn('Failed to fetch theaters from API, using fallback data:', error.message);
    
    // Return mock theaters data as fallback
    return mockTheaters;
  }
}

export async function getTheater(theaterId) {
  const res = await fetch(`${API_URL}/theaters/${theaterId}`, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch theater');
  }
  
  return res.json();
}

export async function getTheaterShowtimes(theaterId, params = {}) {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      // Ensure we convert objects to strings appropriately
      const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : String(params[key]);
      queryParams.append(key, value);
    }
  });

  const url = `${API_URL}/theaters/${theaterId}/showtimes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const res = await fetch(url, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch theater showtimes');
  }
  
  return res.json();
}

export async function getTheatersForMovie(movieId, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        // Ensure we convert objects to strings appropriately
        const value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : String(params[key]);
        queryParams.append(key, value);
      }
    });

    const url = `${API_URL}/theaters/movie/${movieId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('Fetching theaters for movie:', movieId, 'from URL:', url);
    
    const res = await fetch(url, {
      headers: getAuthHeader()
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Theaters API response:', data);
    
    return data;
  } catch (error) {
    console.warn('Failed to fetch theaters from API, using fallback data:', error.message);
    console.log('Returning mock theater data:', mockTheaters);
    
    // Return mock theaters data as fallback
    return mockTheaters;
  }
}

export async function createTheater(theaterData) {
  const res = await fetch(`${API_URL}/theaters`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(theaterData)
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create theater');
  }
  
  return res.json();
}

export async function updateTheater(theaterId, theaterData) {
  const res = await fetch(`${API_URL}/theaters/${theaterId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(theaterData)
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update theater');
  }
  
  return res.json();
}