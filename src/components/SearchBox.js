'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import MovieArtwork from './MovieArtwork';

export default function SearchBox() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);
  const container = useRef(null);
  const suggestionsId = useId();
  const query = keyword.trim();
  const showSuggestions = open && query.length >= 2;
  const currentResult = result?.query === query ? result : null;

  useEffect(() => {
    if (!showSuggestions || currentResult) return;
    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      const timeout = setTimeout(() => controller.abort('timeout'), 8000);
      try {
        const response = await fetch('https://phim.nguonc.com/api/films/search?keyword=' + encodeURIComponent(query), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        if (!controller.signal.aborted) setResult({ query, items: (data.items || data.data?.items || []).slice(0, 5) });
      } catch {
        if (!controller.signal.aborted || controller.signal.reason === 'timeout') setResult({ query, error: true });
      } finally {
        clearTimeout(timeout);
      }
    }, 400);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [showSuggestions, query, currentResult]);

  useEffect(() => {
    const dismiss = event => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  return (
    <form ref={container} role="search" aria-label="Tìm phim từ thanh điều hướng" className="relative clear-glass glass-search flex min-w-0 items-center gap-1 px-2"
      onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onSubmit={event => {
        event.preventDefault();
        if (!query) return;
        setOpen(false);
        router.push('/search?q=' + encodeURIComponent(query));
      }}>
      <input type="search" value={keyword} placeholder="Tìm phim" aria-label="Tìm kiếm phim"
        aria-controls={showSuggestions ? suggestionsId : undefined} enterKeyHint="search" autoComplete="off" className="min-h-11 w-32 min-w-0 bg-transparent pl-2 text-base sm:text-sm xl:w-44"
        onFocus={() => setOpen(true)}
        onChange={event => { setKeyword(event.target.value); setOpen(true); }} />
      <button type="submit" aria-label="Tìm kiếm" className="grid size-11 shrink-0 place-items-center rounded-full text-on-surface-variant hover:text-white">
        <Search size={18} aria-hidden="true" />
      </button>
      {showSuggestions && (
        <div id={suggestionsId} className="absolute top-full right-0 z-50 mt-2 w-72 max-w-[90vw] rounded-xl clear-glass glass-popover p-2">
          {!currentResult || currentResult.error || !currentResult.items.length ? (
            <p role="status" className="p-3 text-sm text-on-surface-variant">
              {!currentResult ? 'Đang tìm phim…' : currentResult.error ? 'Không tải được gợi ý. Nhấn Tìm kiếm để thử nguồn khác.' : 'Không tìm thấy gợi ý.'}
            </p>
          ) : (
            <ul aria-label="Phim gợi ý">
              {currentResult.items.map(movie => (
                <li key={movie.slug}>
                  <Link href={'/movie/' + movie.slug} prefetch={false} onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-lg p-2 text-sm hover:bg-white/10">
                    <MovieArtwork movie={movie} decorative sizes="32px" className="h-11 w-8 shrink-0 rounded object-cover" />
                    <span className="min-w-0">
                      <span className="block line-clamp-2">{movie.name}</span>
                      {movie.year && <span className="text-xs text-on-surface-variant">{movie.year}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
