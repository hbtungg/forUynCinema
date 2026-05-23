'use client';

export default function WatchMetadata({ movie, genre, country, isDescExpanded, setIsDescExpanded }) {
  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {movie.name}
            </h1>
            {movie.year && <span className="text-[8px] font-black bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">{movie.year}</span>}
            <span className="text-[8px] font-black bg-red-600/20 border border-red-600/40 px-1.5 py-0.5 rounded text-red-400">18+</span>
            {movie.quality && <span className="text-[8px] font-black bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">{movie.quality}</span>}
            {movie.language && <span className="text-[8px] font-black bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">{movie.language}</span>}
          </div>
          <p className="text-zinc-500 text-[11px]">
            {[genre, country, movie.time].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center justify-end gap-1 text-amber-400 font-black text-xl">
            <span className="text-base">★</span>
            <span>9.2</span>
            <span className="text-zinc-600 text-xs font-normal">/ 10</span>
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">12.5K đánh giá</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'Yêu thích', red: true,  icon: '♥' },
          { label: 'Thêm vào', red: false, icon: '+' },
          { label: 'Chia sẻ',  red: false, icon: '↗' },
        ].map(({ label, red, icon }) => (
          <button key={label} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
            red
              ? 'bg-red-600/10 border-red-500/25 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
          }`}>
            <span>{icon}</span>{label}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-zinc-700 hover:text-white transition-all ml-auto">
          ⚑ Báo lỗi
        </button>
      </div>

      {/* Description */}
      <div>
        <div className={`text-zinc-400 text-[12px] leading-relaxed overflow-hidden transition-all ${isDescExpanded ? '' : 'max-h-[3.6rem]'}`}>
          <div dangerouslySetInnerHTML={{ __html: movie.description }} />
        </div>
        <button
          onClick={() => setIsDescExpanded(v => !v)}
          className="flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-wider text-zinc-600 hover:text-white transition-colors"
        >
          {isDescExpanded ? 'Thu gọn ▲' : 'Hiển thị thêm ▼'}
        </button>
      </div>
    </div>
  );
}