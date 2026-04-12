'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 pt-20 pb-10 text-center border-t border-zinc-900/50 bg-black relative overflow-hidden">
      {/* Hiệu ứng ánh sáng đỏ mờ ảo ở đáy (Glow) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-red-600/20 blur-xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 1. LOGO CHÍNH - Tăng trải nghiệm khi hover */}
        <div className="mb-12 group">
          <Link href="/">
            <h2 className="text-xl md:text-2xl font-black text-white/40 group-hover:text-white uppercase italic tracking-tighter transition-all duration-700 cursor-pointer">
              FOR<span className="group-hover:text-red-600 transition-colors duration-500">UYN</span> CINEMA
            </h2>
          </Link>
          <div className="mt-2 text-[7px] text-zinc-800 uppercase tracking-[0.8em] font-black">
            Private Collection
          </div>
        </div>

        {/* 2. NAVIGATION - Dàn hàng thoáng hơn */}
        <nav className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 mb-12">
          {['About', 'Terms', 'Disclaimer'].map((item, index) => (
            <Link 
              key={index}
              href={`/${item.toLowerCase()}`} 
              className="text-zinc-600 hover:text-red-600 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300"
            >
              {item === 'About' ? 'Giới thiệu' : item === 'Terms' ? 'Điều khoản' : 'Miễn trừ'}
            </Link>
          ))}
        </nav>

        {/* 3. THÔNG TIN BẢN QUYỀN & LỜI NHẮN (Gộp lại cho tinh tế) */}
        <div className="space-y-4 mb-12">
          <p className="text-zinc-600 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black">
            &copy; {new Date().getFullYear()} <span className="text-zinc-500">Designed by</span> ThTung <span className="text-red-900/50">for</span> ThuUyn
          </p>
          
          {/* Lời nhắn ẩn: Chỉ hiện rõ hơn khi hover vào vùng footer */}
          <p className="text-zinc-900 hover:text-zinc-500 text-[8px] italic tracking-[0.2em] font-bold uppercase transition-colors duration-1000 cursor-default">
            Premium Streaming Experience • Created with love - for em
          </p>
        </div>

        {/* 4. TECH STACK BÍ MẬT - Giúp lấp đầy khoảng trống cuối cùng */}
        {/* <div className="flex justify-center items-center gap-4 opacity-[0.03] hover:opacity-20 transition-opacity duration-1000">
           <span className="text-[7px] font-black text-white uppercase tracking-widest">Next.js</span>
           <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
           <span className="text-[7px] font-black text-white uppercase tracking-widest">Tailwind</span>
           <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
           <span className="text-[7px] font-black text-white uppercase tracking-widest">Vercel</span>
        </div> */}

        {/* 5. VẠCH KẺ ĐỎ ĐẶC TRƯNG - Làm dài ra một chút để cân bằng */}
        <div className="mt-10 flex justify-center">
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent"></div>
        </div>
      </div>
    </footer>
  );
}