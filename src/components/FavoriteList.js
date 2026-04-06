'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import MovieCard from './MovieCard';

export default function FavoriteList() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  const loadFavorites = () => {
    if (status === "authenticated" && session) {
      const storageKey = `favs_${session.user.email}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setFavorites(saved);
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => window.removeEventListener('favoritesUpdated', loadFavorites);
  }, [status, session]);

  if (status !== "authenticated" || favorites.length === 0) return null;

  return (
    <section className="mt-16 group/fav font-sans overflow-x-hidden">
      <div className="flex items-center justify-between mb-10 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic">
            Phim Em Đã Thích ❤️
          </h2>
        </div>
        <div className="flex gap-2 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-300">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-red-500 transition-all active:scale-95 shadow-xl"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-red-500 transition-all active:scale-95 shadow-xl"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
        </div>
      </div>
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide scroll-smooth px-2">
        <div className="flex gap-6 md:gap-8 pb-8" style={{ width: 'max-content' }}>
          {favorites.map((phim) => (
            <div key={phim.slug} className="w-[160px] sm:w-[200px] md:w-[230px] flex-shrink-0 relative group/item">
              <MovieCard movie={phim} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}