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
      const res = await fetch(`/api/favorites?userEmail=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
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
    <section className="mt-16 group/fav">
      <div className="flex items-center justify-between mb-10 pr-4">
        <h2 className="text-2xl font-black text-zinc-100 uppercase italic">Phim Em Đã Thích ❤️</h2>
      </div>
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide flex gap-6 pb-8">
        {favorites.map((phim) => (
          <div key={phim.slug} className="w-[160px] md:w-[230px] flex-shrink-0">
            <MovieCard movie={phim} />
          </div>
        ))}
      </div>
    </section>
  );
}