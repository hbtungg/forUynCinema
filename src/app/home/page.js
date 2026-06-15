'use client';

import { useState, useEffect } from 'react';
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
                    {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  // 🚀 SỬA ĐỔI THẦN THÁNH: Đọc và gài Cache đồng bộ ngay từ lúc khởi tạo State ban đầu (Khử hoàn toàn lỗi setState trong effect)
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
          if (Date.now() - ts < CACHE_TTL) {
            return payload; // Có cache tươi -> Ăn ngay dữ liệu sạch vòng đầu tiên!
          }
        }
      } catch (_) {}
    }
    return defaultData;
  });

  // Tương tự, loading sẽ bằng false ngay nếu data đã lấy được từ Cache thành công
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
    document.title = "UYNFLIX";

    // Nếu đã có sẵn dữ liệu từ cache nạp ở useState, không làm phiền Server nữa
    if (!loading && data.allMovies.length > 0) return;

    async function fetchCoreData() {
      try {
        // LUỒNG 1: Kéo duy nhất danh sách phim Slider chính
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

        // LUỒNG 2: Kéo ngầm bất đồng bộ các hàng phim phụ bên dưới
        Promise.all([
          getMoviesByCountry('han-quoc', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCategory('hanh-dong', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCountry('trung-quoc', 1).then(r => r?.items || []).catch(() => []),
          getMoviesByCategory('hoat-hinh', 1).then(r => r?.items || []),
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