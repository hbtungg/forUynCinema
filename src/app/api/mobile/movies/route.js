import { NextResponse } from 'next/server';
import { getProviderMovies, getProviderMovieDetail, searchProviderMovies } from '@/lib/movieProvider';

export const runtime = 'nodejs';

// Read-only adapter for the native client; no database or secret enters a response.
export async function GET(request) {
  const p = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(10000, parseInt(p.get('page'), 10) || 1));
  const slug = p.get('slug');
  const keyword = p.get('q')?.trim();
  const provider = p.get('provider') || 'kkphim';
  if ((slug && !/^[a-zA-Z0-9-]{1,250}$/.test(slug)) || (keyword && keyword.length > 150)
    || !['auto', 'nguonc', 'kkphim'].includes(provider)) {
    return NextResponse.json({ error: 'Tham số không hợp lệ' }, { status: 400 });
  }
  const result = slug
    ? await getProviderMovieDetail(slug, provider === 'auto' ? null : provider)
    : keyword ? await searchProviderMovies(keyword, page) : await getProviderMovies(page);
  if (slug && !result.movie) return NextResponse.json({ error: 'Không tìm thấy phim' }, { status: 404 });
  if (!slug && result.source === 'empty') return NextResponse.json({ error: 'Nguồn phim tạm thời không phản hồi' }, { status: 502 });
  return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=60', 'X-Uynflix-Mobile-API': '1' } });
}
