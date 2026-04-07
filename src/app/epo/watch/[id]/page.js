'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function EpoWatchPage({ params }) {
  // Giải mã params theo chuẩn Next.js 15+
  const decodedParams = use(params);
  const id = decodedParams.id;

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        // GỌI ĐÚNG API EPO - EPO trả về mảng trực tiếp, không có trường .movie
        const res = await fetch(`https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`);
        const data = await res.json();
        
        // Fix: EPO trả về mảng [object], lấy phần tử đầu tiên
        const videoData = Array.isArray(data) ? data[0] : data;
        
        if (videoData && videoData.id) {
          setVideo(videoData);
        }
      } catch (error) {
        console.error("Lỗi rạp phim EPO rồi anh yêu ơi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideoDetail();
  }, [id]);

  // Màn hình chờ "nịnh" chị nhà
  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-black uppercase tracking-[0.5em] text-[10px]">
      <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(220,38,38,0.3)]"></div>
      Đang chuẩn bị rạp phim riêng cho Thu Uyên...
    </div>
  );

  if (!video) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 font-black uppercase text-[10px] gap-4">
      <span>Phim không tồn tại trong kho báu.</span>
      <Link href="/epo" className="text-zinc-500 hover:text-white transition-colors underline decoration-1 underline-offset-4 tracking-widest">Quay lại bộ sưu tập</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      <div className="flex flex-col items-center px-4 md:px-10 py-12">
        
        {/* NÚT QUAY LẠI TỐI GIẢN */}
        <div className="w-full max-w-5xl mb-8">
          <Link 
            href="/epo" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-600 hover:border-red-600/50 transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> 
            Trở lại bộ sưu tập
          </Link>
        </div>

        {/* TIÊU ĐỀ PHIM */}
        <div className="w-full max-w-5xl mb-10">
          <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-tight">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
             <span className="text-red-600 text-[9px] font-black uppercase tracking-[0.4em] bg-red-600/10 px-4 py-1.5 rounded-lg border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
               PRIVATE ARCHIVE
             </span>
             <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
               {video.length_min} • {video.views.toLocaleString()} VIEWS • NO TRACE MODE
             </span>
          </div>
        </div>

        {/* TRÌNH PHÁT VIDEO CHÍNH */}
        <div className="w-full max-w-5xl aspect-video bg-zinc-950 rounded-[3rem] overflow-hidden border-2 border-zinc-900 shadow-[0_40px_100px_rgba(0,0,0,1)] mb-12 relative group">
          <iframe 
            src={`https://www.eporner.com/embed/${id}/?autoplay=1`}
            className="w-full h-full"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          ></iframe>
        </div>

        {/* MÔ TẢ & TAGS */}
        <div className="w-full max-w-5xl space-y-10 pb-20">
          <div className="p-12 bg-zinc-900/10 rounded-[3.5rem] border border-zinc-800/30 backdrop-blur-xl">
            <h3 className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.5em] italic">
              Metadata & Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {(video.keywords || "Private, Collection").split(',').map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-zinc-900/50 rounded-md text-[9px] text-zinc-600 font-bold uppercase tracking-wider border border-zinc-800/50">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}