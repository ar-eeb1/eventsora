/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/shop-site/shop',
          has: [{ type: 'host', value: 'shop.eventsora.com' }]
        }
      ]
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: ''
      }
    ]
  },
};

export default nextConfig;
