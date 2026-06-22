'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

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
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 p-6 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] w-[320px] relative overflow-hidden group">
        
        <div className="absolute inset-0 border border-red-600/10 rounded-[2.5rem] group-hover:border-red-600/30 transition-colors pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <h3 className="text-red-500 text-[10px] font-black uppercase tracking-[0.25em]">
                Xem tiếp chứ?
              </h3>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-zinc-600 hover:text-white transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="mb-5">
            <p className="text-zinc-400 text-[11px] font-medium leading-relaxed">
              Lần trước em đang xem dở bộ phim <br/>
              <span className="text-white font-black italic text-xs">&ldquo;{lastMovie.name}&rdquo;</span>
            </p>
            <p className="text-zinc-500 text-[10px] mt-1 font-bold">
              Đến <span className="text-red-500 uppercase tracking-tighter">Tập {String(lastMovie.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}</span> rồi đó nha!
            </p>
          </div>

          <div className="flex gap-3">
            {/* FIX TẠI ĐÂY: Thêm query ?ep= để đồng bộ với trang xem phim */}
            <Link 
              href={`/watch/${lastMovie.slug}?ep=${encodeURIComponent(lastMovie.episode || '1')}`}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase py-3.5 rounded-2xl text-center shadow-lg shadow-red-900/30 transition-all active:scale-95"
            >
              Xem tiếp ngay
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 text-[9px] font-black uppercase py-3.5 rounded-2xl transition-all"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}