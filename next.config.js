/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını build sırasında görmezden gel
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını build sırasında görmezden gel
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com https://youtube.com",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 