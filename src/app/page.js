'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MOVIE_BACKDROPS = [
  'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
  'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
  'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
];

function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // 🚀 ĐÃ CẬP NHẬT: Lấy thêm dữ liệu session để lấy tên người dùng
  const [isExiting, setIsExiting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = 'Uynflix Việt Nam - Watch series online, watch films online free';
    const animationFrame = requestAnimationFrame(() => {
      setLoaded(true);
    });

    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % MOVIE_BACKDROPS.length);
    }, 6000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => router.push('/home'), 800);
  };

  const handleLogin = () => {
    setIsExiting(true);
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden select-none font-sans">

      {/* ── BACKDROP SLIDESHOW ── */}
      {MOVIE_BACKDROPS.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === bgIndex ? 1 : 0,
          }}
        />
      ))}

      {/* ── CINEMATIC OVERLAYS ── */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

      {/* ── FADE OUT ── */}
      <div className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-[800ms] ease-in-out ${isExiting ? 'opacity-100' : 'opacity-0'}`} />

      {/* ── NAVBAR ── */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-16 py-6">
        <Image
          src="/logo.png"
          alt="Uynflix"
          width={140}
          height={40}
          className="object-contain"
          priority
        />
        
        {/* 🛠️ ĐÃ CẬP NHẬT: Xử lý hiển thị động khu vực nút góc phải */}
        {status === "loading" ? (
          // Khối skeleton mờ nhẹ khi đang tải trạng thái
          <div className="w-20 h-8 bg-white/5 rounded animate-pulse" />
        ) : status === "authenticated" ? (
          // Khi ĐÃ ĐĂNG NHẬP: Hiện dòng chữ welcome phẳng, viết hoa sang trọng
          <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.2em] select-none bg-white/[0.03] border border-white/[0.05] px-4 py-2 rounded-lg backdrop-blur-sm">
            Welcome, {session?.user?.name || 'User'}
          </span>
        ) : (
          // Khi CHƯA ĐĂNG NHẬP: Hiện nút Đăng nhập mặc định
          <button
            onClick={handleLogin}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold rounded transition-all duration-200 cursor-pointer"
          >
            Đăng nhập
          </button>
        )}
      </nav>

      {/* ── HERO CONTENT ── */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-2xl space-y-6">

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-500">
            ● Premium Streaming Platform
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Trải nghiệm điện ảnh<br />
            <span className="text-red-500">không giới hạn.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
            Hàng ngàn bộ phim bom tấn chất lượng cao, cập nhật liên tục. Không quảng cáo, trải nghiệm mượt mà trên mọi thiết bị.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleEnter}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-white/90 active:scale-[0.98] text-black font-bold text-base rounded transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Bắt đầu xem ngay
            </button>
            <button
              onClick={handleEnter}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 active:scale-[0.98] text-white font-semibold text-base rounded backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Xem thêm
            </button>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BADGE STRIP ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-8 md:px-16 py-5 border-t border-white/10">
        <div className="flex items-center gap-6 text-white/50 text-[11px] uppercase tracking-widest font-semibold">
          <span>Saigon</span>
          <span className="w-px h-3 bg-white/20" />
          <span>09 · 11 · 2025</span>
        </div>
        <p className="text-white/30 text-[10px] tracking-widest uppercase font-semibold">© 2026 Uynflix</p>
      </div>

      {/* ── BACKDROP DOTS ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {MOVIE_BACKDROPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${i === bgIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>

    </main>
  );
}

export default dynamic(() => Promise.resolve(WelcomePage), { ssr: false });