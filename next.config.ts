
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/coming-soon',
        permanent: false,
      },
      {
        source: '/school',
        destination: '/coming-soon',
        permanent: false,
      },
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
        source: '/join/staff',
        destination: '/join/team',
        permanent: true,
      },
      {
        source: '/admin731/id-system',
        destination: '/admin731/create-member',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
