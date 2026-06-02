import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-preview",
        destination: "/ai-assistant",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
