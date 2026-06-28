'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { ArrowLeft, Heart, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import MovieCard from '@/components/MovieCard';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async () => {
    if (status === "authenticated" && session?.user?.email) {
      const storageKey = `favs_${session.user.email}`;
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (localData.length > 0) setFavorites(localData);

      try {
        const res = await fetch(`/api/favorites?userEmail=${session.user.email}`);
        if (res.ok) {
          const cloudData = await res.json();
          setFavorites(cloudData);
          localStorage.setItem(storageKey, JSON.stringify(cloudData));
        }
      } catch (error) {
        console.error("Lỗi fetch yêu thích từ tinh hệ:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => window.removeEventListener('favoritesUpdated', loadFavorites);
  }, [status, session]);

  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa nội bộ */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      <div className="px-4 md:px-12 py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link 
          href="/home" 
          className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </Link>

        {/* TIÊU ĐỀ BỘ SƯU TẬP CHUẨN THIÊN VĂN CAO CẤP */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-[#E6C687] pl-5 md:pl-6">
          <div className="space-y-1">
            <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">Your Private Collection</p>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
              Bộ sưu tập: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Phim Yêu Thích</span>
            </h1>
          </div>
          <div className="text-[#d0c5b5]/40 font-bold uppercase text-[10px] tracking-widest pb-1 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C687]/60" /> {favorites.length} Kiệt tác đã lưu giữ
          </div>
        </div>

        {/* DANH SÁCH PHIM YÊU THÍCH (MỞ RỘNG TỶ LỆ GRID 6 CỘT KHÔNG BLUR) */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[2/3] bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full animate-in fade-in duration-500">
            {favorites.map((phim) => (
              <div key={phim.slug} className="animate-in fade-in duration-500">
                <MovieCard movie={phim} />
              </div>
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG RỖNG NGHỆ THUẬT PHA LÊ KÍNH MỜ */
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-[32px] bg-[#0F1326]/10 backdrop-blur-md max-w-4xl mx-auto px-6 animate-in fade-in duration-500">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="text-[#d0c5b5]/5 text-6xl md:text-8xl font-black tracking-tighter italic select-none font-mono">FAVORITE</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#E6C687]/40 animate-bounce" />
              </div>
            </div>
            <p className="text-[#d0c5b5]/40 font-semibold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-sm">
              Chưa có bộ phim nào lọt vào danh sách làm rung động trái tim em...
            </p>
            
            <Link 
              href="/home" 
              className="mt-4 px-6 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-md"
            >
              Đi tìm phim ngay
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}