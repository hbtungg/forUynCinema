// --- FILE: src/lib/movies.js ---
const BASE_URL = "https://phim.nguonc.com/api";

// 1. Lấy phim mới cập nhật (Trang chủ)
export async function getMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/films/phim-moi-cap-nhat?page=${page}`, { 
    next: { revalidate: 3600 } 
  });
  return res.json();
}

// 2. Lấy chi tiết một bộ phim
export async function getMovieDetail(slug) {
  const res = await fetch(`${BASE_URL}/film/${slug}`);
  return res.json();
}

// 3. Tìm kiếm phim
export async function searchMovies(keyword, page = 1) {
  const res = await fetch(`${BASE_URL}/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return res.json();
}

// 4. Lấy phim theo THỂ LOẠI (Đã tích hợp lọc Phim bộ/Phim lẻ)
export async function getMoviesByCategory(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/the-loai/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  return res.json();
}

// 5. Lấy phim theo QUỐC GIA (Đã tích hợp lọc Phim bộ/Phim lẻ)
export async function getMoviesByCountry(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/quoc-gia/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  return res.json();
}

// 6. Lấy phim theo NĂM PHÁT HÀNH
export async function getMoviesByYear(slug, page = 1) {
  const res = await fetch(`${BASE_URL}/films/nam-phat-hanh/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return res.json();
}

// Lấy danh sách tất cả Thể loại từ API
export async function getCategories() {
  const res = await fetch('https://phim.nguonc.com/api/the-loai', { next: { revalidate: 86400 } });
  const data = await res.json();
  return data.items || [];
}

// Lấy danh sách tất cả Quốc gia từ API
export async function getCountries() {
  const res = await fetch('https://phim.nguonc.com/api/quoc-gia', { next: { revalidate: 86400 } });
  const data = await res.json();
  return data.items || [];
}

// --- BỔ SUNG HỆ THỐNG MỚI (LUST API) ---
const LUST_BASE_URL = "https://lust.scathach.id/pornhub";

export async function getPornhubDetail(id) {
  try {
    const res = await fetch(`${LUST_BASE_URL}/get?id=${id}`, {
      // Vì nội dung này có thể thay đổi hoặc cần tính riêng tư, 
      // anh có thể chỉnh revalidate thấp xuống hoặc dùng no-store
      next: { revalidate: 1800 } 
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Lỗi khi fetch Lust API:", error);
    return null;
  }
}

// src/lib/movies.js
const EPO_BASE_URL = "https://www.eporner.com/api/v2/video";

export async function getEpoVideos(page = 1, query = 'all') {
  try {
    const params = new URLSearchParams({
      query: query,
      per_page: '30',
      page: page.toString(),
      thumbsize: 'big', // Lấy size lớn theo docs
      order: 'latest',
      format: 'json'
    });

    const res = await fetch(`${EPO_BASE_URL}/search/?${params.toString()}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return { videos: [] };

    const data = await res.json();
    
    // Ánh xạ dữ liệu để tương thích với MovieCard của anh
    const formattedVideos = (data.videos || []).map(v => ({
      id: v.id,
      title: v.title,
      // Lấy đúng đường dẫn ảnh từ object default_thumb của EPO
      thumb: v.default_thumb?.src || '', 
      duration: v.length_min,
      added: v.added
    }));

    return { videos: formattedVideos };
  } catch (error) {
    console.error("EPO API Error:", error);
    return { videos: [] };
  }
}

export async function getEpoVideoDetail(id) {
  try {
    const res = await fetch(`https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return null;
    const data = await res.json();
    
    // EPO trả về object video trực tiếp hoặc mảng, ta lấy cái đầu tiên
    const video = Array.isArray(data) ? data[0] : data;
    return video;
  } catch (error) {
    console.error("Lỗi lấy chi tiết EPO:", error);
    return null;
  }
}