'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import HistoryPopup from '@/components/HistoryPopup';
import SecretChat from '@/components/SecretChat';
import HeroSlider from '@/components/HeroSlider';
import MovieSection from '@/components/MovieSection';
import RightPanel from '@/components/RightPanel';

export default function HomePageClient({
  allMovies: initialAllMovies,
  koreaMovies: initialKoreaMovies,
  actionMovies: initialActionMovies,
  chinaMovies: initialChinaMovies,
  animeMovies: initialAnimeMovies,
  topRated: initialTopRated,
  continueItems: initialContinueItems,
  genres,
}) {
  // Trạng thái thu gọn Sidebar (Mặc định mở rộng = false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // 🚀 QUẢN LÝ DỮ LIỆU TẬP TRUNG: Nhận props thô hoặc mảng rỗng từ Server phòng vệ
  const [movies, setMovies] = useState({
    allMovies: initialAllMovies || [],
    koreaMovies: initialKoreaMovies || [],
    actionMovies: initialActionMovies || [],
    chinaMovies: initialChinaMovies || [],
    animeMovies: initialAnimeMovies || [],
    topRated: initialTopRated || [],
    continueItems: initialContinueItems || [],
  });

  useEffect(() => {
    // 🚀 CHẾ ĐỘ CỨU TRỢ NGẦN: Kích hoạt khi chạy trên Vercel bị API chặn trả về mảng trống
    if (!initialAllMovies || initialAllMovies.length === 0) {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      async function silentHydration() {
        try {
          const clientFetch = async (path) => {
            try {
              const res = await fetch(`https://phim.nguonc.com/api/films/${path}?page=1`);
              if (!res.ok) return [];
              const json = await res.json();
              return json.items || [];
            } catch {
              return [];
            }
          };

          // Gọi tuần tự gián cách 400ms bằng mạng người dùng để vượt rào lỗi 429 Too Many Requests
          const all = await clientFetch('phim-moi-cap-nhat');
          await delay(400);
          const korea = await clientFetch('quoc-gia/han-quoc');
          await delay(400);
          const action = await clientFetch('the-loai/hanh-dong');
          await delay(400);
          const china = await clientFetch('quoc-gia/trung-quoc');
          await delay(400);
          const anime = await clientFetch('the-loai/hoat-hinh');

          const top = all.slice(0, 5).map((m, i) => ({
            ...m,
            fakeRating: [9.3, 9.2, 9.0, 8.9, 8.8][i],
          }));

          setMovies({
            allMovies: all,
            koreaMovies: korea,
            actionMovies: action,
            chinaMovies: china,
            animeMovies: anime,
            topRated: top,
            continueItems: all.slice(5, 8),
          });
        } catch (err) {
          console.error("Lỗi đồng bộ dữ liệu ngầm:", err);
        }
      }
      silentHydration();
    }
  }, [initialAllMovies]);

  return (
    // KHÓA CỨNG HỘP CHỨA GỐC: Chia cột Flex dọc toàn trang
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0c] text-white overflow-hidden antialiased select-none">

      {/* ── 1. HEADER ĐỘC TÔN TRÊN ĐỈNH (Nền đen đặc, kéo dài trọn vẹn 100% chiều ngang) ── */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* ── 2. KHÔNG GIAN TẦNG DƯỚI (Nằm hoàn toàn dưới gầm Header) ── */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden relative">
        
        {/* SIDEBAR DỌC: Tự động co giãn theo prop collapsed, đẩy khối nội dung sang bên phải tự nhiên */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* ── 3. KHU VỰC HIỂN THỊ PHIM & CỘT PHẢI (Dual-Scroll Layout độc lập) ── */}
        <div className="flex-1 flex flex-row min-w-0 h-full overflow-hidden">

          {/* KHỐI TRUNG TÂM: BANNER & CÁC KHAY PHIM (Cuộn độc lập mượt mà) */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar pb-20">
            {/* Đồng bộ mảng sang state movies có tính năng tự động lấp đầy */}
            <HeroSlider movies={movies.allMovies} />

            <div className="px-5 xl:px-8 py-6 space-y-8">
              <MovieSection title="Phim Mới Cập Nhật" movies={movies.allMovies.slice(0, 12)} viewAllLink="/danh-sach?type=phim-moi-cap-nhat" showViewAll />
              <MovieSection title="Phim Hàn Quốc"     movies={movies.koreaMovies.slice(0, 12)}  viewAllLink="/danh-sach?type=han-quoc" />
              <MovieSection title="Phim Hành Động"    movies={movies.actionMovies.slice(0, 12)} viewAllLink="/danh-sach?type=hanh-dong" />
              <MovieSection title="Phim Trung Quốc"   movies={movies.chinaMovies.slice(0, 12)}  viewAllLink="/danh-sach?type=trung-quoc" />
              <MovieSection title="Phim Hoạt Hình"    movies={movies.animeMovies.slice(0, 12)}  viewAllLink="/danh-sach?type=hoat-hinh" />

              <div className="pt-4">
                <HistoryPopup />
                {/* <SecretChat /> */}
                <Footer />
              </div>
            </div>
          </div>

          {/* KHỐI BÊN PHẢI: TIẾP TỤC XEM, THỂ LOẠI, TOP RATED (Đứng im phăng phắc, cuộn độc lập riêng) */}
          <RightPanel 
            continueItems={movies.continueItems} 
            genres={genres} 
            topRated={movies.topRated} 
          />
        </div>
        
      </div>
      
      {/* Style ẩn thanh cuộn thô cứng */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a22; border-radius: 99px; }
      `}</style>
    </div>
  );
}