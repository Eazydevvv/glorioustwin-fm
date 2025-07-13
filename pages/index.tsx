// pages/index.tsx
import Image from 'next/image';

import { useEffect, useState } from 'react';


export default function Home() {
  const [nowPlaying, setNowPlaying] = useState("Loading...");


  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("https://stream.zeno.fm/hnuqg3vbh41tv/metadata");
        const data = await res.json();
        setNowPlaying(data?.title || "No track info");
      } catch (err) {
        setNowPlaying("Unable to fetch track info");
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">

      {/* Premium Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">GT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-emerald-600">GloriousTwins</span> Radio
            </h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-emerald-600 font-medium">Home</a>
            <a href="/schedule" className="text-gray-700 hover:text-emerald-600 font-medium">Schedule</a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">DJs</a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Contact</a>

          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
            Listen Live
          </button>
          <div className="ml-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">🌙</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={() => {
                  const html = document.documentElement;
                  const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
                  html.classList.toggle('dark');
                  localStorage.setItem('theme', newTheme);
                  setIsDark(newTheme === 'dark');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-300">
                <div className="w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
              </div>
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-300">☀️</span>
          </div>



        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 bg-[url('/studio-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-emerald-400">GloriousTwins Radio</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tune in to the heartbeat of Ibadan — your ultimate source for uplifting music, inspiring voices, and unforgettable moments.
          </p>

          <div className="inline-flex space-x-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg">
              Tune In Now
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors backdrop-blur-sm">
              Meet The Team
            </button>
          </div>
        </div>
      </div>

      {/* Live Player Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 hidden md:block">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Live Broadcast</h3>
                <p className="text-gray-600">
                  Now Playing: <span className="text-emerald-600 font-medium">{nowPlaying}</span>
                </p>

                <audio controls className="w-full mt-3" src="https://stream.zeno.fm/hnuqg3vbh41tv" />

              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Frequency: 000.0FM • Ibadan</span>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">Today's Schedule</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { time: '6:00 AM', title: 'Morning Vibes', host: 'DJ Dad' },
            { time: '10:00 AM', title: 'Midday Mix', host: 'Auntie B' },
            { time: '3:00 PM', title: 'Afternoon Delight', host: 'Uncle T' }
          ].map((show, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-2">
                      {show.time}
                    </span>
                    <h4 className="text-lg font-bold text-gray-800">{show.title}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {show.host.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <p className="mt-3 text-gray-600">With {show.host}</p>
                <button className="mt-4 text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center">
                  Set Reminder
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Meet the Presenters Section */}
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              🎙️ Meet Our Presenters
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[
                { name: 'Ilesanmi Victoria', image: '/presenters/victoria.jpg' },
                { name: 'Olalere Taiwo', image: '/presenters/taiwo.jpg' },
              ].map((presenter, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={presenter.image}
                    alt={presenter.name}
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                  <div className="p-6 text-center">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{presenter.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">On-Air Personality</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Mission Statement */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-300 italic">
              "At GloriousTwin FM, we go beyond just radio  we are a voice for the people, a hub for inspiration,
              and a celebration of culture, faith, and creativity. From heartwarming music to powerful conversations,
              we connect our community with purpose, passion, and excellence."
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Connect With Us</h3>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'Facebook', icon: '👍' },
                  { name: 'TikTok', icon: '🎵' },
                  { name: 'Instagram', icon: '📷' },
                  { name: 'YouTube', icon: '▶️' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Quick Links</h3>
              <ul className="space-y-2">
                {['About Us', 'Privacy Policy', 'Team of Professionals', 'Contact', 'Download our APP'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white hover:underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Contact</h3>
              <address className="not-italic text-gray-300 space-y-2">
                <p>📍 Block B, Shop 19, Bashorun Islamic Ultra-Modern Complex, Ibadan, Oyo State, Nigeria</p>

                <p>📞 +234  803 460 1101 , +234 915 987 9319 </p>
                <p>⏰ Station operations: 5AM - 12AM daily</p>
                <p>✉️ glorioustwinsmediahub@gmail.com</p>
              </address>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GloriousTwins Radio | All Rights Reserved</p>
          </div>
        </div>
      </footer>
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-700 text-white flex items-center justify-between px-4 py-3 md:hidden z-50 shadow-lg">
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none">🎧 GT Radio Live</span>
          <span className="text-xs text-white/70">{nowPlaying}</span>
        </div>
        <audio controls className="h-8" src="https://stream.zeno.fm/hnuqg3vbh41tv" />
      </div>

    </div>


  );
}