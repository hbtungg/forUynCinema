import { getMovies } from '@/lib/movies';
import HomePageClient from './HomePageClient';

// Hàm bốc dữ liệu có màng lọc chặn HTML rác từ Server Vercel
async function getMoviesBySlug(path) {
  try {
    const res = await fetch(`https://phim.nguonc.com/api/films/${path}?page=1`, {
      next: { revalidate: 3600 },
    });
    
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      return []; // Trả về mảng rỗng nếu Server Vercel bị chặn nhận về HTML rác
    }
    
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Dữ liệu cào song song cực nhanh từ API Máy Chủ gốc
  const [allMovies, koreaMovies, actionMovies, chinaMovies, animeMovies] =
    await Promise.all([
      getMovies(1).then((d) => d?.items || []).catch(() => []),
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
    { label: 'Kinh dị',    icon: '👁️', href: '/danh-sach?type=kinh-di' },
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