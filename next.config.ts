import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  serverExternalPackages: ['sequelize', 'sequelize-typescript', 'mysql2', 'mysql', 'mongodb', 'mongoose'],
  // experimental: {
  //   serverComponentsExternalPackages: ['sequelize', 'sequelize-typescript'],
  // },
  // Disable strict mode to avoid double rendering in development
  reactStrictMode: false,
  // instrumentationHook: true
};

export default nextConfig
