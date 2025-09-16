// services/newsService.ts
import { API_URL, authHeaders } from '../utils/api';

export interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  datetime: string;
  image?: string;
  imageUrl?: string; // Make sure this is included
}
export const newsService = {
  // Get all news (public)
  getAllNews: async (): Promise<{ items: News[] }> => {
    const response = await fetch(`${API_URL}/api/news`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },

  // Get single news by ID (public)
  getNews: async (id: string): Promise<News> => {
    const response = await fetch(`${API_URL}/api/news/${id}`);
    if (!response.ok) throw new Error('Failed to fetch news item');
    return response.json();
  },

  // Create news (admin only)
  createNews: async (newsData: Omit<News, '_id' | 'datetime'>): Promise<News> => {
    console.log('Sending news data:', newsData);
    console.log('Auth headers:', authHeaders());
  
    const response = await fetch(`${API_URL}/api/news`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
      },
      body: JSON.stringify(newsData),
    });
    console.log('Response status:', response.status);
    
    if (!response.ok) throw new Error('Failed to create news');
    return response.json();
  },

  // Update news (admin only)
  updateNews: async (id: string, newsData: Partial<News>): Promise<News> => {
    const response = await fetch(`${API_URL}/api/news/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(newsData),
    });
    
    if (!response.ok) throw new Error('Failed to update news');
    return response.json();
  },

  // Delete news (admin only)
  deleteNews: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/news/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to delete news');
  },
};