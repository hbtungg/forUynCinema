'use client';

function formatEpisodeLabel(name) {
  if (!name || name === 'Full' || name === 'FULL') return 'FULL';
  const text = String(name).trim();
  if (/^tập\s+/i.test(text)) {
    return text.replace(/^tập\s+/i, 'Tập ');
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
    <div className="hidden lg:block dark:bg-[#111115] bg-white border dark:border-white/5 border-zinc-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b dark:border-white/5 border-zinc-100">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Danh sách tập</span>
        {episodeChunks.length > 1 && (
          <div className="relative">
            <select 
              value={activeChunk} 
              onChange={e => setActiveChunk(Number(e.target.value))} 
              className="appearance-none bg-transparent text-[10px] font-black text-zinc-600 dark:text-zinc-500 outline-none pr-4 cursor-pointer"
            >
              {episodeChunks.map((chunk, i) => (
                <option key={i} value={i}>{chunk[0].name}–{chunk[chunk.length - 1].name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">▾</span>
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[320px] px-2 py-2 space-y-0.5 custom-scrollbar">
        {currentEpisodes.map((ep, idx) => {
          const isActive = selectedEpisode === idx;
          const globalChunkIdx = Math.floor(idx / 20);
          if (episodeChunks.length > 1 && globalChunkIdx !== activeChunk) return null;
          const epLabel = formatEpisodeLabel(ep.name);

          return (
            <button 
              key={idx} 
              onClick={() => handleEpisodeChange(idx, ep.name)} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-red-600/10 text-white dark:text-white' 
                  : 'dark:text-zinc-500 text-zinc-600 dark:hover:bg-white/[0.02] hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {isActive ? (
                    <span className="flex items-end gap-[2px] h-3 shrink-0">
                      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
                      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '60%' }} />
                      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '80%' }} />
                    </span>
                  ) : <span className="text-[9px] text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400">▶</span>}
                </span>
                <span className="text-[12px] font-black tracking-wide">{epLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}