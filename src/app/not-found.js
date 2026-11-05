'use client';

import Link from 'next/link';
import { Hourglass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    /* 🚀 ĐÃ SỬA: Sử dụng bg-transparent để lộ Shader chạy ngầm lộng lẫy dưới gầm trang */
    <div className="min-h-screen w-full bg-transparent text-[#ffffff] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden font-sans" style={{ fontFamily: "var(--font-main)" }}>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,232,232,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 px-6 py-10 bg-white/[0.04] border border-white/5 rounded-[2.5rem] backdrop-blur-2xl  animate-in fade-in zoom-in-95 duration-300">
        
        <div className="w-16 h-16 rounded-full bg-[#e8e8e8]/10 text-[#e8e8e8] flex items-center justify-center mx-auto border border-[#e8e8e8]/20 ">
          <Hourglass className="w-5 h-5 text-[#e8e8e8] animate-[spin_4s_linear_infinite]" />
        </div>

        <div className="space-y-2">
          <h2 
            className="text-xl font-bold uppercase tracking-[0.2em] text-[#e8e8e8]"
            style={{ textShadow: 'none' }}
          >
            Coming Soon
          </h2>
          <p className="text-[11px] font-medium text-[#808080] tracking-wide leading-relaxed max-w-xs mx-auto">
            Tính năng này đang được hoàn thiện. Hãy quay lại sau nhé nhé! ✨
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-md group"
          >
            Quay về trang chủ
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Dấu ấn bản quyền mờ tinh tế dưới gầm dùng font mono tăm tắp */}
      <p className="absolute bottom-6 text-[9px] font-bold uppercase tracking-[0.45em] text-[#808080] font-mono">
        Uynflix · 2026 © All Rights Reserved
      </p>
    </div>
  );
}