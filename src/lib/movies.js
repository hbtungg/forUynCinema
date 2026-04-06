// src/lib/movies.js
const BASE_URL = "https://phim.nguonc.com/api";

export async function getMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/films/phim-moi-cap-nhat?page=${page}`, { 
    next: { revalidate: 3600 } 
  });
  return res.json();
}

export async function getMovieDetail(slug) {
  const res = await fetch(`${BASE_URL}/film/${slug}`);
  return res.json();
}

export async function searchMovies(keyword, page = 1) {
  const res = await fetch(`${BASE_URL}/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return res.json();
}