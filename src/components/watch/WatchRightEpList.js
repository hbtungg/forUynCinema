'use client';

import { ChevronDown, Play } from 'lucide-react';

function formatEpisodeLabel(name) {
  if (!name || name === 'Full' || name === 'FULL') return 'FULL';
  const text = String(name).trim();
  if (/^tập\s+/i.test(text)) {
    return text.replace(/^tập\s*/i, 'Tập ');
  }
  if (/^ep\s*\d+/i.test(text)) {
    return text.replace(/^ep\s*/i, 'Tập ');
  }
  if (/^\d+$/i.test(text)) {
    return `Tập ${text}`;
  }
  return text.startsWith('Tập ') ? text : `Tập ${text}`;
}

export default function WatchRightEpList({ 
  currentEpisodes, 
  episodeChunks, 
  activeChunk, 
  setActiveChunk, 
  selectedEpisode, 
  handleEpisodeChange 
}) {
  return (
    /* 🚀 ĐÃ SỬA: Đưa về bg-transparent, gộp mượt mà vào lòng khay pha lê aside bọc ngoài */
    <div className="w-full bg-transparent border border-white/5 rounded-2xl overflow-hidden font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* TIÊU ĐỀ KHAY TẬP & BỘ CHỌN CHUNKS CAO CẤP */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.01]">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d0c5b5]/40">Danh sách tập</span>
        
        {episodeChunks.length > 1 && (
          <div className="relative flex items-center bg-[#0F1326]/60 border border-white/10 rounded-lg px-2.5 py-1 transition-all hover:border-[#E6C687]/30 group">
            <select 
              value={activeChunk} 
              onChange={e => setActiveChunk(Number(e.target.value))} 
              className="appearance-none bg-transparent text-[10px] font-bold text-[#d0c5b5]/70 group-hover:text-[#ffe3ae] outline-none pr-4 cursor-pointer focus:ring-0 focus:border-none"
            >
              {episodeChunks.map((chunk, i) => (
                /* Ép nền xanh đêm cho option để tránh bị lỗi loang màu trắng mặc định của OS */
                <option key={i} value={i} className="bg-[#0F1326] text-[#e8e1da] font-sans py-2">
                  Tập {chunk[0].name} – {chunk[chunk.length - 1].name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 w-3 h-3 text-[#d0c5b5]/40 group-hover:text-[#ffe3ae] transition-colors" />
          </div>
        )}
      </div>

      {/* DANH SÁCH CÁC TẬP PHIM CUỘN TRƠN TRU */}
      <div className="overflow-y-auto max-h-[340px] px-2 py-2 space-y-1 custom-scrollbar">
        {currentEpisodes.map((ep, idx) => {
          const isActive = selectedEpisode === idx;
          const globalChunkIdx = Math.floor(idx / 20);
          if (episodeChunks.length > 1 && globalChunkIdx !== activeChunk) return null;
          const epLabel = formatEpisodeLabel(ep.name);

          return (
            <button 
              key={idx} 
              onClick={() => handleEpisodeChange(idx, ep.name)} 
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 group focus:outline-none cursor-pointer ${
                isActive 
                  ? 'bg-[#E6C687]/10 border border-[#E6C687]/20 text-[#ffe3ae] shadow-[0_0_12px_rgba(230,198,135,0.15)]' 
                  : 'text-[#d0c5b5]/50 border border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 w-full">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {isActive ? (
                    /* 🚀 HIỆU ỨNG SÓNG ÂM MOONLIGHT GOLD NHẤP NHÁY SANG CHẢNH */
                    <span className="flex items-end gap-[2px] h-2.5 shrink-0 pt-0.5">
                      <span className="w-[1.5px] rounded-full bg-[#E6C687] shadow-[0_0_8px_#E6C687] animate-[sb_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
                      <span className="w-[1.5px] rounded-full bg-[#E6C687] shadow-[0_0_8px_#E6C687] animate-[sb_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '60%' }} />
                      <span className="w-[1.5px] rounded-full bg-[#E6C687] shadow-[0_0_8px_#E6C687] animate-[sb_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '80%' }} />
                    </span>
                  ) : (
                    <Play className="w-2.5 h-2.5 text-[#d0c5b5]/30 group-hover:text-[#ffe3ae] transition-colors fill-current opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                  )}
                </span>
                
                {/* Tên tập phim dùng font mono cho các chữ số đều tăm tắp */}
                <span className={`text-xs font-bold truncate ${isActive ? 'font-sans' : 'font-sans opacity-80 group-hover:opacity-100'}`}>
                  {epLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TẬP HỢP KÝ TỰ ANIMATION SÓNG ÂM MƯỢT MÀ CHỐNG GIẬT LAG */}
      <style jsx global>{`
        @keyframes sb {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}