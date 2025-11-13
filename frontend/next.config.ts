import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Uncomment and update if your repository name is not the root
  // basePath: '/mini-app-svo',
  // assetPrefix: '/mini-app-svo',
  trailingSlash: false,
};

export default nextConfig;
