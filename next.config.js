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
    // Development ve production için farklı origin'ler
    const allowedOrigins = process.env.NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://localhost']
      : [process.env.NEXT_PUBLIC_SITE_URL || 'https://feray-test.vercel.app']

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com https://recaptcha.google.com",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(', '),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 