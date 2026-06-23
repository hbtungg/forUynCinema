'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHistoryPage() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Giữ vững tính năng cao cấp: Lọc cô lập lịch sử theo Email tài khoản được click chọn
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAllHistory = async () => {
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
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  // Luồng tính toán lọc nâng cao, tích hợp đồng bộ bộ lọc tài khoản đích danh
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

      const matchSpecificUser = selectedUserEmail 
        ? item.userEmail === selectedUserEmail 
        : true;

      return matchSearch && matchFilter && matchSpecificUser;
    });
  }, [historyList, search, filter, selectedUserEmail]);

  // Phân trang danh sách lịch sử sau khi lọc
  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, page]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));

  // Reset page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [search, filter, selectedUserEmail]);

  // Xóa một log cụ thể
  const handleDeleteEntry = async (id) => {
    if (!confirm("Anh muốn xóa bản ghi lịch sử xem này khỏi dòng thời gian rạp chứ?")) return;

    try {
      const res = await fetch(`/api/admin/history?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        setHistoryList(prev => prev.filter(item => item._id !== id));
      } else {
        alert(data.error || "Không thể xóa dòng nhật ký");
      }
    } catch (error) {
      console.error("Lỗi khi xóa nhật ký:", error);
    }
  };

  // Dọn sạch nhật ký
  const handleClearAllLogs = async () => {
    const doubleCheck = confirm("CẢNH BÁO: Anh có chắc chắn muốn DỌN SẠCH toàn bộ nhật ký xem phim của rạp chứ? Hành động này không thể hoàn tác!");
    if (!doubleCheck) return;

    const tripleCheck = prompt("Nhập từ khóa 'XAC NHAN' để tiến hành dọn dẹp hệ thống:");
    if (tripleCheck !== 'XAC NHAN') {
      alert("Hủy bỏ thao tác dọn dẹp.");
      return;
    }

    try {
      const res = await fetch('/api/admin/history?clearAll=true', {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        setHistoryList([]);
        alert("Đã dọn sạch nhật ký giám sát thành công!");
      } else {
        alert(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi dọn sạch nhật ký:", error);
    }
  };

  // Hàm tính toán mốc thời gian tương đối chuẩn chỉ
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Vừa xong';
    
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    
    const diff = Math.max(0, Math.floor((now - past) / 1000));

    if (diff < 60) return `${diff}s trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="w-full space-y-6 pb-12 lg:pb-0 font-sans text-zinc-200">

      {/* HEADER PHÂN KHU GIÁM SÁT */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] rounded-full" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              Giám sát rạp phim
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
              Real-time cinema analytics log
            </p>
          </div>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearAllLogs}
            className="px-3.5 py-2 bg-red-950/20 hover:bg-red-900/20 border border-red-900/10 hover:border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 flex items-center gap-1.5"
          >
            🗑️ Dọn sạch nhật ký
          </button>
        )}
      </motion.div>

      {/* THÊ THỐNG KÊ NHANH (STATS GRID) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Tổng lượt xem', value: historyList.length, color: 'text-zinc-100' },
          { label: 'Người dùng', value: historyList.filter((i) => i.userEmail).length, color: 'text-red-400' },
          { label: 'Khách vãng lai', value: historyList.filter((i) => !i.userEmail).length, color: 'text-zinc-400' },
          { label: 'Trạng thái log', value: 'LIVE', color: 'text-green-500' },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.03] bg-[#0c0c0e]/60 p-4.5 backdrop-blur-xl hover:border-white/[0.06] transition-colors"
          >
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.18em] font-black">
              {item.label}
            </p>
            <h2 className={`text-xl md:text-2xl font-black mt-2 tracking-tight ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </motion.div>

      {/* THANH CÔNG CỤ (FILTER BAR) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm phim hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.01] border border-white/[0.05] rounded-xl px-4 py-2.5 pl-10 text-xs outline-none focus:border-red-600/40 text-white transition-all w-full placeholder:text-zinc-600 select-text"
          />
          <span className="absolute left-3.5 top-3 text-xs opacity-40">🔍</span>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#0c0c0e]/80 border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-600/40 text-zinc-400 transition-all cursor-pointer min-w-[130px]"
        >
          <option value="all">Tất cả</option>
          <option value="user">Người dùng</option>
          <option value="guest">Khách vãng lai</option>
        </select>
      </motion.div>

      {/* HIỂN THỊ TRẠNG THÁI LỌC USER ĐỘNG */}
      <AnimatePresence>
        {selectedUserEmail && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2.5 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-xl w-fit"
          >
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              Đang lọc xem lịch sử của: <span className="text-red-400 font-mono lowercase ml-1">{selectedUserEmail}</span>
            </span>
            <button 
              onClick={() => setSelectedUserEmail(null)}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-black p-0.5 ml-1.5"
              title="Xóa bộ lọc người dùng"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BẢNG LOG DỮ LIỆU CHÍNH */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-white/[0.01] border border-white/[0.03] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : paginatedHistory.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/[0.03] rounded-2xl">
          <div className="text-4xl mb-4">🎬</div>
          <h2 className="text-white font-black text-lg mb-1">Không tìm thấy dữ liệu</h2>
          <p className="text-zinc-600 text-xs font-medium">Hệ thống chưa ghi nhận hoạt động nào phù hợp.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto no-scrollbar rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/40 backdrop-blur-2xl"
          >
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] text-zinc-500 text-[9px] font-black uppercase tracking-[0.15em] bg-white/[0.005]">
                  <th className="py-4 px-5 text-left">Thành viên (Click để lọc riêng)</th>
                  <th className="py-4 px-5 text-left">Tên tác phẩm</th>
                  <th className="py-4 px-5 text-center">Tập phim</th>
                  <th className="py-4 px-5 text-right">Mốc thời gian</th>
                  <th className="py-4 px-5 text-center w-16">Tác vụ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.02]">
                {paginatedHistory.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="group hover:bg-red-500/5 transition-all duration-300"
                  >
                    {/* CỘT THÀNH VIÊN - Hỗ trợ bấm chọn lọc nhanh */}
                    <td 
                      onClick={() => item.userEmail && setSelectedUserEmail(item.userEmail)}
                      className={`py-4 px-5 border-l-2 border-transparent group-hover:border-red-500 transition-all duration-300 ${item.userEmail ? 'cursor-pointer group/cell' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs transition-colors ${
                          item.userEmail 
                            ? 'bg-red-600/10 text-red-400 border-red-500/20' 
                            : 'bg-white/[0.02] border-white/[0.05] text-zinc-500'
                        }`}>
                          {item.userEmail ? item.userEmail.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <div>
                          <p className={`font-mono text-xs transition-colors ${item.userEmail ? 'text-zinc-300 group-hover/cell:text-red-400' : 'text-zinc-500'}`}>
                            {item.userEmail || 'Ẩn danh (Guest)'}
                          </p>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold mt-0.5 block">
                            {item.userEmail ? 'Thành viên rạp • Click lọc' : 'Khách vãng lai'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CỘT PHIM */}
                    <td className="py-4 px-5">
                      <div>
                        <h3 className="font-bold text-zinc-200 text-xs group-hover:text-red-500 transition-colors duration-300">
                          {item.movie?.name || 'N/A'}
                        </h3>
                        <p className="text-zinc-600 text-[10px] mt-0.5 font-medium">
                          Cinema stream track
                        </p>
                      </div>
                    </td>

                    {/* CỘT TẬP */}
                    <td className="py-4 px-5 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.01] border border-white/[0.03] text-[9px] font-black uppercase tracking-wider text-zinc-400">
                        {item.movie?.episode === 'Full' ? 'FULL' : `TẬP ${item.movie?.episode}`}
                      </span>
                    </td>

                    {/* CỘT THỜI GIAN */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-zinc-300 font-semibold">
                          {item.updatedAt ? getRelativeTime(item.updatedAt) : 'Vừa xong'}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono mt-0.5">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : ''}
                        </span>
                      </div>
                    </td>

                    {/* CỘT TÁC VỤ */}
                    <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteEntry(item._id)}
                        className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Xóa dòng log"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* DÒNG PHÂN TRANG CHUẨN MỰC */}
          <div className="flex items-center justify-between border-t border-zinc-900 pt-5 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                page === 1
                  ? 'border-transparent text-zinc-800 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-300 hover:bg-white/[0.04] active:scale-95'
              }`}
            >
              ← Trước
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Trang <span className="text-white font-mono text-sm mx-1">{page}</span> / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                page === totalPages
                  ? 'border-transparent text-zinc-800 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-300 hover:bg-white/[0.04] active:scale-95'
              }`}
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
