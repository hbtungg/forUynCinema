import Link from 'next/link';
import { Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import MovieArtwork from './MovieArtwork';

export default function MovieCard({ movie }) {
  const episode = movie.current_episode || movie.episode_current || movie.sub_doc;
  const language = movie.language || movie.lang;
  const originalName = movie.origin_name || movie.original_name;

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border-subtle bg-surface-container">
        <MovieArtwork movie={movie} decorative sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 18vw"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 [@media(hover:hover)]:group-hover:scale-[1.03]" />
        {episode && (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-md bg-black/80 px-2 py-1 text-[11px] font-medium text-white">
            {episode}
          </span>
        )}
        {language && (
          <span className="absolute bottom-2 left-2 max-w-[calc(100%-4rem)] truncate rounded-md bg-black/80 px-2 py-1 text-[11px] font-medium text-white">
            {language}
          </span>
        )}
        <div className="movie-card-favorite absolute right-2 bottom-2 z-10">
          <FavoriteButton phim={movie} compact />
        </div>
      </div>
      <Link href={'/movie/' + movie.slug} prefetch={false} className="block rounded-xl after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-white">
        <h3 className="mt-2 min-h-10 break-words text-sm font-semibold leading-5 line-clamp-2">{movie.name}</h3>
        <div className="mt-1 flex min-h-4 items-center gap-2 text-xs leading-4 text-on-surface-variant">
          <span className="min-w-0 flex-1 truncate">{originalName}</span>
          {movie.year && <span>{movie.year}</span>}
          {movie.rating && <span className="inline-flex items-center gap-1"><Star size={11} aria-hidden="true" />{movie.rating}</span>}
        </div>
      </Link>
    </article>
  );
}
