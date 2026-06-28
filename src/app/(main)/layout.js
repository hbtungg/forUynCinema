// src/app/(main)/layout.js
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer'; // 🚀 1. ĐÃ THÊM: Import Footer vào Layout tổng

export default function MainLayout({ children }) {
  // Quản lý trạng thái thu gọn Sidebar tập trung (w-16 thu nhỏ = true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="relative min-h-screen text-[#FAFAFA] font-sans antialiased bg-transparent selection:bg-[#E6C687]/30">
      
      {/* 1. Thanh Header thắp sáng trọn vẹn kịch trần trên cùng (fixed h-[72px]) */}
      <Header 
        sidebarCollapsed={sidebarCollapsed} 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* 2. Thanh Sidebar trái (Cố thủ fixed dưới gầm h-[72px], không bao giờ che khuất Header) */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* 3. 🚀 KHỐI NỘI DUNG CHÍNH (Nằm hoàn toàn bên phải Sidebar và cuộn dọc tự nhiên) */}
      <div 
        className={`pt-[72px] pb-16 md:pb-0 min-h-screen flex flex-col transition-all duration-300 ease-in-out pl-0
          ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}
      >
        {/* Ruột nội dung chính chứa các khay phim */}
        <main className="p-4 md:p-6 flex-grow relative">
          {children}
        </main>

        {/* 🚀 2. ĐÃ THÊM VỊ TRÍ MỚI: Footer chốt chặn dưới cùng, trải rộng 100% bên phải Sidebar */}
        <Footer />
      </div>

    </div>
  );
}