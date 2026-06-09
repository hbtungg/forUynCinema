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

  // Quản lý trạng thái dữ liệu phim tập trung
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
    // Kích hoạt luồng phòng vệ tuần tự nếu Server Vercel bị dính lỗi chặn 429 hoặc trả về mảng trống
    if (!initialAllMovies || initialAllMovies.length === 0) {
      
      // Hàm helper tạo khoảng trễ đóng băng hệ thống ngầm tạm thời
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      async function fallbackWithDelay() {
        try {
          const clientFetch = async (path) => {
            try {
              const res = await fetch(`https://phim.nguonc.com/api/films/${path}?page=1`);
              
              // Nếu dính lỗi Rate Limit, log ra để theo dõi tiến trình
              if (res.status === 429) {
                console.warn(`[Rate Limit 429] Danh mục ${path} đang xếp hàng đợi giãn cách...`);
              }
              
              if (!res.ok) return [];
              const json = await res.json();
              return json.items || [];
            } catch {
              return [];
            }
          };

          // 🚀 THIẾT LẬP LUỒNG KHỞI CHẠY TUẦN TỰ + ĐỆM DELAY (Né bộ đếm spam)
          const all = await clientFetch('phim-moi-cap-nhat');
          await delay(400); // Nghỉ 0.4 giây rồi mới gọi khay tiếp theo
          
          const korea = await clientFetch('quoc-gia/han-quoc');
          await delay(400);
          
          const action = await clientFetch('the-loai/hanh-dong');
          await delay(400);
          
          const china = await clientFetch('quoc-gia/trung-quoc');
          await delay(400);
          
          const anime = await clientFetch('the-loai/hoat-hinh');

          // Tính toán lại khay xếp hạng dựa trên mảng phim mới cào sạch về
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
          console.error("Lỗi luồng xử lý Client-side:", err);
        }
      }
      
      fallbackWithDelay();
    }
  }, [initialAllMovies]);

  return (
    // KHÓA CỨNG HỘP CHỨA GỐC: Chia cột Flex dọc toàn trang
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0c] text-white overflow-hidden antialiased select-none">

      {/* ── 1. HEADER ĐỘC TÔN TRÊN ĐỈNH ── */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* ── 2. KHÔNG GIAN TẦNG DƯỚI (Nằm hoàn toàn dưới gầm Header) ── */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden relative">
        
        {/* SIDEBAR DỌC */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* ── 3. KHU VỰC HIỂN THỊ PHIM & CỘT PHẢI (Dual-Scroll Layout độc lập) ── */}
        <div className="flex-1 flex flex-row min-w-0 h-full overflow-hidden">

          {/* KHỐI TRUNG TÂM: BANNER & CÁC KHAY PHIM (Cuộn độc lập mượt mà) */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar pb-20">
            {/* Truyền dữ liệu từ state movies đã được lấp đầy và bảo vệ */}
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

          {/* KHỐI BÊN PHẢI: TIẾP TỤC XEM, THỂ LOẠI, TOP RATED */}
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