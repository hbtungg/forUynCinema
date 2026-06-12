// CLIENT-ONLY: Gọi thẳng phim.nguonc.com từ browser của người dùng
// Browser dùng IP dân cư → Cloudflare không chặn → không cần proxy
const DIRECT_API = "https://phim.nguonc.com/api";

// 🚀 HÀM HELPER: Xử lý nối chuỗi URL chuẩn đét thay thế cho buildUrl cũ bị thiếu
function formatUrl(path, params = {}) {
  const url = new URL(`${DIRECT_API}/${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) return null;
    return await res.json();
  } catch (error) {
    console.error(`clientMovies fetch error: ${url}`, error);
    return null;
  }
}

// 1. Hàm lấy chi tiết phim phục vụ trang xem phim
export async function getMovieDetail(slug) {
  const url = formatUrl(`film/${slug}`);
  const data = await safeFetch(url);
  return data || { movie: null, episodes: [] };
}

// 2. Hàm tìm kiếm phim dành riêng cho Client-side - Gọi thẳng không sợ Cloudflare
export async function searchMovies(keyword, page = 1) {
  const url = formatUrl('films/search', { keyword, page });
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { items: [], paginate: { total_page: 1 } };
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) return { items: [], paginate: { total_page: 1 } };
    return await res.json();
  } catch (error) {
    console.error(`Lỗi searchMovies tại Client: ${url}`, error);
    return { items: [], paginate: { total_page: 1 } };
  }
}

// 🚀 3. BỔ SUNG: Hàm lấy phim mới cập nhật phục vụ Slider Trang Chủ
export async function getMovies(page = 1) {
  const url = formatUrl('films/phim-moi-cap-nhat', { page });
  const data = await safeFetch(url);
  return data || { items: [], paginate: { total_page: 1 } };
}

// 4. Lấy phim theo THỂ LOẠI (Đã sửa buildUrl thành formatUrl)
export async function getMoviesByCategory(slug, page = 1, type = "") {
  const url = formatUrl(`films/the-loai/${slug}`, { page, ...(type && { type }) });
  const data = await safeFetch(url);
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 5. Lấy phim theo QUỐC GIA (Đã sửa buildUrl thành formatUrl)
export async function getMoviesByCountry(slug, page = 1, type = "") {
  const url = formatUrl(`films/quoc-gia/${slug}`, { page, ...(type && { type }) });
  const data = await safeFetch(url);
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 6. Lấy phim theo NĂM PHÁT HÀNH (Đã sửa buildUrl thành formatUrl)
export async function getMoviesByYear(slug, page = 1) {
  const url = formatUrl(`films/nam-phat-hanh/${slug}`, { page });
  const data = await safeFetch(url);
  return data || { items: [], paginate: { total_pages: 1 } };
}

// Lấy danh mục & Quốc gia (Đã sửa buildUrl thành formatUrl)
export async function getCategories() {
  const url = formatUrl("the-loai");
  const data = await safeFetch(url);
  return data?.items || [];
}

export async function getCountries() {
  const url = formatUrl("quoc-gia");
  const data = await safeFetch(url);
  return data?.items || [];
}

// Lấy phim gợi ý dựa trên thể loại (Related Movies) (Đã sửa buildUrl thành formatUrl)
export async function getRelatedMovies(categorySlug, limit = 8) {
  const url = formatUrl(`films/the-loai/${categorySlug}`, { page: 1 });
  const data = await safeFetch(url);
  return data?.items?.slice(0, limit) || [];
}