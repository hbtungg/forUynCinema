'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Tv, ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_SHOW = 20;

export default function EpisodeList({ episodes, slug }) {
  const [activeServer, setActiveServer] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!episodes || episodes.length === 0) {
    return (
      <p className="text-xs text-[#808080] italic pl-1">
        Đang cập nhật tập phim...
      </p>
    );
  }

  const currentServer = episodes[activeServer];
  const items = currentServer?.items || [];
  const visibleItems = expanded ? items : items.slice(0, INITIAL_SHOW);
  const hasMore = items.length > INITIAL_SHOW;

  return (
    <div className="space-y-5">

      {/* ── SERVER TABS ── */}
      {episodes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {episodes.map((server, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveServer(idx); setExpanded(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 cursor-pointer focus:outline-none active:scale-95
                ${activeServer === idx
                  ? 'bg-[#e8e8e8]/15 border-[#e8e8e8]/40 text-[#ffffff] '
                  : 'bg-white/[0.02] border-white/5 text-[#808080] hover:border-white/15 hover:text-[#b8b8b8]'
                }`}
            >
              <Tv className="w-3 h-3" />
              {server?.server_name || `Server ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* ── EPISODE GRID ── */}
      <div className="glass-surface border border-white/5 p-5 rounded-2xl shadow-2xl">

        {/* Đếm tập */}
        <p className="text-[10px] text-[#808080] font-semibold mb-4 tracking-wide">
          {items.length} tập · hiển thị {visibleItems.length}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {visibleItems.map((ep, eIdx) => (
            <Link
              key={eIdx}
              href={`/watch/${slug}?ep=${ep?.name}`}
              className="bg-white/[0.02] border border-white/5 px-3 py-3 rounded-xl flex items-center justify-between group hover:border-[#e8e8e8]/40 hover:bg-white/5 transition-all duration-200"
            >
              <span className="text-xs font-bold text-[#ffffff] truncate group-hover:text-[#ffffff]">
                Tập {ep?.name}
              </span>
              <Play className="w-3 h-3 shrink-0 text-[#e8e8e8] opacity-0 group-hover:opacity-100 transition-all duration-200 fill-current" />
            </Link>
          ))}
        </div>

        {/* ── SHOW MORE / LESS BUTTON ── */}
        {hasMore && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#e8e8e8]/20 text-[#b8b8b8] hover:text-[#ffffff] text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer focus:outline-none active:scale-[0.98]"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Thu gọn</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Xem thêm {items.length - INITIAL_SHOW} tập</>
            )}
          </button>
        )}
      </div>

    </div>
  );
}