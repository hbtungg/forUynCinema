'use client';

import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all | online
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State phục vụ việc Thêm tài khoản mới bằng Form kén ẩn
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '' });

  // ── LUỒNG TẢI DỮ LIỆU THỰC TẾ TỪ API ──
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        
        // Cập nhật lại thông tin mới nhất vào panel bên phải nếu đang chọn
        if (selectedUser) {
          const updated = data.find(u => u.id === selectedUser.id);
          if (updated) setSelectedUser(updated);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách user từ hệ thống:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🛠️ XỬ LÝ: Thêm thành viên mới thông qua API backend
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
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  // 🛠️ XỬ LÝ: Xóa vĩnh viễn tài khoản khỏi hệ thống rạp thông qua API
  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'hb.tungg@gmail.com') return; // Bảo vệ tuyệt đối tài khoản của anh
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

  // Luồng tìm kiếm và lọc dữ liệu thật từ State hệ thống
  const filteredUsers = users.filter(user => {
    const nameLower = user.name?.toLowerCase() || '';
    const emailLower = user.email?.toLowerCase() || '';
    const matchesSearch = nameLower.includes(searchQuery.toLowerCase()) || 
                          emailLower.includes(searchQuery.toLowerCase());
    
    if (filter === 'online') return matchesSearch && user.isOnline;
    return matchesSearch;
  });

  // Hàm helper nhận diện Avatar Đôi độc quyền của anh và chị nhà
  const getAvatarSrc = (email) => {
    if (email === 'hb.tungg@gmail.com') return '/avatar-tung.png'; // Ảnh chân dung của anh
    if (email === 'thuuyen009900@gmail.com') return '/avatar-uyen.png'; // Ảnh chân dung của chị nhà
    return null;
  };

  return (
    <div className="space-y-6 font-sans text-zinc-200 select-none">
      
      {/* ── TIÊU ĐỀ PHÂN KHU & NÚT THÊM THÀNH VIÊN KÉN PHẲNG ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="text-base font-black text-white uppercase tracking-[0.12em]">Hệ thống thành viên</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5 tracking-wide">Giám sát tiến trình xem phim, trạng thái luồng trực tuyến và danh sách tài khoản.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 border border-red-500/10"
        >
          {showAddForm ? 'Hủy bỏ' : '+ Thêm tài khoản'}
        </button>
      </header>

      {/* ── FORM THÊM TÀI KHOẢN MỚI ── */}
      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl max-w-xl flex flex-col sm:flex-row gap-3 items-end animate-fade-in">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tên thành viên</label>
            <input
              type="text"
              required
              placeholder="Nhập tên..."
              value={newUserData.name}
              onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600/40 select-text tracking-wide"
            />
          </div>
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email đăng nhập</label>
            <input
              type="email"
              required
              placeholder="xxx@gmail.com"
              value={newUserData.email}
              onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/[0.06] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600/40 select-text tracking-wide"
            />
          </div>
          <button type="submit" className="bg-zinc-100 hover:bg-white text-black font-black text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xl transition-colors h-[36px] w-full sm:w-auto flex-shrink-0">
            Xác nhận
          </button>
        </form>
      )}

      {/* ── THANH CÔNG CỤ TÌM KIẾM VÀ BỘ LỌC TỐI GIẢN ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-white/[0.15] placeholder:text-zinc-600 select-text tracking-wide"
        />
        <div className="flex gap-1 bg-white/[0.01] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto">
          <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white/[0.06] text-white border border-white/[0.05]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Tất cả ({users.length})
          </button>
          <button onClick={() => setFilter('online')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'online' ? 'bg-white/[0.06] text-white border border-white/[0.05]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Đang Online ({users.filter(u => u.isOnline).length})
          </button>
        </div>
      </div>

      {/* ── BỐ CỤC HAI PHÂN KHU SANG TRỌNG ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KHỐI BÊN TRÁI: DANH SÁCH THÀNH VIÊN THEO DẠNG KÉN PHẲNG */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-5 h-5 border-2 border-white/[0.05] border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const avatarSrc = getAvatarSrc(user.email);
              return (
                <div 
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group
                    ${selectedUser?.id === user.id 
                      ? 'bg-white/[0.03] border-white/[0.08]' 
                      : 'bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.02] hover:border-white/[0.05]'
                    }
                  `}
                >
                  {/* Khối danh tính bên trái */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-white/[0.05] bg-zinc-900 overflow-hidden flex items-center justify-center font-bold text-zinc-400 text-xs flex-shrink-0">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-100 font-bold text-[13px] tracking-tight truncate">{user.name}</span>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
                        {user.role === 'admin' && (
                          <span className="text-[8px] font-black bg-red-600/10 border border-red-600/20 text-red-500 px-1 rounded uppercase tracking-wider">
                            Sáng lập
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-600 text-[11px] truncate select-text mt-0.5">{user.email}</span>
                    </div>
                  </div>

                  {/* Khối trạng thái phim ở giữa */}
                  <div className="sm:text-left mt-3 sm:mt-0 flex-1 sm:px-10 min-w-0">
                    {user.isOnline && user.watching ? (
                      <div className="flex flex-col">
                        <span className="text-red-500 font-bold text-xs truncate tracking-tight">{user.watching.movieName}</span>
                        <span className="text-zinc-600 text-[10px] mt-0.5">Vừa khởi chạy: {user.watching.timeAt?.split(' ')[1] || ''}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-700 italic text-[11px] tracking-wide">Đang ngoại tuyến</span>
                    )}
                  </div>

                  {/* Khối nút xóa ở bên phải */}
                  <div className="text-right mt-3 sm:mt-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={user.role === 'admin'}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border
                        ${user.role === 'admin' 
                          ? 'border-transparent text-zinc-800 cursor-not-allowed' 
                          : 'border-transparent text-zinc-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10'
                        }
                      `}
                    >
                      Xóa rạp
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 border border-dashed border-white/[0.03] rounded-xl text-zinc-600 tracking-widest font-bold uppercase text-[9px]">
              Không tìm thấy thành viên nào phù hợp
            </div>
          )}
        </div>

        {/* KHỐI BÊN PHẢI: BẢNG GIÁM SÁT HÀNH VI CHI TIẾT */}
        <div className="bg-[#0c0c0f] border border-white/[0.04] rounded-xl p-5 shadow-2xl space-y-5 min-h-[320px]">
          {selectedUser ? (
            <div className="space-y-5 animate-fade-in">
              {/* Định danh chính */}
              <div className="border-b border-white/[0.04] pb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-white/[0.05] bg-zinc-900 overflow-hidden flex items-center justify-center font-bold text-zinc-400 text-sm flex-shrink-0">
                  {getAvatarSrc(selectedUser.email) ? (
                    <img src={getAvatarSrc(selectedUser.email)} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs font-black text-white tracking-wide uppercase truncate">{selectedUser.name}</h3>
                  <p className="text-[11px] text-zinc-500 select-text truncate mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              {/* Luồng hoạt động thời gian thực */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-0.5">Tiến trình thực tế</h4>
                {selectedUser.isOnline && selectedUser.watching ? (
                  <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-xs font-bold text-zinc-200 tracking-tight">{selectedUser.watching.movieName}</span>
                    <span className="text-[10px] text-zinc-500 mt-1">Ghi nhận lúc: {selectedUser.watching.timeAt}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600 italic pl-0.5">Tài khoản hiện đang nghỉ ngơi, không xem phim.</p>
                )}
              </div>

              {/* Lịch sử lưu vết thiết kế phẳng cuộn */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-0.5">Lịch sử xem gần đây</h4>
                {selectedUser.history && selectedUser.history.length > 0 ? (
                  <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedUser.history.map((hist, i) => (
                      <div key={i} className="flex justify-between items-start gap-4 text-[11px] p-2 rounded-lg bg-white/[0.005] border border-white/[0.02]">
                        <span className="text-zinc-400 font-semibold tracking-tight truncate">{hist.movieName}</span>
                        <span className="text-zinc-600 text-[10px] font-medium whitespace-nowrap flex-shrink-0 mt-0.5">{hist.timeAt}</span>
                      </div>
                    ))}
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
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Giám sát thành viên</p>
                <p className="text-[11px] text-zinc-600 max-w-[190px] font-medium leading-normal">Bấm chọn một tài khoản bất kỳ bên bảng để xem chi tiết luồng hoạt động.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}