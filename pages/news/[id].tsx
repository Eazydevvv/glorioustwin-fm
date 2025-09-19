import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  datetime: string;
  imageUrl?: string;
}

export default function NewsArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle(id as string);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!article) {
    return <div className="min-h-screen flex items-center justify-center">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>{article.title} - GloriousTwins Radio</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/news" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
          ← Back to News
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {article.imageUrl && (
            <div className="relative h-64 md:h-96">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm">
                {article.category}
              </span>
              <time className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(article.datetime).toLocaleDateString()}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {article.summary}
            </p>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {article.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Published by <span className="font-semibold">{article.author}</span>
              </p>
            </div>
          </div>
        </article>
<div className="flex gap-4 mt-6">
  {/* WhatsApp Share */}
  <a
    href={`https://wa.me/?text=Check out this news: ${window.location.href}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
  >
    📱 Share on WhatsApp
  </a>

  {/* Facebook Share */}
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
  >
    📘 Share on Facebook
  </a>

  {/* Twitter Share */}
  <a
    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this news`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full"
  >
    🐦 Share on Twitter
  </a>
</div>
      </div>
      
    </div>
  );
}