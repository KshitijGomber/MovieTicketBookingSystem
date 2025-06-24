// Mock data for shows
export const mockShows = [
  {
    id: '1',
    movie: 'Inception',
    time: '7:00 PM',
    availableSeats: 30,
  },
  {
    id: '2',
    movie: 'Interstellar',
    time: '9:00 PM',
    availableSeats: 0,
  },
  {
    id: '3',
    movie: 'The Dark Knight',
    time: '6:00 PM',
    availableSeats: 12,
  },
];

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchShows() {
  const res = await fetch(`${API_URL}/shows`);
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
}

export async function fetchShow(showId) {
  const res = await fetch(`${API_URL}/shows/${showId}`);
  if (!res.ok) throw new Error('Failed to fetch show');
  return res.json();
} 