/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        // 🚀 CỔNG PROXY LẬP TỨC THÔNG NÒNG: Đánh lừa tường lửa NguồnC
        // Giúp anh chị xem phim bất tử trên Netlify mà không lo dính lỗi 429
        source: '/api-nguonc/:path*',
        destination: 'https://phim.nguonc.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;