import MovieDetailClient from './MovieDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: 'Thông tin phim',
    alternates: { canonical: '/movie/' + encodeURIComponent(slug) },
  };
}

export default async function MovieDetailPage({ params }) {
  const { slug } = await params;
  return <MovieDetailClient key={slug} movieSlug={slug} />;
}
