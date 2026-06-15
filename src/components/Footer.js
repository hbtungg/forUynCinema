'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.05] bg-[#0a0a0c]">
      
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-20 left-1/2 h-52 w-[70%] -translate-x-1/2 bg-red-600/10 blur-[140px]" />
        <div className="absolute top-0 left-0 h-40 w-40 bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
        
        {/* TOP */}
        <div className="flex flex-col gap-8 w-full">
          
          {/* ── KHỐI 1: LOGO CHÍNH (Đứng độc lập kiêu sa ở trên) ── */}
          <div className="text-center md:text-left">
            <Link href="/home" className="group inline-block overflow-visible">
              <img 
                src="/logo.png" 
                alt="forUynCinema Logo" 
                className="h-20 md:h-24 w-auto object-contain object-left mx-auto md:mx-0 select-none transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
              />
            </Link>
          </div>

          {/* ── KHỐI 2: 🚀 ĐÃ SỬA CHÍNH — DÀN HÀNG NGANG ĐỐI XỨNG TUYỆT ĐỐI ── */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-white/[0.02]">
            
            {/* BÊN TRÁI: Dòng chữ phụ hệ thống */}
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-zinc-600 text-center md:text-left">
              Private Streaming Collection
            </p>

            {/* BÊN PHẢI: Hệ thống Menu điều hướng (Đã nhảy lên nằm ngang hàng chuẩn chỉ với chữ phụ) */}
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                { label: 'Giới thiệu', href: '/about' },
                { label: 'Điều khoản',  href: '/terms' },
                { label: 'Miễn trừ',   href: '/disclaimer' },
                { label: 'Liên hệ',    href: '/contact' },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 transition-all duration-300 hover:text-red-500 py-1"
                >
                  {item.label}
                  {/* Thanh chỉ đỏ chạy từ giữa sang hai bên cực kỳ cân xứng */}
                  <span className="absolute bottom-0 left-1/2 h-px w-0 bg-red-600 transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
                </Link>
              ))}
            </nav>

          </div>

          {/* ── KHỐI 3: MÔ TẢ & QUOTE (Nằm dưới khay ngang hàng) ── */}
          <div className="flex flex-col gap-6 md:flex-row items-center justify-between mt-2">
            <p className="max-w-xl text-xs leading-relaxed text-zinc-500 text-center md:text-left">
              A modern cinematic streaming experience crafted with elegance,
              emotion and obsession for visual perfection.
            </p>
            
            <p className="max-w-md text-center md:text-right text-[10px] italic leading-relaxed tracking-[0.18em] text-zinc-700 transition-all duration-700 hover:text-red-500/60 flex-shrink-0">
              Premium Streaming Experience • Created with love
            </p>
          </div>

        </div>

        {/* DIVIDER TRUNG TÂM */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* COPYRIGHT */}
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-600">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="text-zinc-800">•</span>
              <span>All Rights Reserved</span>
            </div>

            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-700">
              Designed by{' '}
              <span className="text-zinc-400">ThTung</span>
              {/* <span className="mx-2 text-red-900/50">for</span>
              <span className="text-zinc-400">ThuUyn</span> */}
            </p>
          </div>

          {/* END DOT */}
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-800" />

            <div className="relative flex items-center justify-center">
              <div className="absolute h-4 w-4 animate-ping rounded-full bg-red-600/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
            </div>

            <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>
        </div>
      </div>
    </footer>
  );
}