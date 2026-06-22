'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import MovieCard from './MovieCard';

export default function FavoriteList() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  const loadFavorites = async () => {
    if (status === "authenticated" && session?.user?.email) {
      const storageKey = `favs_${session.user.email}`;

      // BƯỚC 1: Hiện ngay từ máy (Cực nhanh)
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (localData.length > 0) setFavorites(localData);

      try {
        // BƯỚC 2: Cập nhật từ Database (Đồng bộ xuyên thiết bị)
        const res = await fetch(`/api/favorites?userEmail=${session.user.email}`);
        if (res.ok) {
          const cloudData = await res.json();
          setFavorites(cloudData);
          localStorage.setItem(storageKey, JSON.stringify(cloudData));
        }
      } catch (error) {
        console.error("Lỗi fetch:", error);
      }
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => window.removeEventListener('favoritesUpdated', loadFavorites);
  }, [status, session]);

  if (status !== "authenticated" || favorites.length === 0) return null;

  return (
    <section className="mt-16 group/fav overflow-x-hidden">
      {/* SỬA LẠI CỤM NÀY: Bọc thanh đỏ và tiêu đề vào một div để chúng đi cùng nhau sang bên trái */}
      <div className="flex items-center mb-10 pr-4 gap-4">
        <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] flex-shrink-0"></div>
        <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic text-shadow">
          PHIM EM THÍCH 🍿
        </h2>
      </div>

      {/* Phần danh sách phim */}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide flex gap-6 pb-8 px-2 md:px-0">
        {favorites.map((phim) => (
          <div key={phim.slug} className="w-[160px] md:w-[230px] flex-shrink-0">
            <MovieCard movie={phim} />
          </div>
        ))}
      </div>
    </section>
  );
}