/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mosaic-hrd.org',
      },
      {
        protocol: 'https',
        hostname: 'app.mosaic-hrd.org',
      },
    ],
  },
  // Avoid webpack pack cache rename errors on Windows (ENOENT when renaming .pack.gz_ -> .pack.gz)
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
