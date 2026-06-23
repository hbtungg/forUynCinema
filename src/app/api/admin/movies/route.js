import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getMovies, searchMovies } from '@/lib/movies';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';

    let result;
    if (search.trim()) {
      result = await searchMovies(search.trim(), page);
    } else {
      result = await getMovies(page);
    }

    return NextResponse.json({
      success: true,
      movies: result?.movies || result || [],
      totalPages: result?.totalPages || 1,
      currentPage: page
    });

  } catch (error) {
    console.error("Lỗi khi tải phim phía Admin API:", error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', movies: [] },
      { status: 500 }
    );
  }
}
