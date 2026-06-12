'use client';

import { useState, useEffect } from 'react';
// 🚀 ĐÃ SỬA: Chuyển sang dùng file clientMovies sạch, giải quyết triệt để lỗi import Node.js ngầm
import { getMovies, getMoviesByCountry, getMoviesByCategory } from '@/lib/clientMovies';
import HomePageClient from './HomePageClient';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const CACHE_KEY = 'foruyn_home_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

const genres = [
  { label: 'Hành động',  icon: '⚔️', href: '/danh-sach?type=hanh-dong' },
  { label: 'Kinh dị',    icon: '👁️', href: '/danh-sach?type=kinh-di' },
  { label: 'Tâm lý',     icon: '🧠', href: '/danh-sach?type=tam-ly' },
  { label: 'Viễn tưởng', icon: '🚀', href: '/danh-sach?type=vien-tuong' },
  { label: 'Hình sự',    icon: '🔍', href: '/danh-sach?type=hinh-su' },
  { label: 'Tình cảm',   icon: '💫', href: '/danh-sach?type=tinh-cam' },
  { label: 'Hoạt hình',  icon: '🎨', href: '/danh-sach?type=hoat-hinh' },
  { label: 'Tài liệu',   icon: '📽️', href: '/danh-sach?type=tai-lieu' },
];

const EMPTY_DATA = {
  allMovies: [], koreaMovies: [], actionMovies: [],
  chinaMovies: [], animeMovies: [], topRated: [], continueItems: []
};

// Skeleton trang chủ — hiện ngay lập tức, không chờ fetch
function HomeSkeleton() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0c] text-white overflow-hidden">
      <Header sidebarCollapsed={true} onToggleSidebar={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={true} />
        <div className="flex-1 flex flex-row min-w-0 h-full overflow-hidden">
          <div className="flex-1 min-w-0 h-full overflow-y-auto pb-20">
            <div className="w-full aspect-[21/9] bg-[#111115] animate-pulse" />
            <div className="px-5 xl:px-8 py-6 space-y-8">
              {Array.from({ length: 4 }).map((_, si) => (
                <div key={si} className="space-y-3">
                  <div className="h-5 w-40 bg-[#111115] rounded-lg animate-pulse" />
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="w-full aspect-[2/3] bg-[#111115] rounded-xl animate-pulse" />
                        <div className="h-3 w-3/4 bg-[#111115] rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden xl:flex flex-col w-[300px] h-full bg-[#0d0d10] border-l border-white/5 p-4 gap-4 overflow-hidden">
            <div className="h-5 w-32 bg-[#111115] rounded animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-16 h-10 bg-[#111115] rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-full bg-[#111115] rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-[#111115] rounded animate-pulse" />
                </div>
              </div>
            ))}
            <div className="h-5 w-32 bg-[#111115] rounded animate-pulse mt-2" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 bg-[#111115] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ép đổi tên tiêu đề tab động chuẩn chỉnh ngay khi người dùng về Trang Chủ
    document.title = "forUyn Cinema 🍿 - Rạp phim bất tử cho hai vợ chồng";

    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { ts, payload } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL) {
          setData(payload);
          setLoading(false);
          return; 
        }
      }
    } catch (_) {}

    async function fetchAllMovies() {
      try {
        // TỐI ƯU LUỒNG: Gọi trước API danh sách tổng để lấp đầy phần giao diện chính trước
        const resAll = await getMovies(1);
        const all = resAll?.items || [];

        // Sau đó chạy ngầm song song các danh mục phụ, tránh dồn 5 request làm giật mình Server NguồnC
        const [resKorea, resAction, resChina, resAnime] = await Promise.all([
          getMoviesByCountry('han-quoc', 1),
          getMoviesByCategory('hanh-dong', 1),
          getMoviesByCountry('trung-quoc', 1),
          getMoviesByCategory('hoat-hinh', 1),
        ]);

        const payload = {
          allMovies: all,
          koreaMovies: resKorea?.items || [],
          actionMovies: resAction?.items || [],
          chinaMovies: resChina?.items || [],
          animeMovies: resAnime?.items || [],
          topRated: all.slice(0, 5).map((m, i) => ({
            ...m,
            fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i],
          })),
          continueItems: all.slice(5, 8),
        };

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload }));
        } catch (_) {}

        setData(payload);
      } catch (err) {
        console.error("Lỗi fetch phim trang chủ:", err);
        setData(EMPTY_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchAllMovies();
  }, []);

  if (loading || !data) return <HomeSkeleton />;

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