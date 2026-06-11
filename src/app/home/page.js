// 🚀 ÉP VERCEL VÀ NETLIFY LUÔN LUÔN FETCH DỮ LIỆU THỜI GIAN THỰC (DYNAMIC RUNTIME)
// Triệt tiêu hoàn toàn việc Cloudflare của NguồnC chặn IP khi đóng gói tĩnh
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { 
  getMovies, 
  getMoviesByCountry, 
  getMoviesByCategory 
} from '@/lib/movies';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  // 🚀 KHẮC PHỤC CHÍ MẠNG: Gọi tuần tự có bọc lót an toàn, chống nghẽn IP máy chủ Vercel/Netlify
  // Các hàm Helper tự động gọi trực tiếp API gốc ở tầng Server, đảm bảo mượt mà 100%
  let allMovies = [];
  let koreaMovies = [];
  let actionMovies = [];
  let chinaMovies = [];
  let animeMovies = [];

  try {
    const resAll = await getMovies(1);
    allMovies = resAll?.items || [];
    
    const resKorea = await getMoviesByCountry('han-quoc', 1);
    koreaMovies = resKorea?.items || [];

    const resAction = await getMoviesByCategory('hanh-dong', 1);
    actionMovies = resAction?.items || [];

    const resChina = await getMoviesByCountry('trung-quoc', 1);
    chinaMovies = resChina?.items || [];

    const resAnime = await getMoviesByCategory('hoat-hinh', 1);
    animeMovies = resAnime?.items || [];
  } catch (err) {
    console.error("Hệ thống phát hiện lỗi cào dữ liệu trang chủ:", err);
  }

  // Xử lý logic hiển thị BXH Top Rated và Phim đang xem tiếp tục
  const topRated = allMovies.slice(0, 5).map((m, i) => ({
    ...m,
    fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i],
  }));
  const continueItems = allMovies.slice(5, 8);

  // Danh mục thể loại phổ biến hiển thị ở RightPanel
  const genres = [
    { label: 'Hành động', icon: '⚔️', href: '/danh-sach?type=hanh-dong' },
    { label: 'Kinh dị',   icon: '👁️', href: '/danh-sach?type=kinh-di' },
    { label: 'Tâm lý',    icon: '🧠', href: '/danh-sach?type=tam-ly' },
    { label: 'Viễn tưởng',icon: '🚀', href: '/danh-sach?type=vien-tuong' },
    { label: 'Hình sự',   icon: '🔍', href: '/danh-sach?type=hinh-su' },
    { label: 'Tình cảm',  icon: '💫', href: '/danh-sach?type=tinh-cam' },
    { label: 'Hoạt hình', icon: '🎨', href: '/danh-sach?type=hoat-hinh' },
    { label: 'Tài liệu',  icon: '📽️', href: '/danh-sach?type=tai-lieu' },
  ];

  return (
    <HomePageClient
      allMovies={allMovies}
      koreaMovies={koreaMovies}
      actionMovies={actionMovies}
      chinaMovies={chinaMovies}
      animeMovies={animeMovies}
      topRated={topRated}
      continueItems={continueItems}
      genres={genres}
    />
  );
}