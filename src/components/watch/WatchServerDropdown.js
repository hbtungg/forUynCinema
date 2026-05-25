'use client';

export default function WatchServerDropdown({ servers, selectedServer, handleServerChange }) {
  if (!servers || servers.length <= 1) return null;

  return (
    <div className="relative group">
      <div className="bg-[#111115] dark:bg-[#111115] bg-white border dark:border-white/5 border-zinc-200 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-zinc-300 dark:hover:border-white/10 active:scale-[0.99] transition-all">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Máy chủ</span>
        <span className="flex items-center gap-1.5 text-[10px] font-black text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {servers[selectedServer]?.server_name || 'Server 1'}
          <svg className="w-3 height-3 text-zinc-500 ml-1 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      <div className="absolute right-0 top-full mt-2 w-48 dark:bg-[#111115]/95 bg-white backdrop-blur-xl border dark:border-white/5 border-zinc-200 rounded-2xl p-1.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-500 border-b dark:border-white/[0.02] border-zinc-100 mb-1">
          Chọn nguồn phát
        </div>
        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
          {servers.map((srv, idx) => {
            const isSelected = selectedServer === idx;
            return (
              <button
                key={idx}
                onClick={() => handleServerChange(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-600 text-white font-black'
                    : 'dark:text-zinc-400 text-zinc-600 dark:hover:bg-white/[0.04] hover:bg-zinc-100 dark:hover:text-white hover:text-zinc-900'
                }`}
              >
                <span>{srv?.server_name || `Server ${idx + 1}`}</span>
                {isSelected && <span className="text-[9px]">●</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}