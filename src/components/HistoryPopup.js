'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HistoryPopup() {
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ sổ tay trình duyệt
    const history = JSON.parse(localStorage.getItem('ck_thu_uyn_history') || '{}');
    const slugs = Object.keys(history);
    if (slugs.length > 0) {
      const lastSlug = slugs[slugs.length - 1]; 
      setLastSeen({ slug: lastSlug, ...history[lastSlug] });
    }
  }, []);

  if (!lastSeen) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-zinc-900 border border-red-600 p-5 rounded-2xl shadow-2xl z-50 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-sm font-bold text-red-500 mb-1">Vợ iu ơi! Xem tiếp chứ?</p>
      <p className="text-[11px] text-zinc-400 mb-4 line-clamp-2">Lần trước em đang xem <b>{lastSeen.name}</b> ({lastSeen.lastEp})</p>
      <div className="flex gap-3">
        <Link href={lastSeen.url} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition">Xem tiếp</Link>
        <button onClick={() => setLastSeen(null)} className="text-zinc-500 text-xs hover:text-zinc-300">Bỏ qua</button>
      </div>
    </div>
  );
}