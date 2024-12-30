import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      "mostaql.hsoubcdn.com",
      "encrypted-tbn0.gstatic.com",
      "cdn-icons-png.flaticon.com",
    ],
  },
};

export default nextConfig;
