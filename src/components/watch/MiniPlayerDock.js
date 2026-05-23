'use client';

export default function MiniPlayerDock({
  movie,
  epName,
  selectedEpisode,
  totalEps,
  currentEpisodes,
  handleEpisodeChange,
  playerRef,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d11]/95 border-t border-zinc-800/60 backdrop-blur-xl px-4 py-2.5 flex items-center gap-4 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]">
      
      {/* Khối bên trái: Ảnh thu nhỏ + Tên phim */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {movie.thumb_url && (
          <img 
            src={movie.thumb_url} 
            className="w-14 h-9 object-cover rounded-lg shrink-0 border border-zinc-800" 
            alt="" 
          />
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-white truncate leading-none">
            {movie.name}
          </p>
          <p className="text-[10px] text-red-500 font-bold mt-0.5">
            Đang phát · Tập {epName}
          </p>
        </div>
      </div>

      {/* Khối bên phải: Các nút bấm điều khiển chuyển tập */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Nút Tập trước */}
        <button 
          onClick={() => selectedEpisode > 0 && handleEpisodeChange(selectedEpisode - 1, currentEpisodes[selectedEpisode - 1]?.name)} 
          disabled={selectedEpisode === 0} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-30 text-sm transition-all active:scale-95"
        >
          ⏮
        </button>
        
        {/* Nút Tạm dừng */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 text-white text-sm transition-all active:scale-95">
          ⏸
        </button>
        
        {/* Nút Tập tiếp theo */}
        <button 
          onClick={() => selectedEpisode < totalEps - 1 && handleEpisodeChange(selectedEpisode + 1, currentEpisodes[selectedEpisode + 1]?.name)} 
          disabled={selectedEpisode === totalEps - 1} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-30 text-sm transition-all active:scale-95"
        >
          ⏭
        </button>
        
        {/* Nút Cuộn nhanh lên Trình phát */}
        <button 
          onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} 
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs transition-all active:scale-95"
        >
          ⛶
        </button>
      </div>

    </div>
  );
}