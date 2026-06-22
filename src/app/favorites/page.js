'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        console.error("Lỗi fetch yêu thích:", error);
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
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />
      
      {/* 1. ĐỒNG BỘ VỊ TRÍ VÀ PADDING VỚI CÁC TRANG KHÁC */}
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-20">
        
        {/* 2. NÚT QUAY LẠI LÃNG MẠN */}
        <Link 
          href="/home" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        {/* 3. TIÊU ĐỀ TRANG */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-l-[6px] border-red-600 pl-8 transition-all">
          <div>
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-2">Your Collection</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Phim em <span className="text-red-600">thích</span> <span className="not-italic">🍿</span>
            </h1>
          </div>
          <div className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest pb-2">
            {favorites.length} Kiệt tác đã lưu
          </div>
        </div>

        {/* 4. DANH SÁCH PHIM YÊU THÍCH */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[2/3] bg-zinc-900/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {favorites.map((phim) => (
              <div key={phim.slug} className="transition-transform duration-500 hover:scale-105">
                <MovieCard movie={phim} />
              </div>
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG NGHỆ THUẬT */
          <div className="py-40 text-center flex flex-col items-center">
            <div className="relative mb-10">
              <div className="text-zinc-900 text-[100px] md:text-[150px] font-black leading-none opacity-50 italic select-none">FAV</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl md:text-6xl animate-bounce">❤️</span>
              </div>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs max-w-xs leading-relaxed">
              Chưa có bộ phim nào làm rung động trái tim em...
            </p>
            <Link href="/" className="mt-12 group relative px-10 py-4 overflow-hidden rounded-2xl bg-zinc-900 transition-all shadow-xl active:scale-95">
              <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-[400ms] ease-out group-hover:w-full"></div>
              <span className="relative text-white text-[10px] font-black uppercase tracking-[0.3em]">Đi tìm phim ngay</span>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}