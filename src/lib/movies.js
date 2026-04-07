// --- FILE: src/lib/movies.js ---
const BASE_URL = "https://phim.nguonc.com/api";

/**
 * HÀM HELPER: Kiểm tra phản hồi có phải JSON sạch không
 */
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { 'Accept': 'application/json', ...options.headers }
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return null;

    return await res.json();
  } catch (error) {
    console.error(`Fetch Error tại ${url}:`, error);
    return null;
  }
}

// 1. Lấy phim mới cập nhật (Trang chủ)
export async function getMovies(page = 1) {
  const data = await safeFetch(`${BASE_URL}/films/phim-moi-cap-nhat?page=${page}`, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 2. Lấy chi tiết một bộ phim
export async function getMovieDetail(slug) {
  return await safeFetch(`${BASE_URL}/film/${slug}`);
}

// 3. Tìm kiếm phim
export async function searchMovies(keyword, page = 1) {
  const encoded = encodeURIComponent(keyword);
  const data = await safeFetch(`${BASE_URL}/films/search?keyword=${encoded}&page=${page}`);
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 4. Lấy phim theo THỂ LOẠI
export async function getMoviesByCategory(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/the-loai/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 5. Lấy phim theo QUỐC GIA
export async function getMoviesByCountry(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/quoc-gia/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const data = await safeFetch(url, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// 6. Lấy phim theo NĂM PHÁT HÀNH
export async function getMoviesByYear(slug, page = 1) {
  const data = await safeFetch(`${BASE_URL}/films/nam-phat-hanh/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return data || { items: [], paginate: { total_pages: 1 } };
}

// Lấy danh mục & Quốc gia
export async function getCategories() {
  const data = await safeFetch(`${BASE_URL}/the-loai`, { next: { revalidate: 86400 } });
  return data?.items || [];
}

export async function getCountries() {
  const data = await safeFetch(`${BASE_URL}/quoc-gia`, { next: { revalidate: 86400 } });
  return data?.items || [];
}

// --- HỆ THỐNG EPO (BẢN NÂNG CẤP PHÂN LOẠI THEO THỂ LOẠI) ---
const EPO_BASE_URL = "https://www.eporner.com/api/v2/video";

/**
 * Lấy danh sách video từ EPO
 * @param {number} page - Trang hiện tại
 * @param {string} category - Thể loại (ví dụ: 'asian', 'japanese', 'all')
 * @param {string} order - Sắp xếp (latest, top-rated, v.v.)
 */
// --- TRONG FILE: src/lib/movies.js ---

export async function getEpoVideos(page = 1, category = 'all', order = 'latest') {
  try {
    // Ép searchQuery luôn có giá trị để API không trả về kết quả ngẫu nhiên
    const searchQuery = (category && category !== 'all') ? category : 'all';

    const params = new URLSearchParams({
      query: searchQuery,
      per_page: '32', // Eporner hoạt động tốt nhất với số 30
      page: page.toString(),
      thumbsize: 'big',
      order: order,
      format: 'json'
    });

    const url = `${EPO_BASE_URL}/search/?${params.toString()}`;
    // Tăng revalidate lên một chút để ổn định dữ liệu giữa các trang
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) return { videos: [], total_pages: 1 };

    const data = await res.json();
    
    // Nếu API trả về "lèo tèo", có thể do từ khóa quá hẹp. 
    // Ta bóc tách cẩn thận để tránh lỗi render
    const formattedVideos = (data.videos || []).map(v => ({
      id: v.id,
      title: v.title,
      thumb: v.default_thumb?.src || (Array.isArray(v.thumbs) ? v.thumbs[0]?.src : ''), 
      preview_url: v.preview_url || v.test_previews || "", 
      quality: v.quality || 'HD', // Lấy thêm quality từ gốc
      duration: v.length_min,
      added: v.added, 
      views: v.views, 
      rate: v.rate
    }));

    // CẬP NHẬT: Eporner trả về số lượng trang đôi khi bị "ảo", 
    // ta lấy đúng số từ data.total_pages nhưng giới hạn tối đa để tránh lỗi phân trang vô tận
    return { 
      videos: formattedVideos, 
      total_pages: Math.min(data.total_pages || 1, 500), // Giới hạn 500 trang cho ổn định
      current_category: category 
    };
  } catch (error) {
    console.error("EPO API Error:", error);
    return { videos: [], total_pages: 1 };
  }
}

export async function getEpoVideoDetail(id) {
  const data = await safeFetch(`https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`, { next: { revalidate: 3600 } });
  return Array.isArray(data) ? data[0] : data;
}

// Lấy phim gợi ý dựa trên thể loại (Related Movies)
export async function getRelatedMovies(categorySlug, limit = 8) {
  const data = await safeFetch(`${BASE_URL}/films/the-loai/${categorySlug}?page=1`, { next: { revalidate: 3600 } });
  return data?.items?.slice(0, limit) || [];
}