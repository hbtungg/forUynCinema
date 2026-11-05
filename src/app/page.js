'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import { Play, Info, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MidnightShader from "@/components/MidnightShader"; // 🚀 1. NẠP SHADER HUYỀN ẢO VÀO TRANG CHÀO

const MOVIE_BACKDROPS = [
  'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
  'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
  'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
];

function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const [isExiting, setIsExiting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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
    <main className="relative h-screen w-screen overflow-hidden select-none font-sans text-[#ffffff]" style={{ fontFamily: "var(--font-main)" }}>
      
      <title>Uynflix Việt Nam - Watch series online, watch films online free</title>

      {/* 🚀 2. GĂM SHADER CHẠY NGẦM: Tạo các dải hạt lơ lửng xuyên suốt chuyển cảnh */}
      <MidnightShader />

      {/* ── BACKDROP SLIDESHOW ── */}
      {MOVIE_BACKDROPS.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
          style={{
            /* Để opacity ảnh nền ở mức 0.35 - 0.45 để các dải lụa sáng của Shader phía sau có không gian len lỏi và tỏa sáng rực rỡ */
            backgroundImage: `linear-gradient(to top, rgba(5,5,5,0.5), rgba(5,5,5,0.1)), url(${src})`,
            opacity: i === bgIndex ? 0.4 : 0,
          }}
        />
      ))}

      {/* ── CINEMATIC OVERLAYS ── */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.1) 50%, rgba(5,5,5,0.4) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(5,5,5,0.4) 0%, transparent 60%)' }} />

      {/* ── FADE OUT CHUYỂN CẢNH MƯỢT MÀ ── */}
      <div className={`absolute inset-0 bg-[#050505] z-50 pointer-events-none transition-opacity duration-[800ms] ease-in-out ${isExiting ? 'opacity-100' : 'opacity-0'}`} />

      {/* ── HIGH-END NAVBAR ── */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-16 py-6">
        <Link href="/home" className="block transition-transform duration-300 hover:scale-105">
          <span 
            className="text-2xl font-bold tracking-[0.2em] text-[#e8e8e8] font-sans"
            style={{ textShadow: 'none' }}
          >
            UYNFLIX
          </span>
        </Link>
        
        {status === "loading" ? (
          <div className="w-20 h-8 bg-white/[0.04] border border-white/5 rounded-xl flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
          </div>
        ) : status === "authenticated" ? (
          <span className="text-[10px] font-bold text-[#ffffff] uppercase tracking-[0.2em] bg-[#e8e8e8]/10 border border-[#e8e8e8]/20 px-4 py-2 rounded-xl backdrop-blur-md shadow-sm">
            Welcome, {session?.user?.name || 'Thành viên'}
          </span>
        ) : (
          <button
            onClick={handleLogin}
            className="px-5 py-2 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none shadow-md"
          >
            LOG IN
          </button>
        )}
      </nav>

      {/* ── HERO CONTENT BỀ THẾ CHUẨN IMAX ── */}
      <div className={`absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 transition-all duration-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="max-w-3xl space-y-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#e8e8e8] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Premium Streaming Space
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white leading-[1.05] tracking-tight uppercase">
            Trải nghiệm điện ảnh<br />
            <span className="text-[#ffffff]" style={{ textShadow: 'none' }}>không giới hạn.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#b8b8b8] max-w-lg leading-relaxed font-medium text-justify">
            Hàng ngàn bộ phim bom tấn chất lượng cao, cập nhật liên tục. Tuyệt đối (không) quảng cáo, truyền tải mượt mà trên mọi thiết bị.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={handleEnter}
              className="group flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-[#ffffff] active:scale-[0.98] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current text-black" />
              Bắt đầu xem ngay
            </button>
            <button
              onClick={handleEnter}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white/[0.04] hover:bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer focus:outline-none"
            >
              <Info className="w-4 h-4" />
              Khám phá thêm
            </button>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BADGE STRIP CHUẨN ĐỒNG BỘ 2026 ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-8 md:px-16 py-5 border-t border-white/5 bg-gradient-to-t from-[#050505] to-transparent">
        <div className="flex items-center gap-6 text-[#808080] text-[10px] uppercase tracking-widest font-bold font-mono">
          <span>Saigon Observatory</span>
          <span className="w-px h-3 bg-white/10" />
          <span>HB.TUNGG · 2026</span>
        </div>
        <p className="text-[#808080] text-[9px] tracking-[0.25em] uppercase font-bold font-mono">© 2026 Uynflix</p>
      </div>

      {/* ── BACKDROP SLIDER DOTS BO TRÒN TĂM TẮP ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {MOVIE_BACKDROPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${i === bgIndex ? 'w-8 bg-[#e8e8e8] ' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

    </main>
  );
}

export default dynamic(() => Promise.resolve(WelcomePage), { ssr: false });