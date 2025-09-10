
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
       {
        source: '/school/:path*',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/map',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/community/suggest',
        destination: '/coming-soon',
        permanent: false,
      },
       {
        source: '/community',
        destination: '/coming-soon',
        permanent: false,
      },
       {
        source: '/search',
        destination: '/coming-soon',
        permanent: false,
      },
       {
        source: '/discover',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/projects',
        destination: '/coming-soon',
        permanent: false,
      },
        {
        source: '/impact',
        destination: '/coming-soon',
        permanent: false,
      },
       {
        source: '/programs',
        destination: '/coming-soon',
        permanent: false,
      },
       {
        source: '/login',
        destination: '/join',
        permanent: false,
      },
      {
        source: '/sys-bridge',
        destination: '/join',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
