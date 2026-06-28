'use client';

import { useState, useEffect } from 'react';
import { getMovies, getMoviesByCountry, getMoviesByCategory } from '@/lib/clientMovies';
import HomePageClient from './HomePageClient';

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

/* ── 🚀 SKELETON CHUẨN MIDNIGHT SHADER-READY ──
   Được gọt sạch Header, Sidebar và các lớp flex bao phủ cứng, 
   chỉ giữ lại những ô vuông lấp lánh xuyên thấu lơ lửng trên phông nền vũ trụ! */
function HomeSkeleton() {
  return (
    <div className="w-full h-full overflow-y-auto pb-20 custom-scrollbar animate-pulse">
      <div className="w-full aspect-[21/9] bg-white/5 midnight-glass" />
      <div className="px-5 xl:px-16 py-8 space-y-12">
        {Array.from({ length: 3 }).map((_, si) => (
          <div key={si} className="space-y-4">
            <div className="h-6 w-48 bg-white/10 rounded-md" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-full aspect-[2/3] bg-white/5 rounded-lg midnight-glass" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Gài Cache đồng bộ ngay từ vòng khởi tạo State ban đầu
  const [data, setData] = useState(() => {
    const defaultData = {
      allMovies: [], koreaMovies: [], actionMovies: [],
      chinaMovies: [], animeMovies: [], topRated: [], continueItems: []
    };
    
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const { ts, payload } = JSON.parse(raw);
          if (Date.now() - ts < CACHE_TTL) return payload; 
        }
      } catch (_) {}
    }
    return defaultData;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const { ts } = JSON.parse(raw);
          if (Date.now() - ts < CACHE_TTL) return false;
        }
      } catch (_) {}
    }
    return true;
  });

  useEffect(() => {
    document.title = "Uynflix Vietnam - Watch series online, watch films online free";

    if (!loading && data.allMovies.length > 0) return;

    async function fetchCoreData() {
      try {
        // LUỒNG 1: Kéo danh sách phim Slider chính
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

        // LUỒNG 2: Kéo ngầm bất đồng bộ các hàng phim phụ dưới nền
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
  }, [loading, data.allMovies.length]);

  if (loading && data.allMovies.length === 0) return <HomeSkeleton />;

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