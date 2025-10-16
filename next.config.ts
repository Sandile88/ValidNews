import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@coinbase/onchainkit"],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  eslint: {
    // Warning: This allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
