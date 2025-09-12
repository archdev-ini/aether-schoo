import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  srcDir: 'src',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
    ],
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
