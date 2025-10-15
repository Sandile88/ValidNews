import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@coinbase/onchainkit"],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

     config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,

    };

    return config;
  },
};

export default nextConfig;
