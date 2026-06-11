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
};

export default nextConfig;