import { getImageProps } from 'next/image';

const optimizedHosts = new Set(['img.phimapi.com', 'phim.nguonc.com']);

export function getMovieArtwork(movie, landscape = false) {
  const kkphim = movie.provider === 'kkphim' || movie.thumb_url?.includes('phimapi.com');
  const useThumb = kkphim === landscape;
  const raw = useThumb ? movie.thumb_url || movie.poster_url : movie.poster_url || movie.thumb_url;
  if (!raw) return undefined;
  try {
    const url = new URL(raw, kkphim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com');
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch {}
}

export function getArtworkProps(src, sizes, width, height) {
  if (!src) return {};
  const url = new URL(src);
  if (url.protocol !== 'https:' || !optimizedHosts.has(url.hostname) || url.port || url.search || url.username || url.password) return { src };

  const { props } = getImageProps({ src, alt: '', sizes, width, height });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
