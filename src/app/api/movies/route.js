import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ items: [] }, { status: 400 });
  }

  try {
    const upstreamUrl = new URL(`https://phim.nguonc.com/api/${path}`);
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        upstreamUrl.searchParams.set(key, value);
      }
    });
    if (!upstreamUrl.searchParams.has('page')) {
      upstreamUrl.searchParams.set('page', '1');
    }

    // Gọi sang NguồnC từ tầng Server ẩn danh của Vercel
    const res = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Giả lập như một trình duyệt độc lập
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://phim.nguonc.com/',
        'Origin': 'https://phim.nguonc.com'
      },
      next: { revalidate: 300 } // Thiết lập cache ngắn để luôn có phim mới mà không bị phạt 429
    });

    if (!res.ok) {
      console.warn(`NguonC proxy upstream failed: ${res.status} ${path}`);
      return NextResponse.json({
        items: [],
        _proxyError: {
          provider: 'nguonc',
          status: res.status,
          statusText: res.statusText,
          path,
          url: upstreamUrl.toString(),
        },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json({
      items: [],
      _proxyError: {
        provider: 'nguonc',
        message: error instanceof Error ? error.message : 'Unknown proxy error',
        path,
      },
    });
  }
}
