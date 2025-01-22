/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını build sırasında görmezden gel
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını build sırasında görmezden gel
  },
  reactStrictMode: true,
}

module.exports = nextConfig 