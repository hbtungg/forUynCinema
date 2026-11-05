'use client';

import { useState, useEffect } from 'react';
import { getMovies, getMoviesByCountry, getMoviesByCategory } from '@/lib/clientMovies';
import HomePageClient from './HomePageClient';
import IOSInstallPrompt from '@/components/IOSInstallPrompt';

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

// 🚀 ĐÃ SỬA CHÍ MẠNG: Khung xương cấu trúc 2 cột khớp 100% với HomePageClient để triệt tiêu Hydration Mismatch
function HomeSkeleton() {
  return (
    <div className="w-full flex flex-row min-w-0 min-h-screen select-none font-sans items-start animate-pulse">
      {/* KHỐI TRÁI SKELETON */}
      <div className="flex-1 min-w-0 pb-24">
        <div className="px-5 xl:px-12 pt-4">
          <div className="w-full aspect-[21/9] bg-white/5 rounded-[2rem] midnight-glass" />
        </div>
        <div className="px-5 xl:px-12 py-8 space-y-12">
          {Array.from({ length: 2 }).map((_, si) => (
            <div key={si} className="space-y-4">
              <div className="h-6 w-48 bg-white/10 rounded-md" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-full aspect-[2/3] bg-white/5 rounded-2xl midnight-glass" />
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ASIDE PHẢI SKELETON */}
      <div className="hidden xl:flex flex-col w-[300px] 2xl:w-[320px] flex-shrink-0 my-4 mr-6 rounded-[32px] border border-white/5 bg-white/[0.04] p-5 space-y-6 h-[80vh]">
        <div className="h-5 w-1/2 bg-white/10 rounded" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-5 w-1/2 bg-white/10 rounded pt-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-9 h-12 bg-white/5 rounded-xl shrink-0" />
              <div className="flex-1 h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    allMovies: [], koreaMovies: [], actionMovies: [],
    chinaMovies: [], animeMovies: [], topRated: [], continueItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Uynflix Vietnam - Watch series online, watch films online free";
    setMounted(true);

    // 🚀 ĐÃ SỬA: Kiểm tra Cache an toàn bên trong useEffect (Môi trường Client thuần túy)
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

    async function fetchCoreData() {
      try {
        const resAll = await getMovies(1);
        const all = resAll?.items || [];
        
        const corePayload = {
          allMovies: all,
          koreaMovies: [], actionMovies: [], chinaMovies: [], animeMovies: [],
          topRated: all.slice(0, 5).map((m, i) => ({ ...m, fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i] })),
          continueItems: all.slice(5, 8),
        };
        
        setData(corePayload);
        setLoading(false);

        // Kéo ngầm danh sách bổ trợ dưới nền
        Promise.all([
          getMoviesByCountry('han-quoc', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCategory('hanh-dong', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCountry('trung-quoc', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCategory('hoat-hinh', 1).then(r => r?.items || []).catch(() => []),
        ]).then(([korea, action, china, anime]) => {
          const fullPayload = {
            ...corePayload,
            koreaMovies: korea,
            actionMovies: action,
            chinaMovies: china,
            animeMovies: anime
          };
          setData(fullPayload);
          
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload: fullPayload }));
          } catch (_) {}
        });

      } catch (err) {
        console.error("Lỗi fetch dữ liệu trang chủ:", err);
        setLoading(false);
      }
    }

    fetchCoreData();
  }, []);

  // Ép đồng bộ hiển thị khung xương ở lượt First-Paint đầu tiên
  if (!mounted || (loading && data.allMovies.length === 0)) {
    return <HomeSkeleton />;
  }

  return (
    <>
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
      <IOSInstallPrompt />
    </>
  );
}