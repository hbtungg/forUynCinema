import { getMovies } from '@/lib/movies';
import HomePageClient from './HomePageClient';

// 🚀 ĐÃ SỬA: Đồng bộ gọi qua Proxy nội bộ /api-nguonc để cứu toàn bộ khay phim Hàn, Trung, Hành Động... khỏi tường lửa
async function getMoviesBySlug(path) {
  try {
    // Tự động nhận diện môi trường để gọi đúng cổng Proxy nội bộ
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api-nguonc/films/${path}?page=1`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error(`Lỗi fetch proxy tại danh mục ${path}:`, error);
    return [];
  }
}

export default async function HomePage() {
  // Dữ liệu cào song song cực nhanh từ API Máy Chủ gốc
  const [allMovies, koreaMovies, actionMovies, chinaMovies, animeMovies] =
    await Promise.all([
      getMovies(1).then((d) => d?.items || []),
      getMoviesBySlug('quoc-gia/han-quoc'),
      getMoviesBySlug('the-loai/hanh-dong'),
      getMoviesBySlug('quoc-gia/trung-quoc'),
      getMoviesBySlug('the-loai/hoat-hinh'),
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