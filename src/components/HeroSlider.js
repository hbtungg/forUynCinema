'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { getArtworkProps, getMovieArtwork } from '@/lib/movieArtwork';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribe(listener) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

function HeroArtwork({ movie, priority }) {
  const [failed, setFailed] = useState(false);
  const portrait = getMovieArtwork(movie);
  const landscape = getMovieArtwork(movie, true);
  if (!portrait && !landscape) return null;
  const sizes = '(min-width: 1600px) 1550px, 95vw';
  const mobile = getArtworkProps(portrait || landscape, sizes, 480, 720);
  const desktop = getArtworkProps(landscape || portrait, sizes, 1280, 720);

  return (
    <picture>
      {!failed && <source media="(min-width: 768px)" srcSet={desktop.srcSet || desktop.src} sizes={desktop.sizes} />}
      <img {...(failed ? { src: portrait || landscape } : mobile)} alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
        onError={event => { if (failed) event.currentTarget.hidden = true; else setFailed(true); }} />
    </picture>
  );
}

export default function HeroSlider({ movies }) {
  const reduceMotion = useSyncExternalStore(subscribe, () => window.matchMedia(motionQuery).matches, () => true);
  const slider = useRef(null);
  const [paused, setPaused] = useState(false);
  const slides = movies.slice(0, 5);

  useEffect(() => {
    const autoplay = slider.current?.autoplay;
    if (!autoplay || slides.length < 2) return;
    if (reduceMotion || paused) autoplay.stop();
    else if (!autoplay.running) autoplay.start();
  }, [reduceMotion, paused, slides.length]);

  return (
    <section className="cinema-hero relative overflow-hidden bg-surface-container" aria-label="Phim nổi bật">
      <Swiper modules={[A11y, Autoplay, Navigation]} className="h-full w-full"
        onSwiper={instance => { slider.current = instance; }} rewind navigation={slides.length > 1} watchSlidesProgress
        a11y={{ prevSlideMessage: 'Phim trước', nextSlideMessage: 'Phim tiếp theo' }}
        speed={reduceMotion ? 0 : 350}
        autoplay={slides.length > 1 && { delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}>
        {slides.map((movie, index) => (
          <SwiperSlide key={movie.canonicalKey || movie.slug}>
            {({ isActive }) => (
              <div className="relative flex h-full items-end p-4 pb-12 sm:p-8 md:items-center md:px-16" inert={!isActive}>
                <HeroArtwork movie={movie} priority={index === 0} />
                <div className="cinema-hero-scrim absolute inset-0" aria-hidden="true" />
                <div className="relative w-full max-w-xl space-y-2 md:space-y-4">
                  <p className="text-xs font-semibold tracking-[.15em] text-on-surface-variant uppercase">Phim nổi bật</p>
                  <h2 className="line-clamp-2 break-words text-2xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">{movie.name}</h2>
                  <p className="text-sm text-on-surface-variant">{[movie.year, movie.time, movie.quality].filter(Boolean).join(' · ')}</p>
                  {(movie.description || movie.content) && (
                    <p className="hidden text-sm leading-relaxed text-on-surface-variant md:line-clamp-2">
                      {(movie.description || movie.content).replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link prefetch={false} href={'/watch/' + movie.slug} className="button-primary inline-flex items-center gap-2 px-4 text-sm">
                      <Play size={16} aria-hidden="true" /> Xem phim
                    </Link>
                    <Link prefetch={false} href={'/movie/' + movie.slug} className="inline-flex min-h-11 items-center rounded-xl border border-border-subtle bg-black/65 px-4 text-sm font-semibold">Chi tiết</Link>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {!reduceMotion && slides.length > 1 && (
        <button type="button" className="hero-pause" onClick={() => setPaused(value => !value)}>
          {paused ? 'Phát trình chiếu' : 'Dừng trình chiếu'}
        </button>
      )}
    </section>
  );
}
