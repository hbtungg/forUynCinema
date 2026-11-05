'use client';

import { useState } from 'react';
import { ChevronDown, Play, MessageSquare, Film, Send } from 'lucide-react';

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

// ── Mock data bình luận (Giữ nguyên vẹn của anh) ──────────────────────
const MOCK_COMMENTS = [
  { id: 1, avatar: '🧑‍💻', name: 'minhduc.99', time: '2 giờ trước', text: 'Phim hay vãi, tập này căng thẳng quá xem mà tim đập loạn 😭🔥' },
  { id: 2, avatar: '👩‍🦰', name: 'linh_xinh_gai', time: '5 giờ trước', text: 'Ôi trời diễn xuất của nam chính ở tập này đỉnh thật sự, xúc động đến chảy nước mắt luôn 😢❤️' },
  { id: 3, avatar: '🎬', name: 'phimmaniac', time: '1 ngày trước', text: 'Đã xem đi xem lại 3 lần rồi mà vẫn không chán. Đỉnh nóc kịch trần!' },
  { id: 4, avatar: '🕵️', name: 'anonymous_kun', time: '2 ngày trước', text: 'Plot twist tập 12 ai đoán được không? Mình bị sốc hoàn toàn 😤' },
  { id: 5, avatar: '🌸', name: 'hana.watch', time: '3 ngày trước', text: 'Sub Vietsub dịch mượt lắm, cảm ơn team đã làm việc chăm chỉ ❤️🙏' },
];

