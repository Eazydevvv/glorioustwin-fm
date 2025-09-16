// pages/news.tsx
import { useEffect, useState } from 'react';
import { newsService, News } from '../services/newsService';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAllNews();
        setNews(data.items);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="p-6">Loading news...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>
      
      <div className="space-y-6">
        {news.map((item) => (
          <article key={item._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 mb-3">{item.summary}</p>
            <div className="text-gray-700 mb-4">{item.content}</div>
            <div className="text-sm text-gray-500">
              By {item.author} • {new Date(item.datetime).toLocaleDateString()} • {item.category}
            </div>
          </article>
        ))}
        
        {news.length === 0 && (
          <p className="text-center text-gray-500">No news articles yet.</p>
        )}
      </div>
    </div>
  );
}