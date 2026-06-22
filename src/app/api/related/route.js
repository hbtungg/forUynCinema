import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'hanh-dong';
  const isEpo = searchParams.get('isEpo') === 'true';
  const actor = searchParams.get('actor') || '';

  try {
    let data;

    // --- TRƯỜNG HỢP 1: PHIM EPO ---
    if (isEpo) {
      // Ưu tiên tìm theo tên diễn viên, nếu không có thì lấy top-rated
      const query = actor ? encodeURIComponent(actor) : 'top-rated';
      const epoRes = await fetch(
        `https://www.eporner.com/api/v2/video/search/?query=${query}&per_page=12&format=json`,
        { cache: 'no-store' }
      );
      const epoData = await epoRes.json();
      data = { items: epoData.videos || [] };
    } 
    
    // --- TRƯỜNG HỢP 2: PHIM NGUONC ---
    else {
      const res = await fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=1`, {
        cache: 'no-store' 
      });
      if (!res.ok) return NextResponse.json({ items: [] });
      data = await res.json();
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}