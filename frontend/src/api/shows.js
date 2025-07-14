// Mock data for shows that matches the backend schema
export const mockShows = [
  {
    _id: '68750a5d92525e896adc216d',
    title: 'Inception',
    description: 'A thief who enters the dreams of others to steal their secrets gets a chance to have his old life back as payment for a task considered impossible: inception.',
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    duration: 148,
    genre: 'Sci-Fi',
    language: 'English',
    rating: 'PG-13',
    price: 12.99,
    showTimes: ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'],
    availableSeats: 97
  },
  {
    _id: '68750a5d92525e896adc2171',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    duration: 152,
    genre: 'Action',
    language: 'English',
    rating: 'PG-13',
    price: 13.99,
    showTimes: ['11:00 AM', '3:00 PM', '7:00 PM', '10:00 PM'],
    availableSeats: 99
  },
  {
    _id: '68750a5d92525e896adc2174',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    duration: 132,
    genre: 'Drama',
    language: 'Korean',
    rating: 'R',
    price: 11.99,
    showTimes: ['1:00 PM', '4:00 PM', '8:00 PM'],
    availableSeats: 100
  },
  {
    _id: '68750a5d92525e896adc2178',
    title: 'Everything Everywhere All at Once',
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    duration: 139,
    genre: 'Action/Comedy',
    language: 'English/Chinese',
    rating: 'R',
    price: 14.99,
    showTimes: ['12:00 PM', '3:30 PM', '7:30 PM', '10:30 PM'],
    availableSeats: 100
  },
  {
    _id: '68750a5d92525e896adc217b',
    title: 'Dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    duration: 155,
    genre: 'Sci-Fi',
    language: 'English',
    rating: 'PG-13',
    price: 15.99,
    showTimes: ['11:30 AM', '2:30 PM', '6:30 PM', '9:30 PM'],
    availableSeats: 100
  },
  {
    _id: '68750a5d92525e896adc217f',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    duration: 180,
    genre: 'Biography/Drama',
    language: 'English',
    rating: 'R',
    price: 16.99,
    showTimes: ['2:00 PM', '6:00 PM', '10:00 PM'],
    availableSeats: 100
  },
  {
    _id: '68750a5d92525e896adc2182',
    title: 'Spider-Man: No Way Home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    duration: 148,
    genre: 'Action/Adventure',
    language: 'English',
    rating: 'PG-13',
    price: 14.99,
    showTimes: ['12:00 PM', '4:00 PM', '8:00 PM'],
    availableSeats: 100
  },
  {
    _id: '68750a5d92525e896adc2185',
    title: 'The Batman',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    image: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    duration: 176,
    genre: 'Action/Crime',
    language: 'English',
    rating: 'PG-13',
    price: 13.99,
    showTimes: ['1:00 PM', '5:00 PM', '9:00 PM'],
    availableSeats: 100
  }
];

// Use hardcoded API URL for now to avoid env issues
const API_URL = 'https://movieticketbookingsystem-7suc.onrender.com/api';

// Helper function to handle fetch with timeout
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${timeout}ms`)), timeout)
    )
  ]);
};

export async function fetchShows(theaterId = '') {
  try {
    let url = `${API_URL}/shows`;
    
    // Ensure theaterId is a string ID, not an object
    let theaterIdString = '';
    
    if (theaterId) {
      if (typeof theaterId === 'object') {
        // If it's an object, try to extract the _id
        if (theaterId && theaterId._id) {
          theaterIdString = String(theaterId._id).trim();
        } else {
          console.warn('Invalid theater object passed to fetchShows:', theaterId);
          theaterIdString = '';
        }
      } else {
        theaterIdString = String(theaterId).trim();
      }
      
      // Additional validation - check for problematic values
      if (theaterIdString === '[object Object]' || theaterIdString.includes('[object') || theaterIdString === 'undefined' || theaterIdString === 'null') {
        console.warn('Invalid theaterId detected, ignoring:', theaterIdString);
        theaterIdString = '';
      }
    }
      
    if (theaterIdString) {
      url += `?theaterId=${encodeURIComponent(theaterIdString)}`;
    }
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('Failed to fetch shows');
    return await response.json();
  } catch (error) {
    console.error('Using mock data due to error:', error.message);
    return mockShows; // Return mock data if the API call fails
  }
}

// Debug function to log to the console and show an alert
const debugLog = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
  console.log(logMessage);
  // Uncomment the line below to show alerts for debugging
  // alert(logMessage);
};

export async function fetchShow(showId) {
  try {
    // Ensure showId is a string and trim any whitespace
    showId = String(showId).trim();
    debugLog('1. Starting fetchShow with showId:', { showId });
    
    // Hardcode the API URL to ensure it's correct
    const apiBaseUrl = 'https://movieticketbookingsystem-7suc.onrender.com/api';
    const apiUrl = `${apiBaseUrl}/shows/${showId}`;
    debugLog('2. Using API URL:', { apiUrl });
    
    // Try to fetch from API first
    debugLog('3. Trying to fetch from API...');
    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      debugLog('4. Received response status:', { status: response.status });
      
      // If API call is successful, process the response
      if (response.ok) {
        const data = await response.json();
        debugLog('5. Successfully parsed API response:', data);
        
        // Validate the response data
        if (data && typeof data === 'object' && data._id) {
          debugLog('6. Successfully fetched show from API:', { 
            showId: data._id, 
            title: data.title,
            price: data.price
          });
          return data;
        } else {
          debugLog('6. Invalid show data received from API:', data);
          throw new Error('Invalid show data received from API');
        }
      }
      
      // If we get here, the API call failed but didn't throw an error
      let errorMessage = `Server returned ${response.status} status`;
      try {
        const errorData = await response.json();
        debugLog('5. Error response data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        debugLog('5. Could not parse error response:', { error: parseError.message });
      }
      throw new Error(errorMessage);
      
    } catch (apiError) {
      debugLog('4. API fetch error:', { error: apiError.message });
      console.warn('Falling back to mock data due to API error:', apiError.message);
      
      // Only use mock data as a fallback if the API fails
      const mockShow = mockShows.find(show => show._id === showId);
      if (mockShow) {
        debugLog('6. Using mock data as fallback:', { 
          showId: mockShow._id, 
          title: mockShow.title,
          price: mockShow.price
        });
        return mockShow;
      }
      
      // If we have a specific error message, use it
      throw apiError;
    }
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