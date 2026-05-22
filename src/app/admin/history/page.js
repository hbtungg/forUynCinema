'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AdminHistoryPage() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchAllHistory() {
      try {
        const res = await fetch('/api/admin/history');
        const result = await res.json();

        if (result.success) {
          setHistoryList(result.data);
        }
      } catch (err) {
        console.error('Lỗi fetch lịch sử:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllHistory();
  }, []);

  // ĐÃ FIX: Xóa bỏ hoàn toàn định dạng ký tự ": any" của TypeScript để tránh lỗi biên dịch
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const movieName = item.movie?.name?.toLowerCase() || '';
      const email = item.userEmail?.toLowerCase() || '';

      const matchSearch =
        movieName.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'guest'
          ? !item.userEmail
          : !!item.userEmail;

      return matchSearch && matchFilter;
    });
  }, [historyList, search, filter]);

  // ĐÃ FIX: Tối ưu tính toán thời gian tương đối dựa trên trường updatedAt thực tế
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Vừa xong';
    
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    
    // Sử dụng Math.max để chặn trường hợp độ lệch giây bị âm do độ trễ truyền tải mạng
    const diff = Math.max(0, Math.floor((now - past) / 1000));

    if (diff < 60) return `${diff}s trước`;

    if (diff < 3600) {
      return `${Math.floor(diff / 60)} phút trước`;
    }

    if (diff < 86400) {
      return `${Math.floor(diff / 3600)} giờ trước`;
    }

    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.12),transparent_35%)] pointer-events-none" />

      <Header />

      <div className="px-4 md:px-10 pt-24 pb-16 flex-1 max-w-[1600px] w-full mx-auto relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6"
        >
          <div className="w-1.5 h-8 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] rounded-full" />

          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">
              Hệ thống giám sát rạp phim
            </h1>

            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.25em] mt-1">
              Real-time cinema analytics dashboard
            </p>
          </div>
        </motion.div>

        {/* STATS - Đã dọn sạch lỗi type rà soát phần tử */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: 'Tổng lượt xem',
              value: historyList.length,
            },
            {
              label: 'Người dùng',
              value: historyList.filter((i) => i.userEmail).length,
            },
            {
              label: 'Khách vãng lai',
              value: historyList.filter((i) => !i.userEmail).length,
            },
            {
              label: 'Dữ liệu realtime',
              value: 'ACTIVE',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-xl p-5"
            >
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                {item.label}
              </p>

              <h2 className="text-2xl md:text-3xl font-black mt-3 text-white">
                {item.value}
              </h2>
            </div>
          ))}
        </motion.div>

        {/* FILTER BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Tìm phim hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-950/70 border border-zinc-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-red-500 text-white transition-all w-full"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-zinc-950/70 border border-zinc-800 rounded-2xl px-5 py-3 text-sm outline-none focus:border-red-500 text-zinc-400 transition-all cursor-pointer"
          >
            <option value="all">Tất cả</option>
            <option value="user">Người dùng</option>
            <option value="guest">Guest</option>
          </select>
        </motion.div>

        {/* DATA TABLE */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-zinc-950/40 border border-zinc-900 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🎬</div>

            <h2 className="text-white font-black text-2xl mb-2">
              Không tìm thấy dữ liệu
            </h2>

            <p className="text-zinc-600 text-sm">
              Hệ thống chưa ghi nhận hoạt động phù hợp.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-3xl border border-zinc-900 bg-zinc-950/30 backdrop-blur-2xl"
          >
            <table className="w-full min-w-[850px] border-collapse">
              <thead className="sticky top-0 z-20 bg-black/90 backdrop-blur-xl">
                <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="py-5 px-6 text-left">Người dùng</th>
                  <th className="py-5 px-6 text-left">Tên phim</th>
                  <th className="py-5 px-6 text-center">Tập</th>
                  <th className="py-5 px-6 text-right">Hoạt động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/50">
                {filteredHistory.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="group hover:bg-red-500/5 transition-all duration-300"
                  >
                    {/* USER CARD CELL */}
                    <td className="py-5 px-6 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 font-black text-sm">
                          {item.userEmail
                            ? item.userEmail.charAt(0).toUpperCase()
                            : 'G'}
                        </div>

                        <div>
                          <p className="font-mono text-sm text-zinc-300">
                            {item.userEmail || 'Ẩn danh (Guest)'}
                          </p>

                          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
                            {item.userEmail ? 'Registered User' : 'Guest User'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* MOVIE INFO CELL */}
                    <td className="py-5 px-6">
                      <div>
                        <h3 className="font-black text-white text-sm group-hover:text-red-500 transition-colors duration-300">
                          {item.movie?.name || 'N/A'}
                        </h3>

                        <p className="text-zinc-600 text-xs mt-1">
                          Cinema streaming activity
                        </p>
                      </div>
                    </td>

                    {/* EPISODE BADGE CELL */}
                    <td className="py-5 px-6 text-center">
                      <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        {item.movie?.episode === 'Full'
                          ? 'FULL MOVIE'
                          : `TẬP ${item.movie?.episode}`}
                      </span>
                    </td>

                    {/* DYNAMIC TIME CELL - Đã đồng bộ sang trường updatedAt */}
                    <td className="py-5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-zinc-300 font-semibold">
                          {item.updatedAt
                            ? getRelativeTime(item.updatedAt)
                            : 'Vừa xong'}
                        </span>

                        <span className="text-[11px] text-zinc-600 font-mono mt-1">
                          {item.updatedAt
                            ? new Date(item.updatedAt).toLocaleString('vi-VN')
                            : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}