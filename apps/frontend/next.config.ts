import type { NextConfig } from "next";
import { env } from "./src/lib/env";

// Bundle analyzer plugin
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.yohangel.com/tasks'],
    formats: ['image/avif', 'image/webp'],
  },
  // App Router includes internationalization by default
  // Configure in middleware.ts instead of here
  compiler: {
    // Remove console.log in production
    removeConsole: env.isProduction ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable compression
  compress: true,
  // Configure build output
  output: 'standalone',
  // Configure powered by header
  poweredByHeader: false,
};

// Apply bundle analyzer wrapper
export default withBundleAnalyzer(nextConfig);
