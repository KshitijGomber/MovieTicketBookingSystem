// Mock data for shows that matches the backend schema
export const mockShows = [
  {
    _id: '68548601467ac59650bff6c2',
    title: 'Inception',
    description: 'A thief who enters the dreams of others to steal their secrets gets a chance to have his old life back as payment for a task considered impossible: inception.',
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    duration: 148,
    genre: 'Sci-Fi',
    language: 'English',
    price: 12.99,
    showTimes: ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'],
    availableSeats: 97
  },
  {
    _id: '68548601467ac59650bff6c3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    duration: 152,
    genre: 'Action',
    language: 'English',
    price: 13.99,
    showTimes: ['11:00 AM', '3:00 PM', '7:00 PM', '10:00 PM'],
    availableSeats: 99
  },
  {
    _id: '68548601467ac59650bff6c4',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    duration: 132,
    genre: 'Drama',
    language: 'Korean',
    price: 11.99,
    showTimes: ['1:00 PM', '4:00 PM', '8:00 PM'],
    availableSeats: 100
  },
  {
    _id: '68548601467ac59650bff6c5',
    title: 'Everything Everywhere All at Once',
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    duration: 139,
    genre: 'Action/Comedy',
    language: 'English/Chinese',
    price: 14.99,
    showTimes: ['12:00 PM', '3:30 PM', '7:30 PM', '10:30 PM'],
    availableSeats: 100
  },
  {
    _id: '68548601467ac59650bff6c6',
    title: 'Dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    duration: 155,
    genre: 'Sci-Fi',
    language: 'English',
    price: 15.99,
    showTimes: ['11:30 AM', '2:30 PM', '6:30 PM', '9:30 PM'],
    availableSeats: 100
  }
];

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to handle fetch with timeout
const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

export async function fetchShows() {
  try {
    const response = await fetchWithTimeout(`${API_URL}/shows`);
    if (!response.ok) throw new Error('Failed to fetch shows');
    return await response.json();
  } catch (error) {
    console.error('Using mock data due to error:', error.message);
    return mockShows; // Return mock data if the API call fails
  }
}

export async function fetchShow(showId) {
  // Ensure showId is a string and trim any whitespace
  showId = String(showId).trim();
  console.log('fetchShow - showId:', showId);
  
  // Hardcode the API URL to ensure it's correct
  const apiBaseUrl = 'https://movieticketbookingsystem-7suc.onrender.com/api';
  console.log('fetchShow - Using API URL:', apiBaseUrl);
  
  try {
    // First try to find in mock data
    const mockShow = mockShows.find(show => show._id === showId);
    if (mockShow) {
      console.log('fetchShow - Found in mock data:', mockShow);
      return mockShow;
    }
    
    console.log('fetchShow - Not found in mock data, trying API...');
    
    // If not in mock data, try the API with hardcoded URL
    const apiUrl = `${apiBaseUrl}/shows/${showId}`;
    console.log('fetchShow - Making request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add credentials if needed
      // credentials: 'include',
    });
    
    console.log('fetchShow - Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Failed to fetch show (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('fetchShow - Error response:', errorData);
      } catch (e) {
        console.error('fetchShow - Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('fetchShow - Response data:', data);
    
    // Check if we got a valid show object
    if (!data || typeof data !== 'object' || !data._id) {
      console.error('fetchShow - Invalid show data received:', data);
      throw new Error('Invalid show data received from server');
    }
    
    console.log('fetchShow - Successfully fetched show:', data._id);
    return data;
  } catch (error) {
    console.error('Error in fetchShow:', error);
    
    // Try to find in mock data as fallback
    const mockShow = mockShows.find(show => show._id === showId);
    if (mockShow) {
      console.log('Using mock data as fallback');
      return mockShow;
    }
    
    // If we have a specific error message, use it
    if (error.message) {
      throw error;
    }
    
    throw new Error('Show not found. Please check the show ID and try again.');
  }
}