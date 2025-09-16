// utils/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get auth headers with token
export const authHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Helper for API calls
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};