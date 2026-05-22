'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminHistoryPage() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllHistory() {
      try {
        const res = await fetch('/api/admin/history');
        const result = await res.json();
        if (result.success) {
          setHistoryList(result.data);
        }
      } catch (err) {
        console.error("Lỗi fetch lịch sử:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllHistory();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between overflow-x-hidden">
      <Header />

      <div className="px-4 md:px-10 pt-24 pb-16 flex-1 max-w-[1600px] w-full mx-auto">
        {/* TIÊU ĐỀ */}
        <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
          <div className="w-1.5 h-8 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
              Hệ thống giám sát rạp phim
            </h1>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">
              Lịch sử luồng xem theo thời gian thực
            </p>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-zinc-950/50 border border-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 italic text-sm">
            Chưa có dữ liệu xem phim nào được ghi nhận...
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-900 bg-zinc-950/30 rounded-2xl backdrop-blur-md">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="py-4 px-6">Người dùng</th>
                  <th className="py-4 px-6">Tên phim</th>
                  <th className="py-4 px-6 text-center">Tập đang xem</th>
                  <th className="py-4 px-6 text-right">Ngày giờ xem</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 text-xs font-medium divide-y divide-zinc-900/40">
                {historyList.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-zinc-900/20 transition-colors duration-200">
                    {/* EMAIL USER */}
                    <td className="py-4 px-6 font-mono text-zinc-400">
                      {item.userEmail || "Ẩn danh (Guest)"}
                    </td>

                    {/* TÊN PHIM */}
                    <td className="py-4 px-6 font-bold text-white group">
                      <span className="hover:text-red-500 transition-colors duration-200 cursor-pointer">
                        {item.movie?.name || "N/A"}
                      </span>
                    </td>

                    {/* TẬP PHIM */}
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400">
                        {item.movie?.episode === 'Full' ? 'FULL' : `TẬP ${item.movie?.episode}`}
                      </span>
                    </td>

                    {/* NGÀY GIỜ */}
                    <td className="py-4 px-6 text-right text-zinc-500 font-mono tracking-wide">
                      {/* Hiển thị chi tiết Ngày và Giờ */}
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : item.movie?.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}