// ── Component Sóng nhạc nhấp nháy màu vàng Moonlight Gold ──
function PlaybackIndicator() {
  return (
    <span className="flex items-end gap-[2px] h-2.5 shrink-0 pt-0.5">
      <span className="w-[1.5px] rounded-full bg-[#e8e8e8]  animate-[sb_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
      <span className="w-[1.5px] rounded-full bg-[#e8e8e8]  animate-[sb_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '60%' }} />
      <span className="w-[1.5px] rounded-full bg-[#e8e8e8]  animate-[sb_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '80%' }} />
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
  selectedProvider,
  setSelectedProvider,
}) {
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);

  const TABS = [
    { id: 'episodes', label: 'Tập phim', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'comments', label: 'Bình luận', icon: <MessageSquare className="w-3.5 h-3.5" />, badge: 128 },
  ];

  const displayEpisodes = episodeChunks[activeChunk] || currentEpisodes;

  return (
    <div className="space-y-5 font-sans select-none" style={{ fontFamily: "var(--font-main)" }}>
      
      {/* ── HIGH-END TAB BAR ── */}
      <div className="flex items-center gap-2 border-b border-white/5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 pb-3 pt-1 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer focus:outline-none ${
              activeTab === tab.id ? 'text-[#ffffff]' : 'text-[#808080] hover:text-[#ffffff]'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-[#e8e8e8]' : 'opacity-50'}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold transition-colors ${
                activeTab === tab.id ? 'bg-[#e8e8e8]/20 text-[#ffffff] border border-[#e8e8e8]/30' : 'bg-white/5 text-[#808080]'
              }`}>{tab.badge}</span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 inset-x-2 h-px bg-[#e8e8e8] " />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB: TẬP PHIM (GIAO DIỆN THỂ NGANG CAO CẤP)
          ══════════════════════════════════════════ */}
      {activeTab === 'episodes' && (
        <div className="space-y-4 w-full animate-in fade-in duration-300">

          {/* Top Toolbar căn góc trái mượt mà */}
          <div className="flex flex-wrap items-center gap-2 w-full border-b border-white/5 pb-3">

            {/* Bộ chọn nguồn phát (Provider) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProviderMenuOpen((prev) => !prev)}
                className="bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-[#b8b8b8] hover:text-[#ffffff] flex items-center gap-2 cursor-pointer transition-all duration-300 focus:outline-none hover:border-[#e8e8e8]/30"
              >
                <span className="w-1 h-1 rounded-full bg-[#e8e8e8]  animate-pulse" />
                <span>{selectedProvider === 'nguonc' ? 'Nguồn C' : selectedProvider === 'kkphim' ? 'KKPhim' : 'Tự động'}</span>
                <ChevronDown className={`w-3 h-3 text-[#808080] transition-transform duration-300 ${isProviderMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute left-0 top-full mt-2 w-40 glass-surface border border-white/10 rounded-2xl p-1 shadow-2xl transition-all duration-200 z-50 origin-top-left ${isProviderMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}>
                {/* Options bọc kính mờ */}
                {[
                  { value: 'auto', label: 'Tự động' },
                  { value: 'nguonc', label: 'Nguồn C' },
                  { value: 'kkphim', label: 'KKPhim' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(option.value);
                      setIsProviderMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none ${
                      selectedProvider === option.value
                        ? 'bg-[#e8e8e8]/10 text-[#ffffff] border border-[#e8e8e8]/20 '
                        : 'text-[#b8b8b8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selectedProvider === option.value && <span className="text-[#e8e8e8] text-[6px]">●</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Bộ chọn Mùa / Server */}
            {servers.length > 1 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsServerMenuOpen((prev) => !prev)}
                  className="bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-[#b8b8b8] hover:text-[#ffffff] flex items-center gap-2 cursor-pointer transition-all duration-300 focus:outline-none hover:border-[#e8e8e8]/30"
                >
                  <span className="w-1 h-1 rounded-full bg-[#e8e8e8]  animate-pulse" />
                  <span>{servers[selectedServer]?.server_name || `Mùa ${selectedServer + 1}`}</span>
                  <ChevronDown className={`w-3 h-3 text-[#808080] transition-transform duration-300 ${isServerMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute left-0 top-full mt-2 w-40 glass-surface border border-white/10 rounded-2xl p-1 shadow-2xl transition-all duration-200 z-50 origin-top-left ${isServerMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                    {servers.map((s, i) => {
                      const isSelected = selectedServer === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            handleServerChange(i);
                            setIsServerMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none ${
                            isSelected
                              ? 'bg-[#e8e8e8]/10 text-[#ffffff] border border-[#e8e8e8]/20 '
                              : 'text-[#b8b8b8] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{s.server_name || `Mùa ${i + 1}`}</span>
                          {isSelected && <span className="text-[#e8e8e8] text-[6px]">●</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cụm nút chọn nhóm tập phân mảnh */}
            {episodeChunks.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {episodeChunks.map((chunk, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChunk(i)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer focus:outline-none ${
                      activeChunk === i
                        ? 'bg-[#e8e8e8]/10 border-[#e8e8e8]/40 text-[#ffffff] '
                        : 'bg-white/[0.01] border-white/5 text-[#808080] hover:text-[#ffffff] hover:bg-white/5'
                    }`}
                  >
                    {chunk[0].name}–{chunk[chunk.length - 1].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* KHO LƯU TRÚ DẠNG THÈ THUMBNAIL NGANG MƯỢT MÀ */}
          <div className="w-full relative">
            <div className="w-full overflow-x-auto flex items-center gap-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              {displayEpisodes.map((ep) => {
                const idx = currentEpisodes.indexOf(ep);
                const isActive = selectedEpisode === idx;
                const label = formatEpisodeLabel(ep.name);

                return (
                  <button
                    key={idx}
                    onClick={() => handleEpisodeChange(idx, ep.name)}
                    className={`shrink-0 w-[140px] sm:w-[160px] aspect-[16/10] rounded-xl overflow-hidden relative border transition-all duration-300 group flex flex-col justify-end text-left focus:outline-none cursor-pointer ${
                      isActive
                        ? 'border-[#e8e8e8]/50 '
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={movie?.poster_url || movie?.thumb_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent z-0" />

                    {/* Biểu tượng Play / Sóng âm kính mờ lơ lửng tâm card */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-surface border border-white/10 flex items-center justify-center transition-all duration-300 z-10 ${
                      isActive ? 'opacity-100 scale-100 bg-[#e8e8e8]/20 border-[#e8e8e8]/30' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      {isActive ? <PlaybackIndicator /> : <Play className="w-2.5 h-2.5 text-white fill-current pl-[1px]" />}
                    </div>

                    <div className="relative z-10 p-3 w-full">
                      <p className={`text-[11px] font-bold tracking-wide leading-none ${isActive ? 'text-[#ffffff]' : 'text-[#ffffff]'}`}>
                        {label}
                      </p>
                      <p className="text-[9px] font-semibold text-[#808080] uppercase tracking-wider mt-1 truncate">
                        {label} · 45 phút
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ghi chú trạng thái tinh tế dưới chân khay thẻ */}
          {selectedEpisode !== null && currentEpisodes[selectedEpisode] && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e8e8e8]/5 border border-[#e8e8e8]/10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8e8e8]  animate-pulse shrink-0" />
              <p className="text-[9px] font-bold text-[#ffffff]/80 uppercase tracking-widest">
                Đang phát: {formatEpisodeLabel(currentEpisodes[selectedEpisode].name)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: BÌNH LUẬN KÍNH MỜ SANG TRỌNG ── */}
      {activeTab === 'comments' && (
        <div className="space-y-2.5 animate-in fade-in duration-300">
          
          {/* Ô nhập bình luận */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/5 mb-4 focus-within:border-[#e8e8e8]/30 transition-colors">
            <span className="text-sm">😊</span>
            <input 
              type="text" 
              placeholder="Viết bình luận..." 
              className="flex-1 bg-transparent text-xs text-[#ffffff] placeholder-[#b8b8b8]/20 outline-none font-medium" 
            />
            <button className="shrink-0 w-7 h-7 flex items-center justify-center rounded-xl bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none">
              <Send className="w-3 h-3" />
            </button>
          </div>

          {/* Khay danh sách các bình luận */}
          <div className="space-y-1">
            {MOCK_COMMENTS.map(c => (
              <div key={c.id} className="group flex items-start gap-3.5 px-3 py-3 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-300">
                <div className="shrink-0 w-9 h-9 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center text-base shadow-inner">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#ffffff]">{c.name}</span>
                    <span className="text-[9px] text-[#808080] font-semibold uppercase font-mono tracking-wider">{c.time}</span>
                  </div>
                  <p className="text-xs text-[#b8b8b8] leading-relaxed font-medium">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ANIMATION SÓNG NHẠC CHỐNG LỖI COMPILER TRÊN NHIỀU TRÌNH DUYỆT */}
      <style jsx global>{`
        @keyframes sb {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}