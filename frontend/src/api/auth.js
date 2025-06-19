const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function signup({ name, email, password }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
  return res.json();
}

export async function signin({ email, password }) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Signin failed');
  return res.json();
}

export function getGoogleAuthUrl() {
  return `${API_URL}/auth/google`;
} 