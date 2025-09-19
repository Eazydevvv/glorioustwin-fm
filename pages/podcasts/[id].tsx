import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API_URL } from '../../utils/api';

interface Podcast {
  _id: string;
  title: string;
  description: string;
  host: string;
  duration: string;
  category: string;
  imageUrl?: string;
  audioUrl: string;
  createdAt: string;
}

export default function PodcastPage() {
  const router = useRouter();
  const { id } = router.query;
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // FIXED: useRef instead of useState
  const audioRef = useRef<HTMLAudioElement>(null);

  // FIXED: Proper ref callback
  const setAudioRef = useCallback((element: HTMLAudioElement | null) => {
    audioRef.current = element;
  }, []);

  useEffect(() => {
    if (id) {
      fetchPodcast(id as string);
    }
  }, [id]);

  const fetchPodcast = async (podcastId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/podcasts/${podcastId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch podcast');
      }
      
      const data = await response.json();
      setPodcast(data);
    } catch (error) {
      console.error('Failed to fetch podcast:', error);
      setError('Unable to load podcast');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading podcast...</p>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-4">{error || 'Podcast not found'}</p>
          <button 
            onClick={() => router.push('/podcasts')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Back to Podcasts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>{podcast.title} - GloriousTwin FM Podcasts</title>
        <meta name="description" content={podcast.description} />
      </Head>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/60 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10">
                  <Image
                    src="/presenters/logo.jpg"
                    alt="GloriousTwins Logo"
                    className="rounded-full object-cover"
                    fill
                  />
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">
                  GloriousTwins <span className="text-emerald-600">Podcasts</span>
                </span>
              </Link>
            </div>
            <Link
              href="/podcasts"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              ← Back to All Podcasts
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Podcast Image */}
          {podcast.imageUrl ? (
            <div className="relative h-64 w-full">
              <Image
                src={podcast.imageUrl}
                alt={podcast.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-6xl">🎙️</span>
            </div>
          )}

          {/* Podcast Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-sm px-3 py-1 rounded-full">
                {podcast.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(podcast.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {podcast.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              {podcast.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400">🎧</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hosted by</p>
                <p className="font-medium text-gray-900 dark:text-white">{podcast.host}</p>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <span className="text-white">⏸️</span>
                  ) : (
                    <span className="text-white">▶️</span>
                  )}
                </button>
                <div className="flex-1 mx-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {podcast.duration}
                </span>
              </div>

              {/* FIXED: Audio element with proper ref */}
              <audio
                ref={setAudioRef}
                src={podcast.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this podcast</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  📋 Copy Link
                </button>
                <a
                  href={`https://wa.me/?text=Check out this podcast: ${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  📱 WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this podcast`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} GloriousTwins Radio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}