// utils/api.ts (frontend)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://glorious-twins-backend.onrender.com';

// Get auth headers with token
// utils/api.ts
export const authHeaders = (): HeadersInit => {  // Add return type
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};