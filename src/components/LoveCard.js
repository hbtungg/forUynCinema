'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function LoveCard({ movie }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    // LOGIC ĐIỀU KHIỂN VIDEO
    useEffect(() => {
        if (movie.type === 'video' && videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isPlaying, movie.type]);

    const finalHref = `/watch/${movie.slug}`;

    const getEpisodeLabel = () => {
        return movie.episode_current || "Movie";
    };

    const handleCardClick = (e) => {
        if (movie.type === 'video') {
            e.preventDefault();
            e.stopPropagation();
            setIsPlaying(true);
        }
    };

    return (
        <div
            className="group relative block w-full h-full font-sans cursor-pointer"
            onClick={handleCardClick}
        >
            {/* 1. KHU VỰC ẢNH BÌA / VIDEO PLAYER */}
            <div className="relative aspect-[2/3] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden border border-zinc-900 transition-all duration-300 group-hover:border-neutral-600/70 shadow-2xl bg-[#0a0a0a] mb-4 ">

                {/* LỚP 1: ẢNH BÌA & LINK (ẨN KHI ĐANG PHÁT VIDEO) */}
                {!isPlaying && (
                    <div className="absolute inset-0 z-10 block transition-opacity duration-300 opacity-100">
                        <img
                            src={movie.thumb_url}
                            alt={movie.name}
                            // Tăng opacity lên 90 để ảnh rõ nét hơn
                            className="w-full h-full object-cover opacity-90 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* GRADIENT TỐI GIẢN: Chỉ chiếm 1/6 chiều cao và rất mờ, chỉ để tạo chiều sâu đáy card */}
                        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-black/40 to-transparent z-20"></div>

                        {/* ICON PLAY - RỰC ĐỎ KHI HOVER */}
                        {movie.type === 'video' && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center text-white/40 group-hover:text-neutral-300 transition-all duration-300 group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>
                            </div>
                        )}
                    </div>
                )}

                {/* LỚP 2: VIDEO PLAYER - FIX LỖI NHẢY FULLSCREEN TRÊN IOS */}
                {movie.type === 'video' && (
                    <video
                        ref={videoRef}
                        src={movie.video_url}
                        controls={isPlaying}

                        // BA THUỘC TÍNH "VÀNG" ĐỂ TRỊ IOS:
                        playsInline      // Quan trọng nhất: Ép phát ngay tại chỗ
                        webkit-playsinline="true" // Hỗ trợ các bản iOS cũ hơn
                        x5-playsinline="true"     // Hỗ trợ một số trình duyệt khác

                        className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-300 
      ${isPlaying ? 'opacity-100' : 'opacity-0'}
      object-cover`}
                        onEnded={() => setIsPlaying(false)}
                    />
                )}

                {/* NÚT TRÁI TIM TRÒN (ẨN KHI ĐANG PHÁT VIDEO) */}
                {!isPlaying && (
                    <div className="absolute bottom-4 right-4 z-40 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-90 md:group-hover:scale-100 transition-all duration-300">
                        <div className="flex items-center justify-center w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg active:scale-75 overflow-hidden">
                            <div className="[&_span]:hidden [&_p]:hidden [&_label]:hidden [&_button]:bg-transparent [&_button]:border-none [&_button]:p-0 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:m-0 flex items-center justify-center">
                            </div>
                        </div>
                    </div>
                )}

                {/* BADGES THÔNG TIN */}
                {!isPlaying && (
                    <>
                        <div className="absolute top-3 left-3 px-2.5 h-5 bg-neutral-700/90 backdrop-blur-md rounded-lg z-50 flex items-center justify-center text-[7px] md:text-[8px] font-semibold uppercase text-white tracking-widest shadow-lg">
                            {getEpisodeLabel()}
                        </div>
                        <div className="absolute top-3 right-3 px-2 h-5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-50 flex items-center justify-center text-[7px] md:text-[8px] font-semibold text-zinc-400 uppercase tracking-widest">
                            {movie.quality || 'FHD'}
                        </div>
                    </>
                )}
            </div>

            {/* 2. THÔNG TIN PHÍA NGOÀI - GIỮ NGUYÊN ĐỂ KHỚP TỔNG THỂ */}
            <div className="px-2 space-y-1.5">
                <h3 className="text-white font-semibold uppercase text-[12px] md:text-[14px] leading-tight truncate tracking-tight group-hover:text-neutral-300 transition-colors duration-300">
                    {movie.name}
                </h3>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-2 mt-2">
                    <span className="text-zinc-500 text-[8px] font-semibold uppercase tracking-widest truncate pr-4 max-w-[75%]">
                        {movie.origin_name || movie.original_name || "Original Title"}
                    </span>
                    <span className="text-zinc-600 text-[10px] font-semibold italic tracking-widest flex-shrink-0">
                        {movie.year || '2026'}
                    </span>
                </div>
            </div>
        </div>
    );
}