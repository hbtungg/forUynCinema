import { 
  getMovies, 
  getMoviesByCountry, 
  getMoviesByCategory 
} from '@/lib/movies';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  // 🚀 ĐÃ SỬA CỰC CHUẨN: Bỏ hàm fetch thủ công, dùng trực tiếp Helper từ lib/movies
  // Các hàm này tự phân tách môi trường: Server gọi thẳng API gốc, Client đi qua Proxy, bất tử 100%
  const [allMovies, koreaMovies, actionMovies, chinaMovies, animeMovies] =
    await Promise.all([
      getMovies(1).then((d) => d?.items || []),
      getMoviesByCountry('han-quoc', 1).then((d) => d?.items || []),
      getMoviesByCategory('hanh-dong', 1).then((d) => d?.items || []),
      getMoviesByCountry('trung-quoc', 1).then((d) => d?.items || []),
      getMoviesByCategory('hoat-hinh', 1).then((d) => d?.items || []),
    ]);

  const topRated = allMovies.slice(0, 5).map((m, i) => ({
    ...m,
    fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i],
  }));
  const continueItems = allMovies.slice(5, 8);

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