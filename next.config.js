/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.sanity.io"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    serverActions: true,
  },
};

module.exports = nextConfig;
