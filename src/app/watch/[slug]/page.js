'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function WatchPage({ params }) {
  const decodedParams = use(params);
  const slug = decodedParams.slug;

  const [movie, setMovie] = useState(null);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
        const data = await res.json();
        if (data.movie) {
          setMovie(data.movie);

          const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
          const currentItem = {
            slug: slug,
            name: data.movie.name,
            thumb_url: data.movie.thumb_url,
            time: new Date().toLocaleDateString('vi-VN'),
            episode: data.movie.episodes[selectedServer]?.items[selectedEpisode]?.name || '1'
          };

          const newHistory = [currentItem, ...history.filter(item => item.slug !== slug)].slice(0, 10);
          localStorage.setItem('watchHistory', JSON.stringify(newHistory));
          
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('historyUpdated'));
        }
      } catch (error) {
        console.error("Lỗi lấy phim rồi anh yêu ơi:", error);
      }
    };
    if (slug) fetchMovie();
  }, [slug, selectedServer, selectedEpisode]);

  if (!movie) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-[0.5em] animate-pulse text-[10px]">
      Đang chuẩn bị rạp phim cho Thu Uyên...
    </div>
  );

  const servers = movie.episodes || [];
  const currentEpisodes = servers[selectedServer]?.items || [];

  // --- HÀM XỬ LÝ LINK ĐỂ XOÁ BỎ THÔNG BÁO SAI ---
  const getCleanEmbedUrl = () => {
    let url = currentEpisodes[selectedEpisode]?.embed;
    if (!url) return "";
    
    // Thêm tham số t=0 để ép trình phát hiểu là bắt đầu từ đầu, xóa bỏ 'ký ức' cũ
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=0&autoplay=1`;
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-10 py-6 font-sans flex flex-col items-center overflow-x-hidden">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div className="flex flex-col items-start">
          <Link href="/" className="inline-flex items-center gap-2 group text-zinc-600 hover:text-red-600 transition-all mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quay lại trang chủ</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            {movie.name}
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
            {movie.original_name} • {movie.category?.['3']?.list[0]?.name}
          </p>
        </div>
        
        <div className="flex gap-4 text-zinc-600 text-[9px] font-black uppercase tracking-tighter bg-zinc-900/40 px-5 py-2.5 rounded-full border border-zinc-800/50">
          <span>{movie.time}</span>
          <span className="text-zinc-800">|</span>
          <span>{movie.quality}</span>
          <span className="text-zinc-800">|</span>
          <span className="text-red-800">{movie.language}</span>
        </div>
      </div>

      {/* TRÌNH PHÁT PHIM: SỬ DỤNG SANDBOX ĐỂ CÔ LẬP DỮ LIỆU CŨ */}
      <div className="w-full max-w-5xl aspect-video bg-zinc-950 rounded-[2.5rem] overflow-hidden border-2 border-zinc-900 shadow-2xl mb-8 relative group">
        {currentEpisodes[selectedEpisode]?.embed ? (
          <iframe 
            key={`${slug}-${selectedServer}-${selectedEpisode}`} 
            src={getCleanEmbedUrl()}
            className="w-full h-full"
            allowFullScreen
            // Sandbox giúp chặn Player đọc LocalStorage/Cookie cũ của chính nó
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-700 italic text-xs text-center px-10">
            Nguồn phim đang gặp sự cố hoặc đang cập nhật...
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl space-y-8 pb-10">
        {servers.length > 1 && (
          <div className="space-y-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-600 rounded-full"></span> Chọn Phần / Server
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {servers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedServer(index); setSelectedEpisode(0); }}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${
                    selectedServer === index 
                    ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {server.server_name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-zinc-600 rounded-full"></span> Danh sách tập phim ({currentEpisodes.length})
          </h2>
          <div className="flex flex-wrap gap-2.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {currentEpisodes.map((ep, index) => (
              <button
                key={index}
                onClick={() => setSelectedEpisode(index)}
                className={`min-w-[50px] px-4 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                  selectedEpisode === index 
                  ? 'bg-white border-white text-black scale-105 shadow-xl' 
                  : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                {ep.name === 'Full' ? 'BẢN FULL' : `TẬP ${ep.name}`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-900/50 backdrop-blur-sm">
          <h3 className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.3em]">Nội dung phim</h3>
          <div 
            className="text-zinc-500 text-[11px] leading-relaxed opacity-90 font-medium"
            dangerouslySetInnerHTML={{ __html: movie.description }}
          />
        </div>
      </div>

      <footer className="mt-4 mb-10 text-center opacity-30">
        <p className="text-[8px] uppercase tracking-[0.6em] font-black text-zinc-800 italic">
          Premium Experience for ThuUyn ❤️
        </p>
      </footer>
    </main>
  );
}