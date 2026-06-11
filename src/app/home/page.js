'use client';

import { useState, useEffect } from 'react';
import { getMovies, getMoviesByCountry, getMoviesByCategory } from '@/lib/movies';
import HomePageClient from './HomePageClient';

export default function HomePage() {
  const [data, setData] = useState({
    allMovies: [],
    koreaMovies: [],
    actionMovies: [],
    chinaMovies: [],
    animeMovies: [],
    topRated: [],
    continueItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllMovies() {
      try {
        // 🚀 BƯỚC NGOẶT CHÍ MẠNG: Trình duyệt chạy mạng cá nhân tự fetch song song qua cổng Proxy ngầm
        // Bypass hoàn toàn màng lọc IP của Server Vercel/Netlify
        const [resAll, resKorea, resAction, resChina, resAnime] = await Promise.all([
          getMovies(1),
          getMoviesByCountry('han-quoc', 1),
          getMoviesByCategory('hanh-dong', 1),
          getMoviesByCountry('trung-quoc', 1),
          getMoviesByCategory('hoat-hinh', 1)
        ]);

        const all = resAll?.items || [];
        const topRatedMapped = all.slice(0, 5).map((m, i) => ({
          ...m,
          fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i],
        }));

        setData({
          allMovies: all,
          koreaMovies: resKorea?.items || [],
          actionMovies: resAction?.items || [],
          chinaMovies: resChina?.items || [],
          animeMovies: resAnime?.items || [],
          topRated: topRatedMapped,
          continueItems: all.slice(5, 8)
        });
      } catch (err) {
        console.error("Lỗi fetch phim tại Client qua Proxy:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllMovies();
  }, []);

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

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] flex items-center justify-center text-red-500 font-bold tracking-widest animate-pulse">
        ĐANG KHỞI CHẠY RẠP PHIM... ❤️
      </div>
    );
  }

  return (
    <HomePageClient
      allMovies={data.allMovies}
      koreaMovies={data.koreaMovies}
      actionMovies={data.actionMovies}
      chinaMovies={data.chinaMovies}
      animeMovies={data.animeMovies}
      topRated={data.topRated}
      continueItems={data.continueItems}
      genres={genres}
    />
  );
}