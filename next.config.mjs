/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // GitHub Pages için base path (repository adınızla değiştirin)
  // basePath: '/repository-name',
  // assetPrefix: '/repository-name/',
}

export default nextConfig
