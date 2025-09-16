/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'www.glorioustwinsradio.com.ng', 'www.glorioustwinsradio.com.ng'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yourdomain.com',
        pathname: '/uploads/**',
      },
    ],
  }
}

module.exports = nextConfig