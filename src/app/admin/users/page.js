'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all | online
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Kho lưu trữ nhật ký hệ thống tổng tham khảo từ history/page.js
  const [globalHistory, setGlobalHistory] = useState([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '' });

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Search inside selected user's watch history
  const [userHistorySearch, setUserHistorySearch] = useState('');

  useEffect(() => {
    document.title = "Hệ thống thành viên - UynCinema";
  }, []);

  // ── LUỒNG TẢI DỮ LIỆU THÀNH VIÊN THỰC TẾ ──
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        
        if (selectedUser) {
          const updated = data.find(u => u.id === selectedUser.id);
          if (updated) setSelectedUser(updated);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách user từ hệ thống:", error);
    }
  };

  // Luồng tải nhật ký xem phim tổng từ API đối tác hệ thống
  const fetchGlobalHistory = async () => {
    try {
      const res = await fetch('/api/admin/history');
      const result = await res.json();
      if (result.success) {
        setGlobalHistory(result.data);
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ log lịch sử về trang user:", error);
    }
  };

  // Khởi chạy đồng bộ toàn bộ tài nguyên khi trang lên đèn
  useEffect(() => {
    async function initDashboard() {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchGlobalHistory()]);
      setLoading(false);
    }
    initDashboard();

    // Live update every 15s to keep online status fresh
    const interval = setInterval(() => {
      fetchUsers();
      fetchGlobalHistory();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Hàm tính khoảng thời gian tương đối đồng bộ chuẩn chỉ từ history
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

  // Tự động bóc tách và lọc riêng toàn bộ lịch sử xem của User đang được chọn
  const selectedUserHistory = useMemo(() => {
    if (!selectedUser?.email) return [];
    const rawHist = globalHistory.filter(
      (item) => item.userEmail?.toLowerCase() === selectedUser.email.toLowerCase()
    );
    
    if (!userHistorySearch.trim()) return rawHist;
    return rawHist.filter(h => 
      h.movie?.name?.toLowerCase().includes(userHistorySearch.toLowerCase())
    );
  }, [globalHistory, selectedUser, userHistorySearch]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });

      if (res.ok) {
        setNewUserData({ name: '', email: '' });
        setShowAddForm(false);
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || "Không thể thêm người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  // Toggle user role dynamically
  const handleToggleRole = async (user) => {
    if (user.email === 'hb.tungg@gmail.com') {
      alert("Không thể thay đổi vai trò tài khoản Admin sáng lập chính!");
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Anh muốn thay đổi vai trò của ${user.name} thành ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'hb.tungg@gmail.com') return; 
    if (!confirm(`Anh có chắc muốn xóa tài khoản này khỏi rạp không? Người này sẽ không thể đăng nhập nữa.`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (selectedUser?.id === userId) setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  // Lọc và Tìm kiếm danh sách thành viên
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameLower = user.name?.toLowerCase() || '';
      const emailLower = user.email?.toLowerCase() || '';
      const matchesSearch = nameLower.includes(searchQuery.toLowerCase()) || 
                            emailLower.includes(searchQuery.toLowerCase());
      
      if (filter === 'online') return matchesSearch && user.isOnline;
      return matchesSearch;
    });
  }, [users, searchQuery, filter]);

  // Phân trang kết quả sau khi lọc
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, page]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filter]);

  return (
    <div className="space-y-6 font-sans text-zinc-200 select-none pb-12 lg:pb-0">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-neutral-700  rounded-full" />
          <div>
            <h1 className="text-xl font-semibold text-white uppercase tracking-wider">Hệ thống thành viên</h1>
            <p className="text-[10px] text-zinc-500 mt-0.5 tracking-[0.1em] uppercase font-semibold">Giám sát tiến trình xem phim, trạng thái luồng trực tuyến và tài khoản rạp.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-neutral-700 hover:bg-neutral-700 text-white font-bold uppercase text-[10px] tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 border border-neutral-600/10 "
        >
          {showAddForm ? 'Hủy bỏ' : '+ Thêm tài khoản'}
        </button>
      </header>

      {/* FORM THÊM TÀI KHOẢN MỚI */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddUser} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl max-w-2xl flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest ml-1">Tên thành viên</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên..."
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600/40 select-text tracking-wide"
                />
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest ml-1">Email đăng nhập</label>
                <input
                  type="email"
                  required
                  placeholder="xxx@gmail.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600/40 select-text tracking-wide"
                />
              </div>
              <button type="submit" className="bg-zinc-100 hover:bg-white text-black font-semibold text-[10px] tracking-widest uppercase px-5 py-3 rounded-xl transition-colors h-[42px] w-full sm:w-auto flex-shrink-0">
                Xác nhận
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-white/[0.15] placeholder:text-zinc-600 select-text tracking-wide"
          />
          <span className="absolute left-3 top-3 text-xs opacity-40">🔍</span>
        </div>
        <div className="flex gap-1 bg-white/[0.01] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto">
          <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white/[0.06] text-white border border-white/[0.05]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Tất cả ({users.length})
          </button>
          <button onClick={() => setFilter('online')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all ${filter === 'online' ? 'bg-white/[0.06] text-white border border-white/[0.05]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Đang Online ({users.filter(u => u.isOnline).length})
          </button>
        </div>
      </div>

      {/* BỐ CỤC HAI PHÂN KHU */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KHỐI BÊN TRÁI: DANH SÁCH BẢNG THÀNH VIÊN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/[0.04] bg-[#0c0c0e]/40 backdrop-blur-2xl">
            <table className="w-full min-w-[550px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.04] text-zinc-500 text-[9px] font-semibold uppercase tracking-[0.15em] bg-white/[0.005]">
                  <th className="py-4 px-5">Thành viên</th>
                  <th className="py-4 px-5">Vai trò</th>
                  <th className="py-4 px-5">Trạng thái luồng</th>
                  <th className="py-4 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-24" /></td>
                      <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-12" /></td>
                      <td className="py-4 px-5"><div className="h-4 bg-zinc-800 rounded w-36" /></td>
                      <td className="py-4 px-5 text-right"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center text-zinc-500 text-xs font-semibold">
                      Chưa tìm thấy thành viên phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <tr 
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`group hover:bg-neutral-700/5 transition-all duration-300 cursor-pointer ${
                          isSelected ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        {/* CỘT TÊN THÀNH VIÊN */}
                        <td className="py-4 px-5 flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                            user.isOnline 
                              ? 'border-green-500/30 bg-green-950/20 text-green-400' 
                              : 'border-white/[0.05] bg-zinc-900 text-zinc-400 group-hover:bg-neutral-700/10 group-hover:text-neutral-300'
                          }`}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-zinc-100 font-bold text-[13px] tracking-tight truncate">{user.name}</span>
                              {user.isOnline && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 " />
                              )}
                            </div>
                            <span className="text-zinc-600 text-[11px] truncate select-text mt-0.5">{user.email}</span>
                          </div>
                        </td>

                        {/* CỘT VAI TRÒ */}
                        <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleRole(user)}
                            className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border transition-all ${
                              user.role === 'admin'
                                ? 'bg-neutral-700/10 border-neutral-600/20 text-neutral-300'
                                : 'bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-white hover:border-white/[0.1]'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Thành viên'}
                          </button>
                        </td>

                        {/* CỘT TRẠNG THÁI LUỒNG XEM PHIM */}
                        <td className="py-4 px-5">
                          {user.isOnline && user.watching ? (
                            <div className="flex flex-col max-w-[200px]">
                              <span className="text-neutral-300 font-bold text-xs truncate tracking-tight flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-ping" />
                                {user.watching.movieName}
                              </span>
                              <span className="text-zinc-600 text-[10px] mt-0.5">Khởi chạy: {user.watching.timeAt?.split(' ')[1] || ''}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-zinc-700 italic text-[11px] tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                              <span>Ngoại tuyến</span>
                            </div>
                          )}
                        </td>

                        {/* CỘT THAO TÁC XÓA RẠP */}
                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={user.role === 'admin'}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all border
                              ${user.role === 'admin' 
                                ? 'border-transparent text-zinc-800 cursor-not-allowed' 
                                : 'border-transparent text-zinc-500 hover:text-neutral-300 hover:bg-neutral-700/5 hover:border-neutral-600/10'
                              }
                            `}
                          >
                            Xóa rạp
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                page === 1
                  ? 'border-transparent text-zinc-800 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Trang trước
            </button>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                page === totalPages
                  ? 'border-transparent text-zinc-800 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>

        {/* KHỐI BÊN PHẢI: BẢNG GIÁM SÁT CHI TIẾT TỪNG THÀNH VIÊN */}
        <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-2xl p-5 shadow-2xl space-y-5 min-h-[350px]">
          {selectedUser ? (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-white/[0.04] pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    selectedUser.isOnline 
                      ? 'border-green-500/30 bg-green-950/20 text-green-400' 
                      : 'border-white/[0.05] bg-zinc-900 text-zinc-400'
                  }`}>
                    {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-xs font-semibold text-white tracking-wide uppercase truncate">{selectedUser.name}</h3>
                    <p className="text-[11px] text-zinc-500 select-text truncate mt-0.5">{selectedUser.email}</p>
                  </div>
                </div>
                {selectedUser.isOnline && (
                  <span className="text-[8px] font-semibold uppercase tracking-wider bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Tiến trình xem phim thời gian thực */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-semibold text-zinc-600 uppercase tracking-widest pl-0.5">Tiến trình thực tế</h4>
                {selectedUser.isOnline && selectedUser.watching ? (
                  <div className="bg-neutral-700/5 border border-neutral-600/10 p-3.5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                    <span className="text-xs font-semibold text-zinc-200 tracking-tight">{selectedUser.watching.movieName}</span>
                    <span className="text-[10px] text-neutral-300 font-bold mt-1 inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neutral-700 animate-ping" />
                      Khởi phát lúc: {selectedUser.watching.timeAt}
                    </span>
                    <div className="absolute right-3 bottom-2 text-xl opacity-10 group-hover:opacity-25 transition-opacity">🎬</div>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600 italic pl-0.5">Tài khoản hiện đang nghỉ ngơi, không xem phim.</p>
                )}
              </div>

              {/* Lịch sử xem gần đây kết nối từ API history */}
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-[9px] font-semibold text-zinc-600 uppercase tracking-widest pl-0.5">Nhật ký chiếu rạp</h4>
                  <span className="text-[9px] font-bold text-zinc-500 font-mono">({selectedUserHistory.length} mục)</span>
                </div>

                {/* Ô tìm kiếm trong lịch sử người dùng */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm trong lịch sử của người này..."
                    value={userHistorySearch}
                    onChange={(e) => setUserHistorySearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.04] rounded-lg px-3 py-1.5 pl-8 text-[10px] text-white focus:outline-none focus:border-white/[0.1] placeholder:text-zinc-700 select-text tracking-wide"
                  />
                  <span className="absolute left-2.5 top-2.5 text-[9px] opacity-30">🔍</span>
                  {userHistorySearch && (
                    <button onClick={() => setUserHistorySearch('')} className="absolute right-2 top-2 text-[9px] text-zinc-500 hover:text-white">✕</button>
                  )}
                </div>

                {selectedUserHistory && selectedUserHistory.length > 0 ? (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedUserHistory.map((hist, i) => {
                      const epLabel = hist.movie?.episode === 'Full' ? 'FULL' : `Tập ${hist.movie?.episode || '??'}`;
                      return (
                        <div key={i} className="flex justify-between items-start gap-4 text-[11px] p-2.5 rounded-lg bg-white/[0.005] border border-white/[0.02] hover:bg-white/[0.01] hover:border-white/[0.04] transition-all">
                          <div className="flex flex-col min-w-0 gap-0.5">
                            <span className="text-zinc-300 font-bold tracking-tight truncate">{hist.movie?.name || 'N/A'}</span>
                            <span className="text-neutral-300/80 text-[9px] font-semibold uppercase tracking-wider">{epLabel}</span>
                          </div>
                          <span className="text-zinc-600 text-[10px] font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
                            {getRelativeTime(hist.updatedAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-700 italic pl-0.5">Chưa có dữ liệu lịch sử chiếu.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-3 opacity-30">
              <span className="text-xl">👁️</span>
              <div className="space-y-1">
                <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest">Giám sát thành viên</p>
                <p className="text-[11px] text-zinc-600 max-w-[190px] font-medium leading-normal">Bấm chọn một tài khoản bất kỳ bên bảng để xem chi tiết luồng hoạt động.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
