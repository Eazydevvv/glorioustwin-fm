/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'glorious-twins-backend.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.glorioustwinsradio.com.ng',
        pathname: '/**',
      },
    ],
  },
  // Remove the deprecated 'domains' option
}

module.exports = nextConfig;