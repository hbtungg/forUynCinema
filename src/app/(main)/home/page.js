import HomePageClient from './HomePageClient';

export const metadata = {
  title: 'Trang chủ',
  description: 'Khám phá phim mới cập nhật, phim Hàn Quốc và phim hoạt hình trên Uynflix.',
  alternates: { canonical: '/home' },
};

export default function HomePage() {
  return <HomePageClient />;
}
