'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import MovieSection from '@/components/MovieSection';
import ContinueWatching from '@/components/ContinueWatching';
import IOSInstallPrompt from '@/components/IOSInstallPrompt';
import { getMovies, getMoviesByCountry, getMoviesByCategory } from '@/lib/clientMovies';

const TTL = 5 * 60 * 1000;
const lists = [
  ['latest', 'Phim mới cập nhật', '/danh-sach?type=phim-moi-cap-nhat', () => getMovies(1)],
  ['korea', 'Phim Hàn Quốc', '/danh-sach?type=han-quoc', () => getMoviesByCountry('han-quoc', 1)],
  ['anime', 'Phim hoạt hình', '/danh-sach?type=hoat-hinh', () => getMoviesByCategory('hoat-hinh', 1)],
];

const genres = [
  ['Hành động', 'hanh-dong'], ['Kinh dị', 'kinh-di'], ['Tâm lý', 'tam-ly'],
  ['Viễn tưởng', 'vien-tuong'], ['Hình sự', 'hinh-su'], ['Tình cảm', 'tinh-cam'],
  ['Hoạt hình', 'hoat-hinh'], ['Tài liệu', 'tai-lieu'],
];

const pending = new Map();

function loadList(key, fetchList) {
  const storageKey = 'uynflix.home.v2.' + key;
  try {
    const cached = JSON.parse(sessionStorage.getItem(storageKey));
    if (cached && Date.now() - cached.time < TTL) return Promise.resolve(cached.items);
  } catch {}

  if (!pending.has(key)) {
    const request = fetchList().then(result => {
      if (!result || result.source === 'empty') throw new Error('Không tải được danh sách phim');
      const items = result.items.slice(0, 12);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({ time: Date.now(), items }));
      } catch {}
      return items;
    }).finally(() => pending.delete(key));
    pending.set(key, request);
  }
  return pending.get(key);
}

function HomeRow({ config, onLoad }) {
  const [key, title, href, fetchList] = config;
  const [attempt, setAttempt] = useState(0);
  const [items, setItems] = useState(undefined);

  useEffect(() => {
    let active = true;
    const apply = result => {
      if (!active) return;
      setItems(result);
      onLoad?.(result);
    };
    loadList(key, fetchList).then(apply, () => apply(null));
    return () => { active = false; };
  }, [key, fetchList, attempt, onLoad]);

  return (
    <MovieSection title={title} movies={items} viewAllLink={href} onRetry={() => {
      setItems(undefined);
      onLoad?.(undefined);
      setAttempt(value => value + 1);
    }} />
  );
}

export default function HomePageClient() {
  const [featured, setFeatured] = useState(undefined);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 md:space-y-8">
      <h1 className="sr-only">Khám phá phim trên Uynflix</h1>
      {featured?.length ? <HeroSlider movies={featured} /> : featured === undefined && (
        <div className="cinema-hero animate-pulse bg-surface-container" aria-hidden="true" />
      )}

      <nav aria-label="Thể loại phim" className="film-genre-rail">
        {genres.map(([label, slug]) => (
          <Link key={slug} prefetch={false} href={'/danh-sach?type=' + slug}
            className="inline-flex min-h-11 shrink-0 items-center glass-trim px-4 text-sm text-white/85 hover:text-white">
            {label}
          </Link>
        ))}
      </nav>

      <ContinueWatching />
      {lists.map(config => (
        <HomeRow key={config[0]} config={config} onLoad={config[0] === 'latest' ? setFeatured : undefined} />
      ))}
      <IOSInstallPrompt />
    </div>
  );
}
