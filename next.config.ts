import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.kotsu.city.nagoya.jp',
        port: '',
        pathname: '/jp/pc/subway/images/**',
      },
    ],
  },
};

export default nextConfig;
