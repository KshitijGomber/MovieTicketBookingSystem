const API_URL = import.meta.env.VITE_API_URL || 'https://movieticketbookingsystem-7suc.onrender.com/api';

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
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  const url = `${API_URL}/theaters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const res = await fetch(url, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch theaters');
  }
  
  return res.json();
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
    if (params[key]) {
      queryParams.append(key, params[key]);
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
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  const url = `${API_URL}/theaters/movie/${movieId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const res = await fetch(url, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch theaters for movie');
  }
  
  return res.json();
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