import { getMovies } from '@/lib/movies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HistoryPopup from '@/components/HistoryPopup';
import ContinueWatching from '@/components/ContinueWatching';
import FavoriteList from '@/components/FavoriteList';
import SecretChat from '@/components/SecretChat';
import LoveGallery from '@/components/LoveGallery';
import HeroSlider from '@/components/HeroSlider';
import MovieSection from '@/components/MovieSection';

async function getMoviesBySlug(path) {
  try {
    // Tăng page_size hoặc lấy nhiều phim hơn để slider hoạt động
    const res = await fetch(`https://phim.nguonc.com/api/films/${path}?page=1`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.items || [];
  } catch (error) { return []; }
}

export default async function HomePage() {
  const [allMovies, koreaMovies, actionMovies, chinaMovies, animeMovies] = await Promise.all([
    getMovies(1).then(d => d?.items || []),
    getMoviesBySlug('quoc-gia/han-quoc'),
    getMoviesBySlug('the-loai/hanh-dong'),
    getMoviesBySlug('quoc-gia/trung-quoc'),
    getMoviesBySlug('the-loai/hoat-hinh')
  ]);

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
      <Header />

      <div className="mt-20 relative z-0">
        <HeroSlider movies={allMovies} />
      </div>

      {/* GIẢM space-y-24 xuống space-y-8 để cực kỳ khít */}
      <div className="relative z-10 p-4 md:p-10 space-y-8 pt-6">
        
        {/* <ContinueWatching />
        <FavoriteList /> */}

        {/* Danh sách các Section phim */}
        <div className="space-y-6"> {/* Khoảng cách cực nhỏ giữa các hàng */}
            <MovieSection title="Phim Đang Chiếu" movies={allMovies.slice(0, 12)} viewAllLink="/danh-sach?type=phim-moi-cap-nhat" />
            <MovieSection title="Phim Hàn Quốc" movies={koreaMovies.slice(0, 12)} viewAllLink="/danh-sach?type=han-quoc" />
            <MovieSection title="Phim Hành Động" movies={actionMovies.slice(0, 12)} viewAllLink="/danh-sach?type=hanh-dong" />
            <MovieSection title="Phim Trung Quốc" movies={chinaMovies.slice(0, 12)} viewAllLink="/danh-sach?type=trung-quoc" />
            <MovieSection title="Phim Hoạt Hình" movies={animeMovies.slice(0, 12)} viewAllLink="/danh-sach?type=hoat-hinh" />
        </div>

        <div className="pt-10">
          {/* <LoveGallery /> */}
          <HistoryPopup />
          <SecretChat />
          <Footer />
        </div>
      </div>
    </main>
  );
}