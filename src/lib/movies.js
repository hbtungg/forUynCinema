// BASE_URL tự động theo môi trường:
// - Server (Vercel/Node): gọi thẳng NguồnC
// - Browser (Client): đi qua proxy nội bộ /api/movies
const IS_SERVER = typeof window === "undefined";
const DIRECT_BASE = "https://phim.nguonc.com/api";
const PROXY_BASE = "/api/movies";

/**
 * Build URL đúng cho từng môi trường:
 * - Server: https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=1
 * - Browser: /api/movies?path=films/phim-moi-cap-nhat&page=1
 */
function buildUrl(path, params = {}) {
  if (IS_SERVER) {
    const url = new URL(`${DIRECT_BASE}/${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    });
    return url.toString();
  } else {
    const url = new URL(PROXY_BASE, window.location.origin);
    url.searchParams.set("path", path);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    });
    return url.toString();
  }
}

/**
 * HÀM HELPER: Kiểm tra phản hồi và bọc đầu vào chống HTML rác
 */
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...options.headers,
      },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Phản hồi không phải JSON tại: ${url}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch Error tại ${url}:`, error);
    return null;
  }
}

// 1. Lấy phim mới cập nhật (Trang chủ)
export async function getMovies(page = 1) {
  const url = buildUrl("films/phim-moi-cap-nhat", { page });
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 2. Lấy chi tiết một bộ phim
export async function getMovieDetail(slug) {
  const url = buildUrl(`film/${slug}`);
  const data = await safeFetch(url);
  return data || { movie: null, episodes: [] };
}

// 3. Tìm kiếm phim
export async function searchMovies(keyword, page = 1) {
  const url = buildUrl("films/search", { keyword, page });
  const data = await safeFetch(url);
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 4. Lấy phim theo THỂ LOẠI
export async function getMoviesByCategory(slug, page = 1, type = "") {
  const url = buildUrl(`films/the-loai/${slug}`, { page, ...(type && { type }) });
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 5. Lấy phim theo QUỐC GIA
export async function getMoviesByCountry(slug, page = 1, type = "") {
  const url = buildUrl(`films/quoc-gia/${slug}`, { page, ...(type && { type }) });
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 6. Lấy phim theo NĂM PHÁT HÀNH
export async function getMoviesByYear(slug, page = 1) {
  const url = buildUrl(`films/nam-phat-hanh/${slug}`, { page });
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// Lấy danh mục & Quốc gia
export async function getCategories() {
  const url = buildUrl("the-loai");
  const data = await safeFetch(url, { next: { revalidate: 86400 } });
  return data?.items || [];
}

export async function getCountries() {
  const url = buildUrl("quoc-gia");
  const data = await safeFetch(url, { next: { revalidate: 86400 } });
  return data?.items || [];
}

// Lấy phim gợi ý dựa trên thể loại (Related Movies)
export async function getRelatedMovies(categorySlug, limit = 8) {
  const url = buildUrl(`films/the-loai/${categorySlug}`, { page: 1 });
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data?.items?.slice(0, limit) || [];
}

// ─── HỆ THỐNG EPO ────────────────────────────────────────────────────────────
const EPO_BASE_URL = "https://www.eporner.com/api/v2/video";

export async function getEpoVideos(page = 1, category = "all", order = "latest") {
  try {
    const searchQuery = category && category !== "all" ? category : "all";
    const params = new URLSearchParams({
      query: searchQuery,
      per_page: "32",
      page: page.toString(),
      thumbsize: "big",
      order,
      format: "json",
    });

    const res = await fetch(`${EPO_BASE_URL}/search/?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { videos: [], total_pages: 1 };

    const data = await res.json();
    const formattedVideos = (data.videos || []).map((v) => ({
      id: v.id,
      title: v.title,
      thumb: v.default_thumb?.src || (Array.isArray(v.thumbs) ? v.thumbs[0]?.src : ""),
      preview_url: v.preview_url || v.test_previews || "",
      quality: v.quality || "HD",
      duration: v.length_min,
      added: v.added,
      views: v.views,
      rate: v.rate,
    }));

    return {
      videos: formattedVideos,
      total_pages: Math.min(data.total_pages || 1, 500),
      current_category: category,
    };
  } catch (error) {
    console.error("EPO API Error:", error);
    return { videos: [], total_pages: 1 };
  }
}

export async function getEpoVideoDetail(id) {
  const data = await safeFetch(
    `https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`,
    { next: { revalidate: 3600 } }
  );
  return Array.isArray(data) ? data[0] : data;
}