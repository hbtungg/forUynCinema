'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

export default function ContinueWatching() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  // Hàm load dữ liệu từ API
  const loadHistory = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử từ tinh hệ mây:", error);
      }
    } else if (status === "unauthenticated") {
      setHistory([]);
    }
  };

  // 🚀 LUỒNG 1: Tự động gọi API khi trạng thái đăng nhập xác thực xong
  useEffect(() => {
    if (status === "authenticated") {
      loadHistory();
    } else if (status === "unauthenticated") {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 🚀 LUỒNG 2: Lắng nghe sự kiện cập nhật lịch sử toàn cục
  useEffect(() => {
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  // Hàm xóa lịch sử phim đang xem
  const removeHistory = async (slug) => {
    if (!session?.user?.email) return;
    const updatedHistory = history.filter(item => item.slug !== slug);
    setHistory(updatedHistory);
    try {
      const res = await fetch(`/api/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: session.user.email, 
          slug: slug 
        }),
      });
      if (!res.ok) {
        loadHistory();
      } else {
        const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const updatedLocal = saved.filter(item => item.slug !== slug);
        localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event('historyUpdated'));
      }
    } catch (error) {
      loadHistory();
    }
  };

  if (status !== "authenticated" || history.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 group/section font-sans select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* TIÊU ĐỀ KHAY PHIM ĐANG XEM CHUẨN MOONLIGHT GOLD */}
      <div className="flex items-center justify-between mb-6 md:mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-[#E6C687] rounded-full shadow-[0_0_15px_rgba(230,198,135,0.6)]"></div>
          <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Phim Đang Xem <Sparkles className="w-4 h-4 text-[#E6C687] animate-pulse" />
          </h2>
        </div>
      </div>

      {/* KHAY LƯỚT NGANG TRƯỢT MƯỢT TỐI ƯU TOÀN DIỆN CHO CẢ MOBILE VÀ PC */}
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x scroll-smooth px-1">
        <div className="flex gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
          {history.map((item) => (
            /* 🚀 FIX RESPONSIVE: Hạ chiều rộng w-[280px] cũ xuống w-[240px] trên di động chống thô cứng dính sát */
            <div key={item.slug} className="w-[240px] md:w-[320px] flex-shrink-0 relative group/card animate-in fade-in duration-500">
              
              {/* NÚT XÓA LỊCH SỬ PHA LÊ TĂNG VÙNG BẤM TRÊN MOBILE */}
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  removeHistory(item.slug); 
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 md:w-8 md:h-8 bg-[#0F1326]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5]/60 hover:bg-red-500/20 hover:text-red-400 border-white/5 transition-all z-50 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 shadow-xl active:scale-75 cursor-pointer focus:outline-none"
                title="Xóa khỏi danh sách xem tiếp"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* CARD KHUNG HÌNH PHIM CHUẨN PHA LÊ KÍNH MỜ */}
              <Link 
                href={`/watch/${item.slug}?ep=${encodeURIComponent(item.episode || 1)}`} 
                className="block relative aspect-video rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl bg-[#0F1326]/40 transition-all duration-500 group-hover/card:border-[#E6C687]/30"
              >
                <img 
                  src={item.thumb_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-40 group-hover/card:opacity-85 transition-all duration-700 pointer-events-none" 
                  loading="lazy"
                />
                
                {/* LỚP PHỦ GRADIENT SANG TRỌNG CHE KHUYẾT ĐIỂM ẢNH NGUỒN */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-[#060814] via-[#060814]/80 to-transparent">
                  <h3 className="text-white font-bold text-xs md:text-sm truncate tracking-wide uppercase">{item.name}</h3>
                  
                  <span className="text-[#ffe3ae] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1 block font-mono">
                    ● Tiến trình: Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}
                  </span>
                  
                  {/* THANH TIMELINE TIẾN TRÌNH GIẢ LẬP CAO CẤP */}
                  <div className="mt-3 w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-[#E6C687] shadow-[0_0_8px_rgba(230,198,135,0.6)]"></div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}