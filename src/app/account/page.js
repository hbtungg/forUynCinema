// src/app/account/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Điều hướng về trang đăng nhập nếu chưa có session
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Vòng chờ tinh tế khi đang check quyền
  if (status === 'loading') {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] dark:bg-[#0a0a0c] bg-[#f4f1ea] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen w-screen bg-white dark:bg-[#0a0a0c] text-zinc-900 dark:text-white font-sans antialiased flex flex-col overflow-hidden select-none transition-colors duration-300">
      
      {/* 1. HEADER */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* 2. TẦNG THÂN GIỮA */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden relative">
        
        {/* SIDEBAR BÊN TRÁI */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* 3. KHU VỰC RUỘT CHỨA NỘI DUNG TÀI KHOẢN */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar flex flex-col justify-start">
          
          <div className="w-full max-w-4xl mx-auto px-6 md:px-10 pt-10 pb-16 flex-1">
            
            {/* Tiêu đề trang */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Tài khoản của bạn</h1>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
                Quản lý thông tin và gói dịch vụ
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Khối Thông tin Cá nhân - Layout tối giản, viền mỏng */}
              <section className="p-6 md:p-8 rounded-2xl bg-zinc-50 dark:bg-[#111115] border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar lấy chữ cái đầu */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner flex-shrink-0">
                    <span className="text-3xl font-black text-zinc-500 dark:text-zinc-400">
                      {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h2 className="text-lg font-black tracking-wide">{session?.user?.name || 'Thành viên forUyn'}</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{session?.user?.email}</p>
                    <div className="pt-2 flex gap-3">
                      <button className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-white/5 dark:hover:bg-white/10 text-[10px] font-black uppercase tracking-wider transition-colors duration-200">
                        Chỉnh sửa hồ sơ
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Khối Gói Dịch Vụ Premium */}
              <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-[#111115] border border-red-100 dark:border-red-900/30 transition-colors duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-red-600 dark:text-red-500 text-lg leading-none">♛</span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400">forUyn Premium</h3>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">Bạn đang sử dụng đặc quyền xem phim 4K không quảng cáo.</p>
                </div>
                <button className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-transform duration-200 active:scale-95 shadow-lg shadow-red-600/20">
                  Gia hạn gói
                </button>
              </section>

              {/* Khối Cài đặt Mật khẩu & Bảo mật */}
              <section className="p-6 md:p-8 rounded-2xl bg-zinc-50 dark:bg-[#111115] border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                <h3 className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-black mb-5 border-b border-zinc-200 dark:border-white/5 pb-3">Bảo mật</h3>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold">Mật khẩu</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Cập nhật lần cuối: Chưa rõ</p>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </section>

              {/* Nút Đăng Xuất */}
              <div className="pt-4">
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full md:w-auto px-8 py-3 rounded-xl border border-zinc-300 hover:border-zinc-400 dark:border-white/10 dark:hover:border-white/20 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200"
                >
                  Đăng xuất khỏi thiết bị
                </button>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="w-full block clear-both mt-auto flex-shrink-0 border-t border-zinc-200 dark:border-white/5">
            <Footer className="w-full" />
          </div>
          
        </div>
      </div>
    </div>
  );
}