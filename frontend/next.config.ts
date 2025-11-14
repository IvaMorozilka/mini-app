import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || '';
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Only enable static export when STATIC_EXPORT=true (for deploy branch)
  ...(isStaticExport && { output: 'export' }),
  // Only set basePath and assetPrefix when BASE_PATH is provided (for GitHub Pages)
  ...(basePath && {
    basePath: basePath,
    assetPrefix: basePath,
  }),
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
