import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@coinbase/onchainkit"],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

     config.resolve.fallback = {
      ...config.resolve.fallback,
      "react-native": false,
    };

    return config;
  },
};

export default nextConfig;
