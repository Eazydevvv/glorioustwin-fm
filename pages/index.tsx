import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  datetime: string;
  image?: string;
  imageUrl?: string;  
}

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState('Loading…')
  const [isDark, setIsDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLiveError, setIsLiveError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const STREAM_URL = 'https://stream.zeno.fm/hnuqg3vbh41tv'
  const META_URL = 'https://stream.zeno.fm/hnuqg3vbh41tv/metadata'

  useEffect(() => {
    let mounted = true
    let retries = 0
    const controller = new AbortController()

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(META_URL, { signal: controller.signal, cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!mounted) return
        const title = (data?.title || data?.now_playing || data?.song || '').trim()
        setNowPlaying(title || 'No track info')
        setIsLiveError(false)
        retries = 0
        setIsLoading(false)
      } catch (err) {
        if (!mounted) return
        retries++
        setIsLiveError(retries > 2)
        setNowPlaying('Unable to fetch track info')
        setIsLoading(false)
      }
    }

    fetchNowPlaying()
    const id = setInterval(fetchNowPlaying, 10000 + Math.round(Math.random() * 1500))
    return () => {
      mounted = false
      controller.abort()
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();
        setLatestNews(data.items.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldDark = stored ? stored === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', shouldDark)
    setIsDark(shouldDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const onListenLive = () => {
    document.getElementById('live-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => audioRef.current?.focus(), 500)
  }

  const toggleMenu = () => setMenuOpen((v) => !v)

  const toInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 3)

  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Head>
        <title>GloriousTwins Radio — Live from Ibadan</title>
        <meta name="description" content="GloriousTwins Radio: uplifting music, inspiring voices, and unforgettable moments. Streaming live from Ibadan, Nigeria." />
        <meta name="theme-color" content={isDark ? '#0f172a' : '#059669'} />
        <meta property="og:title" content="GloriousTwins Radio" />
        <meta property="og:description" content={`Now Playing: ${nowPlaying}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/presenters/logo.jpg" />
        <link rel="preconnect" href="https://stream.zeno.fm" />
      </Head>

      <nav className="bg-white dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/60 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/presenters/logo.jpg"
                alt="GloriousTwins Logo"
                className="rounded-full shadow-md object-cover"
                fill
                priority
                sizes="48px"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              <span className="text-emerald-600">GloriousTwins</span> Radio
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">Home</Link>
            <Link href="/schedule" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">Schedule</Link>
            <Link href="#team" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">DJs</Link>
            <Link href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">Contact</Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">About</Link>
            <Link href="/news" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">News</Link>
            <Link href="/podcasts" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium">Podcasts</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden md:inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={onListenLive}
              className="hidden md:inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              Listen Live
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden text-3xl leading-none text-black dark:text-white focus:outline-none"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="md:hidden px-4 pb-3 animate-in fade-in zoom-in-95 duration-150 origin-top">
            <div className="mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2">
              <Link href="/" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Home</Link>
              <Link href="/schedule" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Schedule</Link>
              <Link href="#team" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">DJs</Link>
              <Link href="#contact" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Contact</Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">About</Link>
              <Link href="/news" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">News</Link>
              <Link href="/podcasts" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Podcasts</Link>
              <div className="px-4 pt-2 flex items-center justify-between">
                <button onClick={toggleTheme} className="text-sm underline">{isDark ? 'Use light theme' : 'Use dark theme'}</button>
                <button onClick={onListenLive} className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-full">Listen</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative py-20 bg-[url('/studio-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Welcome to <span className="text-emerald-400">GloriousTwins Radio</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Tune in to the heartbeat of Ibadan — your ultimate source for uplifting music, inspiring voices, and unforgettable moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="inline-flex flex-wrap gap-4 justify-center"
          >
            <button onClick={onListenLive} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg">
              Tune In Now
            </button>
            <Link href="/podcasts" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-colors backdrop-blur-sm">
              Listen to Podcasts
            </Link>
          </motion.div>
        </div>
      </div>

      <div id="live-player" className="max-w-4xl mx-auto px-4 -mt-12 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Live Broadcast</h3>
                <p className="text-gray-600 dark:text-gray-300 truncate">
                  Now Playing: <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {nowPlaying}
                  </span>
                </p>
                {isLiveError && (
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Having trouble fetching track info. Stream still plays fine.</p>
                )}

                <div className="mt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {isPlaying ? 'Live Now' : 'Paused'}
                    </span>
                  </div>

                  <audio
                    ref={audioRef}
                    controls
                    className="w-full outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                    src={STREAM_URL}
                    preload="none"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setIsLiveError(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Frequency: 000.0FM • Ibadan</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">LIVE</span>
                <button
                  onClick={() => navigator.clipboard.writeText(STREAM_URL)}
                  className="text-xs underline hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title="Copy stream URL"
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Podcasts Teaser Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Featured Podcasts</h2>
            <p className="text-gray-600 dark:text-gray-300">Discover our latest episodes and exclusive content</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Podcast teaser cards would go here */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎙️</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Exciting podcasts are on the way</p>
              <Link href="/podcasts" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
                Explore Podcasts →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Exclusive Interviews</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Listen to special guest conversations</p>
              <Link href="/podcasts" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
                Listen Now →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Best Of</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Catch up on popular episodes</p>
              <Link href="/podcasts" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
                Browse All →
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/podcasts" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium">
              View All Podcasts
            </Link>
          </div>
        </div>
      </section>

      {/* Rest of your existing code (News, Schedule, Team sections) remains the same */}
      {/* I've kept your original structure but added a podcasts teaser section */}

      {/* News Section with fixed image loading */}
      {latestNews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Latest News</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay updated with the latest happenings at GloriousTwin FM
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((news, index) => (
              <motion.article
                key={news._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {news.imageUrl && (
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {!news.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">📰</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {news.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-2 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>By {news.author}</span>
                    <span>{new Date(news.datetime).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/news/${news._id}`}
                    className="mt-4 inline-block text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-colors"
            >
              View All News
              <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      )}

<footer id="contact" className="bg-gray-900 text-white py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div id="team" className="max-w-7xl mx-auto px-4 py-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Meet Our Team
            </motion.h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[
                { name: 'Olalere Taiwo', image: '/presenters/taiwo.jpg', role: 'Chairman', bio: '' },
                { name: 'Temitope Raifu', image: '/presenters/prep2.jpg', role: 'OAP', bio: 'Meet Temitope Raifu, popularly know as LONGSTORY. As editor and a presenter at Glorious Twins Radio Ibadan. Born and raise in ondo state ikare Akoko. Im here to give the best' },
                { name: 'Oloyode Abolaji Faruq', image: '/presenters/prep3.jpg', role: 'Manager/OAP', bio: 'Meet Oloyede Abolaji Faruq, popularly know as AWIYE EDE. The manager of Glorious Twins Radio, Ibadan. Born and raised in Ibadan, Oyo State, he attended Aunty Ayo Secondary School in the Olunde area and later studied Mass Communication at The Polytechnic, Ibadan. He\'s here to keep you inspired and entertained with unending vibes.' },
              ].map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{p.name}</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-3">{p.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{p.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="text-lg text-gray-300 italic">
              "At GloriousTwin FM, we go beyond just radio — we are a voice for the people, a hub for inspiration,
              and a celebration of culture, faith, and creativity. From heartwarming music to powerful conversations,
              we connect our community with purpose, passion, and excellence."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Connect With Us</h3>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: '🐦', href: '#' },
                  { name: 'Facebook', icon: '👍', href: '#' },
                  { name: 'TikTok', icon: '🎵', href: '#' },
                  { name: 'Instagram', icon: '📷', href: '#' },
                  { name: 'YouTube', icon: '▶️', href: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

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

            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Contact</h3>
              <address className="not-italic text-gray-300 space-y-2">
                <p>📍 Block B, Shop 19, Bashorun Islamic Ultra-Modern Complex, Ibadan, Oyo State, Nigeria</p>
                <p>📞 +234 803 460 1101 , +234 915 987 9319</p>
                <p>⏰ Station operations: 5AM - 12AM daily</p>
                <p>✉️ glorioustwinsradio@gmail.com</p>
              </address>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400"
          >
            <p>© {year} GloriousTwins Radio | All Rights Reserved</p>
          </motion.div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 bg-emerald-700 text-white flex items-center justify-between px-4 py-3 md:hidden z-50 shadow-lg">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold leading-none">🎧 GT Radio Live</span>
          <span className="text-xs text-white/80 truncate" title={nowPlaying}>{nowPlaying}</span>
        </div>
        <audio ref={audioRef} controls className="h-8" src={STREAM_URL} preload="none" />
      </div> 

    </div>
  )
}