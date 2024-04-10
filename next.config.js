/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['undici'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
