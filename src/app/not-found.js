'use client';

import Link from 'next/link';
import { Hourglass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    /* 🚀 ĐÃ SỬA: Sử dụng bg-transparent để lộ mây tinh vân Shader chạy ngầm lộng lẫy dưới gầm trang */
    <div className="min-h-screen w-full bg-transparent text-[#e8e1da] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* Hào quang Moonlight Gold mờ sương vuốt nhẹ tâm tinh hệ */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,198,135,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* HỘP KÉN TRUNG TÂM KÍNH MỜ PHA LÊ XANH ĐÊM THẲM */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6 px-6 py-10 bg-[#0F1326]/40 border border-white/5 rounded-[2.5rem] backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Biểu tượng đồng hồ cát chuyển động xoay thiên văn chuẩn Moonlight Gold */}
        <div className="w-16 h-16 rounded-full bg-[#E6C687]/10 text-[#E6C687] flex items-center justify-center mx-auto border border-[#E6C687]/20 shadow-[0_0_15px_rgba(230,198,135,0.1)]">
          <Hourglass className="w-5 h-5 text-[#E6C687] animate-[spin_4s_linear_infinite]" />
        </div>

        {/* Khối chữ thông điệp thanh lịch phát sáng nhẹ */}
        <div className="space-y-2">
          <h2 
            className="text-xl font-bold uppercase tracking-[0.2em] text-[#E6C687]"
            style={{ textShadow: '0 0 12px rgba(230, 198, 135, 0.35)' }}
          >
            Coming Soon
          </h2>
          <p className="text-[11px] font-medium text-[#d0c5b5]/40 tracking-wide leading-relaxed max-w-xs mx-auto">
            Tính năng và không gian điện ảnh này đang được hoàn thiện những mảnh ghép cuối cùng. Hãy quay lại sau nhé nhé! ✨
          </p>
        </div>

        {/* Nút quay xe an toàn về Trang chủ chuẩn Moonlight Button */}
        <div className="pt-2">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-md group"
          >
            Quay về trang chủ
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Dấu ấn bản quyền mờ tinh tế dưới gầm dùng font mono tăm tắp */}
      <p className="absolute bottom-6 text-[9px] font-bold uppercase tracking-[0.45em] text-[#d0c5b5]/20 font-mono">
        Uynflix · 2026 © All Rights Reserved
      </p>
    </div>
  );
}