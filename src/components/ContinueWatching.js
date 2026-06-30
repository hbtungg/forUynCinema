'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { X, Sparkles, Play } from 'lucide-react';

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

  useEffect(() => {
    if (status === "authenticated") {
      loadHistory();
    } else if (status === "unauthenticated") {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

  // 🚀 SỬA CHÍ MẠNG: Định vị chính xác ảnh NGANG (Landscape) để khớp hoàn hảo với tỷ lệ khung hình aspect-video (16:9)
  const getDisplayImage = (item) => {
    if (!item) return '';

    // 1. Tự động nhận diện nhà cung cấp
    const isKKPhim = item.provider === 'kkphim' ||
      (item.thumb_url && item.thumb_url.includes('phimapi.com'));

    // ĐÃ SỬA CHUẨN ĐÉT ẢNH NGANG:
    // KKPhim: thumb_url là ảnh ngang
    // NguồnC (hoặc mặc định): poster_url là ảnh ngang
    let rawUrl = isKKPhim
      ? (item.thumb_url || item.poster_url || '')
      : (item.poster_url || item.thumb_url || '');

    if (!rawUrl) return '';

    // 2. Nếu đã là URL tuyệt đối thì giữ nguyên
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    // 3. Nếu là đường dẫn tương đối, tự nối domain gốc tương ứng chống 404
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  if (status !== "authenticated" || history.length === 0) return null;

  const titleText = "Phim Đang Xem";

  return (
    <section className="mt-12 md:mt-16 group/section font-sans select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* TIÊU ĐỀ KHAY PHIM */}
      <div className="flex items-center justify-between mb-6 md:mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-7 bg-[#E6C687] rounded-full shadow-[0_0_15px_rgba(230,198,135,0.6)] shrink-0"></div>

          <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="inline">
              {titleText.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={`${i === 1 ? 'text-[#E6C687] drop-shadow-[0_0_10px_rgba(230,198,135,0.25)]' : ''} inline`}
                >
                  {word}{' '}
                </span>
              ))}
            </span>
            <Sparkles className="w-4 h-4 text-[#E6C687] animate-pulse shrink-0" />
          </h2>
        </div>
      </div>

      {/* KHAY LƯỚT NGANG */}
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x scroll-smooth px-1">
        <div className="flex gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div key={item.slug} className="w-[240px] md:w-[320px] flex-shrink-0 relative group/card animate-in fade-in duration-500">

              {/* NÚT XÓA LỊCH SỬ PHA LÊ */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeHistory(item.slug);
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 md:w-8 md:h-8 bg-[#0F1326]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5]/60 hover:bg-red-500/20 hover:text-red-400 transition-all z-50 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 shadow-xl active:scale-75 cursor-pointer focus:outline-none"
                title="Xóa khỏi danh sách xem tiếp"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* CARD KHUNG HÌNH PHIM */}
              <Link
                href={`/watch/${item.slug}?ep=${encodeURIComponent(item.episode || 1)}`}
                className="block relative aspect-video rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl bg-[#0F1326]/40 transition-all duration-500 group-hover/card:border-[#E6C687]/30"
              >
                {/* 🚀 ĐÃ SỬA: Lấy ảnh nền theo đúng luồng API và thêm hiệu ứng scale-105 khi Hover */}
                <img
                  src={getDisplayImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-50 group-hover/card:opacity-40 group-hover/card:scale-105 transition-all duration-700 pointer-events-none"
                  loading="lazy"
                />

                {/* 🚀 ĐÃ THÊM: Nút Play pha lê mờ ảo hiện ra giữa tâm ảnh khi Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E6C687]/20 backdrop-blur-md border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shadow-[0_0_20px_rgba(230,198,135,0.2)] transform group-hover/card:scale-110 transition-transform duration-500">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* LỚP PHỦ GRADIENT ĐƯỢC LÀM MƯỢT HƠN */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-[#060814] via-[#060814]/90 to-transparent z-20">
                  <h3 className="text-white font-bold text-xs md:text-sm truncate tracking-wide uppercase group-hover/card:text-[#ffe3ae] transition-colors">{item.name}</h3>

                  <span className="text-[#ffe3ae] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1.5 block font-mono">
                    ● Progress: Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}
                  </span>

                  {/* THANH TIMELINE TỎA SÁNG */}
                  <div className="mt-3 w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-[#E6C687] shadow-[0_0_8px_rgba(230,198,135,0.8)] rounded-full"></div>
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