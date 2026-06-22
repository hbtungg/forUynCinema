'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 select-none relative overflow-hidden antialiased">
      
      {/* Lớp nền mờ ảo tạo chiều sâu vách kính */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 px-6 py-10 bg-[#111114]/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        
        {/* Biểu tượng đồng hồ cát đang chờ */}
        <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center mx-auto border border-red-600/20 animate-pulse">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Khối chữ thông điệp thanh lịch */}
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-widest text-white italic">
            Coming Soon
          </h2>
          <p className="text-[11px] font-medium text-zinc-500 tracking-wide leading-relaxed max-w-xs mx-auto">
            Tính năng và không gian điện ảnh này đang được hoàn thiện những mảnh ghép cuối cùng. Hãy quay lại sau nhé! ❤️
          </p>
        </div>

        {/* Nút quay xe an toàn về Trang chủ */}
        <div className="pt-2">
          <Link
            href="/home" // Đường dẫn trang chủ chuẩn của anh
            className="inline-block px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-[0_10px_25px_rgba(220,38,38,0.15)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>

      {/* Dấu ấn bản quyền mờ tinh tế dưới gầm */}
      <p className="absolute bottom-6 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-800">
        Uynflix • 2026 © All Rights Reserved
      </p>
    </div>
  );
}