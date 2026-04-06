'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function EpoWatchPage({ params }) {
  // Giải mã params từ Next.js 15+
  const decodedParams = use(params);
  const id = decodedParams.id;

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        // FETCH DỮ LIỆU ĐỂ HIỂN THỊ - TUYỆT ĐỐI KHÔNG LƯU LẠI DỮ LIỆU GÌ
        const res = await fetch(`https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`);
        const data = await res.json();
        
        const videoData = Array.isArray(data) ? data[0] : data;
        
        if (videoData) {
          setVideo(videoData);
          // Đã xóa hoàn toàn: useSession, localStorage.setItem, và fetch('/api/history')
          // Không một dấu vết nào được để lại sau khi xem xong.
        }
      } catch (error) {
        console.error("Lỗi rạp phim EPO rồi anh yêu ơi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideoDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-[0.5em] animate-pulse text-[10px]">
      Đang chuẩn bị phòng chiếu riêng cho Thu Uyên...
    </div>
  );

  if (!video) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-black uppercase text-[10px]">
      Phim không tồn tại hoặc đã bị xóa.
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* KHÔNG CÓ HEADER ĐỂ ĐẢM BẢO RIÊNG TƯ TUYỆT ĐỐI */}

      <div className="flex flex-col items-center px-4 md:px-10 py-12">
        
        {/* NÚT QUAY LẠI - Cửa thoát duy nhất về kho EPO */}
        <div className="w-full max-w-5xl mb-6">
          <Link 
            href="/epo" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-red-600/50 transition-all group shadow-xl"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" height="14" 
              fill="currentColor" 
              viewBox="0 0 16 16"
              className="transform group-hover:-translate-x-1.5 transition-transform duration-300"
            >
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Trở lại bộ sưu tập
          </Link>
        </div>

        {/* TIÊU ĐỀ PHIM */}
        <div className="w-full max-w-5xl mb-8">
          <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            {video.title}
          </h1>
          <div className="flex items-center gap-3 mt-4">
             <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest bg-zinc-900/50 px-3 py-1 rounded-md border border-zinc-800/50">
               EPO PRIVATE VIEW
             </span>
             <span className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em]">
               {video.length_min} • NO TRACE MODE
             </span>
          </div>
        </div>

        {/* TRÌNH PHÁT VIDEO CHÍNH */}
        <div className="w-full max-w-5xl aspect-video bg-zinc-950 rounded-[2.5rem] overflow-hidden border-2 border-zinc-900 shadow-[0_0_60px_rgba(0,0,0,1)] mb-10 relative">
          <iframe 
            src={`https://www.eporner.com/embed/${id}/?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          ></iframe>
        </div>

        {/* MÔ TẢ PHIM */}
        <div className="w-full max-w-5xl space-y-8 pb-16">
          <div className="p-10 bg-zinc-900/10 rounded-[3rem] border border-zinc-800/30 backdrop-blur-sm">
            <h3 className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.4em]">
              Nội dung bí mật
            </h3>
            <p className="text-zinc-500 text-[12px] leading-relaxed font-medium opacity-80 italic">
              {video.keywords || "Kho phim riêng tư của Thu Uyên."}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}