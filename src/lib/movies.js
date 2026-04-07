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
export async function getEpoVideos(page = 1, category = 'all', order = 'latest') {
  try {
    // Nếu category là 'all' thì query mặc định là 'all', ngược lại dùng category làm query
    const searchQuery = category && category !== 'all' ? category : 'all';

    const params = new URLSearchParams({
      query: searchQuery,
      per_page: '30',
      page: page.toString(),
      thumbsize: 'big',
      order: order,
      format: 'json'
    });

    const url = `${EPO_BASE_URL}/search/?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) return { videos: [], total_pages: 1 };

    const data = await res.json();
    
    // FORMAT DỮ LIỆU ĐỂ HIỂN THỊ ĐỒNG BỘ
    const formattedVideos = (data.videos || []).map(v => ({
      id: v.id,
      title: v.title,
      // Lấy ảnh thumbnail chất lượng cao nhất
      thumb: v.default_thumb?.src || (Array.isArray(v.thumbs) ? v.thumbs[0]?.src : ''), 
      duration: v.length_min,
      added: v.added, // Năm phát hành
      views: v.views, // Lượt xem
      rate: v.rate
    }));

    return { 
      videos: formattedVideos, 
      total_pages: data.total_pages || 1,
      current_category: category // Trả về category hiện tại để làm menu highlight
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