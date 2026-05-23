'use client';

export default function WatchPlayer({ 
  movie, 
  currentEp, 
  selectedServer, 
  epName, 
  isLoading, 
  iframeError, 
  getEmbedUrl, 
  setIsLoading, 
  setIframeError 
}) {
  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-4 pb-10 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <p className="text-[13px] font-black text-white leading-none">{movie.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          S{selectedServer + 1}E{epName}
          {currentEp?.title ? ` · ${currentEp.title}` : ''}
        </p>
      </div>

      {/* Spinner */}
      {isLoading && !iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black">Đang tải...</span>
        </div>
      )}

      {/* Error */}
      {iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black">
          <span className="text-4xl">📡</span>
          <p className="text-zinc-400 text-sm font-bold">Nguồn phim gặp sự cố</p>
          <button
            onClick={() => { setIframeError(false); setIsLoading(true); }}
            className="px-5 py-2 rounded-xl border border-zinc-700 text-[11px] font-black uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-red-500 transition-all"
          >
            Thử lại
          </button>
        </div>
      )}

      {currentEp?.embed && !iframeError ? (
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          title={`${movie.name} - Tập ${epName}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setIframeError(true); }}
        />
      ) : !iframeError ? (
        <div className="flex items-center justify-center h-full text-zinc-700 text-sm italic">
          Không có nguồn phim
        </div>
      ) : null}
    </div>
  );
}