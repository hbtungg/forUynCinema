'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, historyRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/history')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.success) {
          setHistoryList(historyData.data);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tổng quan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Tự động làm mới dữ liệu sau mỗi 10 giây để giữ tính chất Real-time (live)
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Tính toán các chỉ số quan trọng
  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.isOnline).length;
  const activeWatching = users.filter(u => u.isOnline && u.watching).length;
  const totalViews = historyList.length;

  // Thống kê phim được xem nhiều nhất (Top 5)
  const topMovies = useMemo(() => {
    const counts = {};
    historyList.forEach(item => {
      const title = item.movie?.name;
      if (title) {
        counts[title] = (counts[title] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [historyList]);

  // Danh sách dòng hoạt động xem phim mới nhất (Mới nhất lên đầu)
  const recentActivities = useMemo(() => {
    return historyList.slice(0, 6);
  }, [historyList]);

  // Hàm tính mốc thời gian tương đối
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Vừa xong';
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diff = Math.max(0, Math.floor((now - past) / 1000));

    if (diff < 60) return `${diff}s trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="w-full space-y-8 pb-12 lg:pb-0 font-sans text-zinc-200">
      
      {/* HEADER TỔNG QUAN */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] rounded-full" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              Bảng điều khiển hệ thống
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
              UynCinema Administration Center
            </p>
          </div>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchDashboardData(); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] text-zinc-400 hover:text-white transition-all duration-300"
        >
          🔄 Làm mới dữ liệu
        </button>
      </motion.div>

      {loading && historyList.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/[0.01] border border-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* STATS TIỆN ÍCH */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { label: 'Thành viên rạp', value: totalUsers, icon: '👥', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Đang hoạt động', value: onlineUsers, icon: '🟢', color: 'text-green-500', bg: 'bg-green-500/10', sub: `${activeWatching} đang chiếu phim` },
              { label: 'Tổng lượt chiếu', value: totalViews, icon: '🎬', color: 'text-red-500', bg: 'bg-red-500/10' },
              { label: 'Máy chủ phòng chiếu', value: 'ONLINE', icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-500/10', sub: 'Ping: 14ms' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/60 p-4 sm:p-5 relative overflow-hidden group hover:border-white/[0.08] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              >
                <div className="flex justify-between items-start">
                  <p className="text-zinc-500 text-[9px] uppercase tracking-[0.18em] font-black">{stat.label}</p>
                  <span className={`text-base p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white tracking-tight">{stat.value}</h2>
                {stat.sub ? (
                  <p className="text-zinc-500 text-[10px] font-semibold mt-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-500 animate-ping" />
                    {stat.sub}
                  </p>
                ) : (
                  <p className="text-zinc-600 text-[10px] font-bold mt-1.5 uppercase tracking-wide">Hệ thống an toàn</p>
                )}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </motion.div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* THÀNH VIÊN ĐANG ONLINE & CHIẾU PHIM */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/30 p-5 space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                    Đang xem trực tuyến ({onlineUsers})
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Những người đang túc trực tại rạp chiếu phim.</p>
                </div>
                <Link href="/admin/users" className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors">
                  Quản lý →
                </Link>
              </div>

              {users.filter(u => u.isOnline).length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/[0.02] rounded-xl flex flex-col items-center justify-center opacity-40">
                  <span className="text-2xl mb-2">😴</span>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Không có ai online</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Mọi người hiện tại đều đã rời rạp.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {users.filter(u => u.isOnline).map((user) => (
                    <div 
                      key={user.id}
                      className="p-3.5 rounded-xl border border-white/[0.04] bg-[#09090b]/80 flex flex-col justify-between hover:border-red-600/20 hover:bg-red-500/[0.01] transition-all duration-300 relative group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-red-600/10 group-hover:text-red-400 transition-colors">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-zinc-200 group-hover:text-red-400 transition-colors truncate">{user.name}</p>
                          <p className="text-[9px] text-zinc-600 truncate">{user.email}</p>
                        </div>
                      </div>

                      {user.watching ? (
                        <div className="mt-3 bg-red-600/5 border border-red-500/10 rounded-lg p-2 flex items-start gap-1.5 animate-pulse">
                          <span className="text-xs mt-0.5">🎬</span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-wide truncate">Đang phát:</p>
                            <p className="text-[10px] text-zinc-300 font-bold tracking-tight truncate leading-normal">{user.watching.movieName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 bg-white/[0.01] border border-white/[0.03] rounded-lg p-2 text-center">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Đang xem sảnh chính</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* PHÍM TẮT NHANH & TOP MOVIES */}
            <div className="space-y-6">
              
              {/* PHÍM TẮT TÁC VỤ */}
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/30 p-5 space-y-4"
              >
                <h3 className="text-xs font-black text-white uppercase tracking-wider pb-3 border-b border-white/[0.04]">
                  Tác vụ nhanh
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/admin/users?add=true" className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] rounded-xl flex flex-col items-center justify-center text-center transition-all group active:scale-95">
                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">➕</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Thêm TV</span>
                  </Link>
                  <Link href="/admin/history" className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] rounded-xl flex flex-col items-center justify-center text-center transition-all group active:scale-95">
                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">👁️</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Giám sát</span>
                  </Link>
                  <Link href="/admin/movies" className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] rounded-xl flex flex-col items-center justify-center text-center transition-all group active:scale-95">
                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🎥</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Kho Phim</span>
                  </Link>
                  <Link href="/home" className="p-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/10 hover:border-red-600/20 rounded-xl flex flex-col items-center justify-center text-center transition-all group active:scale-95">
                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🚪</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500 group-hover:text-red-400">Vào Rạp</span>
                  </Link>
                </div>
              </motion.div>

              {/* TOP PHIM ĐƯỢC XEM NHIỀU */}
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/30 p-5 space-y-4"
              >
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    🏆 Phim thịnh hành
                  </h3>
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">LOGS</span>
                </div>

                {topMovies.length === 0 ? (
                  <p className="text-[11px] text-zinc-600 italic text-center py-6">Chưa ghi nhận thống kê lượt xem.</p>
                ) : (
                  <div className="space-y-2.5">
                    {topMovies.map((mv, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/[0.005] border border-white/[0.02] hover:bg-white/[0.01] transition-all">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                            idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                            idx === 1 ? 'bg-zinc-300/20 text-zinc-300' :
                            idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                            'bg-zinc-800 text-zinc-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-zinc-300 font-bold text-[11px] truncate tracking-tight">{mv.name}</span>
                        </div>
                        <span className="text-zinc-600 text-[10px] font-bold whitespace-nowrap bg-zinc-900 px-2 py-0.5 rounded-md border border-white/[0.03]">
                          {mv.count} lượt
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

            </div>
          </div>

          {/* DÒNG HOẠT ĐỘNG HOẠT ĐỘNG RECENT LOGS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/30 p-5 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.04]">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  🔔 Hoạt động chiếu phim gần đây
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Thời gian thực các tác phẩm được các thành viên khởi chạy.</p>
              </div>
              <Link href="/admin/history" className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors">
                Xem tất cả →
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <div className="py-12 text-center opacity-40">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Không có hoạt động nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-white/[0.03] bg-[#0c0c0e]/60 flex items-start gap-3 hover:border-white/[0.06] hover:bg-white/[0.005] transition-all">
                    <span className="text-lg mt-0.5">👁️</span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-[11px] font-bold text-zinc-300 truncate lowercase font-mono">{act.userEmail || 'Khách vãng lai'}</p>
                        <span className="text-[9px] text-zinc-600 font-bold whitespace-nowrap bg-zinc-900 px-1.5 py-0.5 rounded border border-white/[0.02]">
                          {getRelativeTime(act.updatedAt)}
                        </span>
                      </div>
                      <p className="text-[11px] font-black text-red-500 tracking-tight truncate">{act.movie?.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-zinc-600">
                        <span>Phòng chiếu số {idx + 1}</span>
                        <span className="uppercase text-[9px] font-black tracking-wider bg-white/[0.02] px-1 py-0.2 rounded border border-white/[0.04] text-zinc-500">
                          {act.movie?.episode === 'Full' ? 'FULL' : `Tập ${act.movie?.episode}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
