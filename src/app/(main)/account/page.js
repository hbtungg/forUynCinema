'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, ShieldCheck, KeyRound, LogOut, Loader2, User } from 'lucide-react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Điều hướng về trang đăng nhập nếu chưa có session
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Vòng chờ tinh tế kính mờ khi đang check quyền
  if (status === 'loading') {
    return (
      <div className="w-full min-h-[70vh] bg-transparent flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
        <span className="text-[9px] uppercase tracking-widest text-[#d0c5b5]/40 font-bold">Đang quét tọa độ tài khoản...</span>
      </div>
    );
  }

  if (!session) return null;

  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Sidebar/Footer thừa */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6">
        
        {/* TIÊU ĐỀ ĐỊNH DANH TRANG TÀI KHOẢN CAO CẤP */}
        <div className="mb-10 border-l-4 border-[#E6C687] pl-5">
          <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px] mb-1.5">
            Personal Observatory
          </p>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
            Trung tâm: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Quản lý tài khoản</span>
          </h1>
        </div>

        <div className="space-y-6">
          
          {/* KHỐI 1: THÔNG TIN CÁ NHÂN PHA LÊ KÍNH MỜ XANH ĐÊM */}
          <section className="p-6 md:p-8 rounded-[24px] bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Avatar lấy chữ cái đầu bọc viền ánh vàng phát sáng */}
              <div className="w-16 h-16 rounded-2xl bg-[#E6C687]/10 border border-[#E6C687]/20 flex items-center justify-center shadow-[0_0_15px_rgba(230,198,135,0.1)] flex-shrink-0">
                <span className="text-xl font-mono font-bold text-[#E6C687]">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white tracking-wide uppercase">{session?.user?.name || 'Thành viên'}</h2>
                  <span className="text-[9px] font-bold font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#d0c5b5]/50 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-2.5 h-2.5 text-[#E6C687]/60" /> ID: {session?.user?.email === 'hb.tungg@gmail.com' ? 'Owner' : 'VIP'}
                  </span>
                </div>
                <p className="text-xs text-[#d0c5b5]/40 font-medium truncate">{session?.user?.email}</p>
                
                <div className="pt-2">
                  <button className="px-4 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#d0c5b5]/60 hover:text-white transition-all duration-300 cursor-pointer focus:outline-none">
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* KHỐI 2: ĐẶC QUYỀN VIP PREMIUM MOONLIGHT GOLD SUỐT MƯỢT MÀ */}
          <section className="p-6 md:p-8 rounded-[24px] bg-gradient-to-br from-[#E6C687]/10 to-[#0F1326]/40 backdrop-blur-2xl border border-[#E6C687]/20 shadow-2xl animate-in fade-in duration-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#E6C687] drop-shadow-[0_0_8px_rgba(230,198,135,0.6)] animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.2)' }}>UYNFLIX PREMIUM</h3>
              </div>
              <p className="text-[11px] text-[#d0c5b5]/60 font-medium leading-relaxed max-w-md">
                Tài khoản của bạn đang sở hữu đặc quyền: Thưởng thức bom tấn điện ảnh độ phân giải <span className="text-[#ffe3ae] font-bold">4K HDR</span>, đường truyền mượt mà và tuyệt đối không quảng cáo.
              </p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 shrink-0 cursor-pointer focus:outline-none shadow-md">
              Gia hạn
            </button>
          </section>

          {/* KHỐI 3: CÀI ĐẶT BẢO MẬT & MẬT KHẨU */}
          <section className="p-6 md:p-8 rounded-[24px] bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 shadow-2xl animate-in fade-in duration-500">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#d0c5b5]/30 font-bold mb-5 border-b border-white/5 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E6C687]" /> Bảo mật hệ thống
            </h3>
            
            <div className="flex items-center justify-between py-1">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#e8e1da] flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#d0c5b5]/40" /> Mật khẩu liên kết
                </p>
                <p className="text-[10px] text-[#d0c5b5]/30 font-medium">Cập nhật lần cuối: Đồng bộ hóa phiên đăng nhập</p>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-wider text-[#d0c5b5]/40 hover:text-[#ffe3ae] transition-colors cursor-pointer focus:outline-none py-2">
                Đổi mật khẩu
              </button>
            </div>
          </section>

          {/* NÚT ĐĂNG XUẤT */}
          <div className="pt-4 text-left">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-red-500/10 border-white/10 hover:border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-[#d0c5b5]/40 hover:text-red-400 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất khỏi thiết bị
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}