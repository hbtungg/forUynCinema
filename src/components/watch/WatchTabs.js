'use client';

// ── Mock data bình luận (Giữ nguyên của anh) ──────────────────────

// ── Mock data bình luận ──────────────────────────────────────────
const MOCK_COMMENTS = [
  {
    id: 1,
    avatar: '🧑‍💻',
    name: 'minhduc.99',
    time: '2 giờ trước',
    text: 'Phim hay vãi, tập này căng thẳng quá xem mà tim đập loạn 😭🔥',
    likes: 42,
  },
  {
    id: 2,
    avatar: '👩‍🦰',
    name: 'linh_xinh_gai',
    time: '5 giờ trước',
    text: 'Ôi trời diễn xuất của nam chính ở tập này đỉnh thật sự, xúc động đến chảy nước mắt luôn 😢❤️',
    likes: 87,
  },
  {
    id: 3,
    avatar: '🎬',
    name: 'phimmaniac',
    time: '1 ngày trước',
    text: 'Đã xem đi xem lại 3 lần rồi mà vẫn không chán. Đỉnh nóc kịch trần!',
    likes: 135,
  },
  {
    id: 4,
    avatar: '🕵️',
    name: 'anonymous_kun',
    time: '2 ngày trước',
    text: 'Plot twist tập 12 ai đoán được không? Mình bị sốc hoàn toàn 😤',
    likes: 29,
  },
  {
    id: 5,
    avatar: '🌸',
    name: 'hana.watch',
    time: '3 ngày trước',
    text: 'Sub Vietsub dịch mượt lắm, cảm ơn team đã làm việc chăm chỉ ❤️🙏',
    likes: 61,
  },
];

// ── Component Sóng nhạc nhấp nháy khi đang phát ──────────────────
function PlaybackIndicator() {
  return (
    <span className="flex items-end gap-[2px] h-3 shrink-0">
      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '60%' }} />
      <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '80%' }} />
    </span>
  );
}

export default function WatchTabs({
  activeTab,
  setActiveTab,
  episodeChunks,
  activeChunk,
  setActiveChunk,
  servers,
  selectedServer,
  handleServerChange,
  currentEpisodes,
  selectedEpisode,
  handleEpisodeChange,
  movie,
}) {
  const TABS = [
    { id: 'episodes', label: 'Tập phim', icon: '🎬' },
    { id: 'comments', label: 'Bình luận', icon: '💬', badge: 128 },
  ];

  const displayEpisodes = episodeChunks[activeChunk] || currentEpisodes;

  return (
    <div className="space-y-4">
      {/* ── TAB BAR ── */}
      <div className="flex items-center gap-1 border-b border-white/[0.04]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 pb-3 pt-1 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <span className="text-xs">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${
                activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-600'
              }`}>{tab.badge}</span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 inset-x-3 h-[2px] bg-red-500 rounded-full shadow-[0_-2px_10px_rgba(220,38,38,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB: TẬP PHIM (GIAO DIỆN THẺ THUMBNAIL CUỘN NGANG)
      ══════════════════════════════════════════ */}
      {activeTab === 'episodes' && (
        <div className="space-y-4 w-full">
          
          {/* Top Toolbar gọn gàng căn góc trái */}
          <div className="flex flex-wrap items-center gap-3 w-full border-b border-white/[0.02] pb-3">
            {servers.length > 1 && (
              <div className="relative shrink-0">
                <select
                  value={selectedServer}
                  onChange={e => handleServerChange(Number(e.target.value))}
                  className="appearance-none bg-[#141417] border border-white/5 hover:border-white/10 pl-3 pr-8 py-1.5 rounded-xl text-[10px] font-black text-zinc-400 outline-none cursor-pointer transition-all"
                >
                  {servers.map((s, i) => <option key={i} value={i}>{s.server_name || `Mùa ${i + 1}`}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[9px]">▾</span>
              </div>
            )}

            {episodeChunks.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {episodeChunks.map((chunk, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChunk(i)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                      activeChunk === i
                        ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/10'
                        : 'bg-white/[0.01] border-white/[0.04] text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {chunk[0].name}–{chunk[chunk.length - 1].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🚀 LƯU TRÚ DẠNG THẺ CUỘN NGANG CỰC ĐẲNG CẤP */}
          <div className="w-full relative">
            <div 
              className="w-full overflow-x-auto flex items-center gap-3 pb-4 pt-1 custom-scrollbar scroll-smooth"
              style={{ scrollbarWidth: 'thin' }}
            >
              {displayEpisodes.map((ep) => {
                const idx = currentEpisodes.indexOf(ep);
                const isActive = selectedEpisode === idx;
                const label = ep.name === 'Full' ? 'FULL' : `Tập ${ep.name}`;

                return (
                  <button
                    key={idx}
                    onClick={() => handleEpisodeChange(idx, ep.name)}
                    className={`shrink-0 w-[150px] sm:w-[170px] aspect-[16/10] rounded-xl overflow-hidden relative border transition-all duration-300 group flex flex-col justify-end text-left ${
                      isActive
                        ? 'border-red-500 shadow-[0_4px_24px_rgba(220,38,38,0.25)] ring-1 ring-red-500'
                        : 'border-white/[0.05] hover:border-white/20'
                    }`}
                  >
                    {/* Ảnh nền Thumbnail phim làm background cho thẻ */}
                    <img 
                      src={movie?.thumb_url} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500 pointer-events-none" 
                    />
                    
                    {/* Lớp phủ tối chuyển màu để hiện text chân thực */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

                    {/* Nút Play / Sóng nhạc nổi bật ở trung tâm khi hover hoặc active */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 z-10 ${
                      isActive ? 'opacity-100 scale-100 bg-red-600/20 border-red-500/30' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      {isActive ? (
                        <PlaybackIndicator />
                      ) : (
                        <span className="text-[10px] text-white pl-[2px]">▶</span>
                      )}
                    </div>

                    {/* Nội dung thông tin chữ ở đáy thẻ */}
                    <div className="relative z-10 p-3 w-full bg-gradient-to-t from-black/90 to-transparent">
                      <p className={`text-[12px] font-black tracking-wide leading-none ${isActive ? 'text-red-400' : 'text-white'}`}>
                        {ep.name === 'Full' ? 'FULL' : ep.name}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1 truncate">
                        {label} • 45 phút
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ghi chú trạng thái tinh tế dưới khay thẻ */}
          {selectedEpisode !== null && currentEpisodes[selectedEpisode] && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/5 border border-red-500/10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <p className="text-[9px] font-black text-red-400/80 uppercase tracking-widest">
                Đang phát: {currentEpisodes[selectedEpisode].name === 'Full' ? 'Full' : `Tập ${currentEpisodes[selectedEpisode].name}`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: BÌNH LUẬN (Giữ nguyên vẹn của anh)
      ══════════════════════════════════════════ */}
      {activeTab === 'comments' && (
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111114]/60 border border-white/[0.04] mb-4">
            <span className="text-base">😊</span>
            <input type="text" placeholder="Viết bình luận..." className="flex-1 bg-transparent text-[12px] text-zinc-300 placeholder-zinc-600 outline-none" />
            <button className="shrink-0 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 transition-all text-[10px] font-black text-white uppercase tracking-wider">Gửi</button>
          </div>
          {MOCK_COMMENTS.map(c => (
            <div key={c.id} className="group flex items-start gap-3 px-3 py-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="shrink-0 w-9 h-9 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-base">{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[11px] font-black text-zinc-200">{c.name}</span>
                  <span className="text-[9px] text-zinc-600">{c.time}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}