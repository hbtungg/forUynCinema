'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ContinueWatching() {
  const [history, setHistory] = useState([]);
  const [showMenu, setShowMenu] = useState(null); // Lưu trữ slug của phim đang mở menu

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('ck_thu_uyn_history') || '{}');
    const historyArray = Object.entries(savedHistory).map(([slug, data]) => ({
      slug,
      ...data
    })).reverse();
    setHistory(historyArray.slice(0, 4));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Hàm xóa từng bộ phim
  const removeItem = (e, slug) => {
    e.preventDefault(); // Ngăn việc bấm vào thẻ Link chuyển trang
    e.stopPropagation();
    
    const savedHistory = JSON.parse(localStorage.getItem('ck_thu_uyn_history') || '{}');
    delete savedHistory[slug]; // Xóa phim khỏi Object
    localStorage.setItem('ck_thu_uyn_history', JSON.stringify(savedHistory));
    
    loadHistory(); // Cập nhật lại giao diện ngay lập tức
    setShowMenu(null);
  };

  if (history.length === 0) return null;

  return (
    <section className="mb-16 animate-in fade-in slide-in-from-left duration-1000 relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">Phim Vợ iu Đang Xem Dở 🍿</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {history.map((item) => (
          <div key={item.slug} className="group relative bg-zinc-900/20 rounded-2xl border border-zinc-800/50 overflow-hidden hover:border-yellow-600/50 transition-all duration-500 shadow-xl">
            
            {/* Nút 3 chấm thần thánh */}
            <div className="absolute top-2 right-2 z-20">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setShowMenu(showMenu === item.slug ? null : item.slug);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors"
              >
                ⋮
              </button>
              
              {/* Menu xóa hiện ra khi bấm */}
              {showMenu === item.slug && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-30 animate-in zoom-in duration-200">
                  <button 
                    onClick={(e) => removeItem(e, item.slug)}
                    className="w-full px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left"
                  >
                    ❌ Xóa phim
                  </button>
                </div>
              )}
            </div>

            <Link href={item.url} className="block">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.thumb} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 pr-8">
                  <h3 className="text-sm font-black text-white line-clamp-1 drop-shadow-md">{item.name}</h3>
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{item.lastEp}</p>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-zinc-900/50">
                <div className="flex justify-between items-center mb-2 text-[9px]">
                   <span className="text-zinc-600 font-mono italic">{item.time.split(',')[0]}</span>
                   <span className="font-black text-yellow-600 uppercase">Xem tiếp →</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="w-[70%] h-full bg-yellow-600 shadow-[0_0_8px_rgba(202,138,4,0.6)]"></div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Bấm ra ngoài để đóng menu 3 chấm */}
      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)}></div>}
    </section>
  );
}