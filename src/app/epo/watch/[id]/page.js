'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import RelatedMovies from '@/components/RelatedMovies'; // QUAN TRỌNG: Phải import cái này!

export default function EpoWatchPage({ params }) {
  const decodedParams = use(params);
  const id = decodedParams.id;

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        // Dùng proxy hoặc fetch trực tiếp (nếu server cho phép)
        const res = await fetch(`https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`);
        const data = await res.json();

        // Cấu trúc EPO trả về mảng, lấy phần tử đầu tiên
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

        {/* NÚT QUAY LẠI */}
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
              {video.length_min} • {video.views?.toLocaleString()} VIEWS • NO TRACE MODE
            </span>
          </div>
        </div>

        {/* PLAYER - FIX KHUNG DÀI HƠN PHIM & BO GÓC TĂM TẮP */}
        <div className="w-full max-w-5xl mx-auto mb-12 relative group p-1.5 bg-zinc-900 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,1),0_0_30px_rgba(220,38,38,0.1)]">
          {/* LỚP BỌC TRONG: ÉP VIDEO PHẢI KHỚP KHUNG */}
          <div className="relative w-full pb-[56.25%] h-0 rounded-[2.1rem] overflow-hidden bg-black">
            <iframe
              src={`https://www.eporner.com/embed/${id}/?autoplay=1`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
            ></iframe>

            {/* Viền đỏ hiệu ứng bao phủ toàn bộ - Cân bằng góc bo */}
            <div className="absolute inset-0 pointer-events-none border-2 border-red-600/5 group-hover:border-red-600/20 rounded-[2.1rem] transition-colors duration-500"></div>
          </div>
        </div>

        {/* MÔ TẢ & ĐỀ XUẤT */}
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

          {/* Ở cuối WatchPage (page.js) */}
          <div className="w-full max-w-5xl">
            {video && (
              <RelatedMovies
                key={id}
                isEpo={true}
                currentId={id}
                actor={(() => {
                  // 1. Ưu tiên tuyệt đối nếu API trả về trường stars (test_stars)
                  if (video.test_stars && video.test_stars.trim() !== "") return video.test_stars.trim();

                  // 2. Nếu không có stars, ta tiến hành "Lọc Sạch" Keywords
                  if (video.keywords) {
                    const allTags = video.keywords.split(',').map(tag => tag.trim().toLowerCase());

                    // DANH SÁCH ĐEN: Những từ này hễ xuất hiện trong tag là LOẠI NGAY (vì không phải tên người)
                    const blackList = [
                      'homemade', 'amateur', 'teen', 'milf', 'big', 'small', 'hardcore',
                      'anal', 'pov', 'interracial', 'cum', 'facial', 'toys', 'gangbang',
                      'public', 'office', 'nurse', 'massage', 'yoga', 'student', 'mom',
                      'sister', 'brother', 'step', 'vintage', 'hd', '4k', 'vr', 'parody',
                      'party', 'college', 'beach', 'hotel', 'outdoor', 'indoor', 'bbc'
                    ];

                    // Lọc bỏ những tag chứa bất kỳ từ nào trong Blacklist
                    const potentialActors = allTags.filter(tag => {
                      // Nếu tag chỉ có 1 từ (như "teen") thì thường không phải tên diễn viên chính xác
                      if (!tag.includes(' ')) return false;

                      // Kiểm tra xem tag có chứa từ cấm nào không
                      const containsBlacklisted = blackList.some(badWord => tag.includes(badWord));
                      return !containsBlacklisted;
                    });

                    // Nếu sau khi lọc mà có kết quả, lấy cái đầu tiên (Khả năng cao là Melody Marks, v.v.)
                    if (potentialActors.length > 0) {
                      // Trả về định dạng viết hoa chữ cái đầu cho đẹp
                      return potentialActors[0].replace(/\b\w/g, l => l.toUpperCase());
                    }

                    // 3. Dự phòng cuối cùng: Nếu lọc xong không còn gì, lấy tag đầu tiên nhưng bỏ dấu #
                    return allTags[0].replace(/\b\w/g, l => l.toUpperCase());
                  }
                  return "";
                })()}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}