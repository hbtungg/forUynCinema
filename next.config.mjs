/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Khi Browser gọi đến /api-nguonc, Next.js sẽ chuyển tiếp thẳng sang NguồnC mà không qua bộ lọc chặn IP của Server
        source: '/api-nguonc/:path*',
        destination: 'https://phim.nguonc.com/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.fdad3-1.fna.fbcdn.net',
        pathname: '/**', // Cho phép tất cả các thư mục con bên trong
      },
      {
        protocol: 'https',
        hostname: 'scontent.fdad3-8.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;