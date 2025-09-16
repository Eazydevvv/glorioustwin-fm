"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../../utils/api";
import Link from "next/link";

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

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/podcasts`);
      const data = await response.json();
      
      if (response.ok) {
        setPodcasts(data.data || []);
      } else {
        setError(data.message || "Failed to fetch podcasts");
      }
    } catch (error) {
      setError("Network error - could not fetch podcasts");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (podcastId: string, audioUrl: string) => {
    const audioElement = document.getElementById(`audio-${podcastId}`) as HTMLAudioElement;
    
    if (!audioElement) return;

    if (playingAudio === podcastId) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement;
        if (currentAudio) currentAudio.pause();
      }
      
      audioElement.play();
      setPlayingAudio(podcastId);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading podcasts...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <button 
          onClick={fetchPodcasts}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GloriousTwin FM Podcasts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Listen to our latest episodes, interviews, and exclusive content
          </p>
        </div>

        {/* Podcasts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <div
                key={podcast._id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden group"
              >
                {/* Image */}
                {podcast.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {podcast.duration}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <span className="text-sm text-emerald-600 font-medium mb-2 block">
                    {podcast.category}
                  </span>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {podcast.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {podcast.description}
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Hosted by <span className="font-medium">{podcast.host}</span>
                  </p>

                  {/* Audio Player */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePlayPause(podcast._id, podcast.audioUrl)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        playingAudio === podcast._id
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {playingAudio === podcast._id ? (
                        <>
                          <span>⏸️</span>
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <span>▶️</span>
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-gray-500">
                      {new Date(podcast.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    id={`audio-${podcast._id}`}
                    onEnded={() => setPlayingAudio(null)}
                    onPause={() => setPlayingAudio(null)}
                  >
                    <source src={podcast.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎙️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Podcasts Yet
              </h3>
              <p className="text-gray-600">
                Check back later for new episodes
              </p>
              <Link
                href="/Admin/UploadPodcast"
                className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Upload First Podcast
              </Link>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {podcasts.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Podcast Library
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{podcasts.length}</div>
                  <div className="text-sm text-gray-600">Total Episodes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(podcasts.reduce((acc, p) => acc + parseInt(p.duration) || 0, 0) / 60)}
                  </div>
                  <div className="text-sm text-gray-600">Hours of Content</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {new Set(podcasts.map(p => p.host)).size}
                  </div>
                  <div className="text-sm text-gray-600">Featured Hosts</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}