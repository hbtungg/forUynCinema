'use client';

import { useId, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieSection({ title, movies, viewAllLink, onRetry }) {
  const titleId = useId();
  const rail = useRef(null);
  const scroll = direction => rail.current?.scrollBy({ left: direction * rail.current.clientWidth });

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <h2 id={titleId} className="text-lg font-semibold tracking-tight md:text-2xl">{title}</h2>
        <div className="flex items-center gap-1">
          <Link href={viewAllLink} prefetch={false} className="inline-flex min-h-11 items-center gap-1 text-sm text-on-surface-variant hover:text-white">
            Xem tất cả <ChevronRight aria-hidden="true" size={16} />
          </Link>
          {!!movies?.length && (
            <div className="ml-2 hidden gap-1 md:flex">
              <button type="button" aria-label={'Cuộn trái — ' + title} onClick={() => scroll(-1)} className="rail-control"><ChevronLeft size={19} /></button>
              <button type="button" aria-label={'Cuộn phải — ' + title} onClick={() => scroll(1)} className="rail-control"><ChevronRight size={19} /></button>
            </div>
          )}
        </div>
      </div>
      {movies === null ? (
        <div className="rounded-xl border border-border-subtle bg-surface-container p-4 text-sm">
          <p role="status">Không tải được danh sách phim.</p>
          <button type="button" onClick={onRetry} className="mt-2 min-h-11 rounded-lg border border-border-subtle px-4">Thử lại</button>
        </div>
      ) : movies?.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Chưa có phim trong danh sách này.</p>
      ) : (
        <ul ref={rail} className="film-rail" aria-busy={movies === undefined}>
          {movies ? movies.map(movie => (
            <li key={movie.canonicalKey || movie.slug}><MovieCard movie={movie} /></li>
          )) : Array.from({ length: 6 }, (_, index) => (
            <li key={index} aria-hidden="true" className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-surface-container" />
              <div className="mt-2 h-10 w-4/5 rounded bg-surface-container" />
              <div className="mt-1 h-4 w-1/2 rounded bg-surface-container" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
