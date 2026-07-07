'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { X, Play } from 'lucide-react';

export default function HistoryPopup() {
  const { data: session, status } = useSession();
  const [lastMovie, setLastMovie] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let active = true;
    let timer;
    let resetTimer;

    if (status === "authenticated" && session?.user?.email) {
      const fetchLatestHistory = async () => {
        try {
          const res = await fetch(`/api/history?userEmail=${session.user.email}`);
          if (res.ok && active) {
            const history = await res.json();
            if (history.length > 0 && active) {
              setLastMovie(history[0]);

              timer = setTimeout(() => {
                if (active) setIsVisible(true);
              }, 1500);
            }
          }
        } catch (error) {
          console.error("Lỗi popup:", error);
        }
      };

      fetchLatestHistory();
    } else {
      resetTimer = setTimeout(() => {
        if (active) {
          setIsVisible(false);
          setLastMovie(null);
        }
      }, 0);
    }

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [status, session]);

  if (!isVisible || !lastMovie || status !== "authenticated") return null;

  return (
    /* 🚀 FIX CHÍ MẠNG RESPONSIVE: Căn giữa kịch trần đáy màn hình trên mobile, tự động đẩy về góc phải khi lên màn hình lớn */
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 mx-auto md:mx-0 max-w-[calc(100%-32px)] md:w-[310px] z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700 font-sans select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* HỘP KÉN PHA LÊ KÍNH MỜ XANH ĐÊM THẲM W-FULL TRÊN MOBILE */}
      <div className="w-full bg-[#0F1326]/60 backdrop-blur-2xl border border-white/5 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
        
        {/* Viền hào quang vàng Moonlight ẩn hiện nhẹ nhàng khi hover */}
        <div className="absolute inset-0 border border-[#E6C687]/10 rounded-[2rem] md:rounded-[2.5rem] group-hover:border-[#E6C687]/30 transition-colors duration-500 pointer-events-none" />

        <div className="relative z-10">
          
          {/* TIÊU ĐỀ POPUP LẤP LÁNH */}
          <div className="flex items-center justify-between mb-3.5 md:mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_8px_#E6C687] animate-pulse" />
              <h3 className="text-[#E6C687] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]" style={{ textShadow: '0 0 10px rgba(230,198,135,0.2)' }}>
                Xem tiếp chứ?
              </h3>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-[#d0c5b5]/30 hover:text-white transition-colors p-1 focus:outline-none cursor-pointer"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* NỘI DUNG THÔNG BÁO TINH TẾ */}
          <div className="mb-4 md:mb-5 space-y-1">
            <p className="text-[#d0c5b5]/60 text-xs leading-relaxed font-medium">
              Lần trước em đang xem dở bộ phim <br className="hidden md:inline" />
              <span className="text-white font-bold italic text-sm group-hover:text-[#ffe3ae] transition-colors">&ldquo;{lastMovie.name}&rdquo;</span>
            </p>
            <p className="text-[#d0c5b5]/30 text-[9px] md:text-[10px] font-bold uppercase tracking-wide">
              Đến <span className="text-[#ffe3ae] font-mono font-bold">Tập {String(lastMovie.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}</span> rồi đó nha!
            </p>
          </div>

          {/* CỤM NÚT ĐIỀU HƯỚNG TƠ LỤA CÂN ĐỐI TỶ LỆ */}
          <div className="flex gap-2.5">
            <Link 
              href={`/watch/${lastMovie.slug}?ep=${encodeURIComponent(lastMovie.episode || '1')}`}
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] text-[10px] font-bold uppercase py-3 rounded-xl text-center transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              Xem tiếp ngay
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-3.5 md:px-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 text-[#d0c5b5]/40 hover:text-white text-[9px] font-bold uppercase py-3 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer"
            >
              Bỏ qua
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}