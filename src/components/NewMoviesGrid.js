import MovieCard from './MovieCard';

export default function NewMoviesGrid({ data }) {
  const movies = data?.items || [];

  return (
    <section>
      {/* Grid phim được giữ lại tinh gọn, không tiêu đề */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
        {movies.map((phim) => (
          <div key={phim.slug}>
            <MovieCard movie={phim} />
          </div>
        ))}
      </div>
    </section>
  );
}