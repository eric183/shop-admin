/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    serverActions: true,
  },
};

module.exports = nextConfig;
