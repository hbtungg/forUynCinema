'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 pt-16 pb-12 text-center border-t border-zinc-900/50 bg-black relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-2/3 h-24 bg-red-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* LOGO: Trên mobile cho hiện màu đỏ nhẹ luôn, không đợi hover */}
        <div className="mb-10 group">
          <Link href="/home">
            <h2 className="text-lg md:text-2xl font-black text-zinc-500 md:text-white/30 md:group-hover:text-white uppercase italic tracking-tighter transition-all duration-700">
              FOR<span className="text-red-600/80 md:text-zinc-500 md:group-hover:text-red-600">UYN</span> CINEMA
            </h2>
          </Link>
          <div className="mt-2 text-[6px] md:text-[7px] text-zinc-800 uppercase tracking-[0.6em] font-black">
            Private Collection
          </div>
        </div>

        <nav className="flex flex-row justify-center items-center gap-x-6 md:gap-x-12 mb-10">
          {['Giới thiệu', 'Điều khoản', 'Miễn trừ'].map((label, index) => (
            <Link 
              key={index}
              href="#" 
              className="text-zinc-500 md:text-zinc-600 md:hover:text-red-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] py-2"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-zinc-600 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black">
            <span>&copy; {new Date().getFullYear()}</span>
            <p>
              Designed by <span className="text-zinc-500">ThTung</span> 
              <span className="text-red-900/40 mx-2">for</span> 
              <span className="text-zinc-500">ThuUyn</span>
            </p>
          </div>
          
          {/* LỜI NHẮN: Trên mobile cho hiện mờ mờ sẵn (opacity-40) để chị Uyên vẫn đọc được */}
          <p className="text-zinc-700 md:text-zinc-900 md:hover:text-red-600/40 text-[7px] md:text-[8px] italic tracking-[0.15em] font-bold uppercase transition-all duration-1000 px-4 leading-relaxed">
            Premium Streaming Experience • Created with love - for em ❤️
          </p>
        </div>

        {/* CÁI KẾT: Cho chấm đỏ nháy nhẹ (pulse) để thu hút ánh nhìn thay vì đợi hover */}
        <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-600/30 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
              <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent"></div>
            </div>
        </div>
      </div>
    </footer>
  );
}