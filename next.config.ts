import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'mysql2'],
  },
  // Disable strict mode to avoid double rendering in development
  reactStrictMode: false,
};