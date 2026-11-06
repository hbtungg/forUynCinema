'use client';

import { useState } from 'react';
import { Film } from 'lucide-react';
import { getArtworkProps, getMovieArtwork } from '@/lib/movieArtwork';

export default function MovieArtwork({ movie, landscape = false, sizes, className, decorative = false, eager = false }) {
  const src = getMovieArtwork(movie, landscape);
  const [failedUrl, setFailedUrl] = useState(null);
  const [failedOriginal, setFailedOriginal] = useState(null);
  const responsive = getArtworkProps(src, sizes, landscape ? 1280 : 480, landscape ? 720 : 720);

  if (!src || failedOriginal === src) {
    return (
      <span className={className + ' grid place-items-center bg-surface-container text-on-surface-variant'}
        role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : movie.name} aria-hidden={decorative || undefined}>
        <Film size={24} aria-hidden="true" />
      </span>
    );
  }

  // Keep the original provider URL available when image transformation fails.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...(failedUrl === src ? { src } : responsive)} alt={decorative ? '' : movie.name}
      className={className} decoding="async" loading={eager ? 'eager' : 'lazy'}
      onError={() => failedUrl === src || !responsive.srcSet ? setFailedOriginal(src) : setFailedUrl(src)} />
  );
}
