import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.sumerlabs.com",
      },
      {
        protocol: "https",
        hostname: "sumerlabs.com",
      },
      {
        protocol: "https",
        hostname: "**.domun.co",
      },
      {
        protocol: "https",
        hostname: "domun.co",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "soaresdevelopers.com",
      },
      {
        protocol: "https",
        hostname: "**.vercatalogo.com",
      },
      {
        protocol: "https",
        hostname: "vercatalogo.com",
      },
      {
        protocol: "https",
        hostname: "fimgs.net",
      },
      {
        protocol: "https",
        hostname: "**.parfumo.com",
      },
    ],
  },
};

export default nextConfig;
