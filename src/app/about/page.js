import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />
      
      {/* Thêm mx-auto để căn giữa container chính */}
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-20 max-w-4xl mx-auto">
        
        {/* Nút quay lại */}
        <Link href="/" className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-12 transition-all group w-fit">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        {/* Header căn giữa hoặc giữ Border trái cho chất */}
        <header className="mb-16 border-l-[6px] border-red-600 pl-8">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Giới <span className="text-red-600">thiệu</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">forUyn Cinema - Beyond Streaming</p>
        </header>

        {/* Nội dung section */}
        <section className="space-y-10 text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
          <p>
            Chào mừng bạn đến với <span className="text-white font-black italic">forUyn Cinema</span>. 
            Đây không chỉ là một trang web xem phim trực tuyến thông thường, mà là một không gian giải trí cá nhân hóa 
            được xây dựng với niềm đam mê dành cho điện ảnh và công nghệ.
          </p>
          
          <div className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
             <h3 className="text-red-600 font-black uppercase text-xs mb-4 tracking-[0.4em]">Sứ mệnh của chúng tôi</h3>
             <p className="italic text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
               "Mang đến trải nghiệm xem phim mượt mà, tối giản và lãng mạn nhất. 
               Nơi mỗi khung hình đều là một kỷ niệm dành riêng cho bạn."
             </p>
          </div>

          <p>
            Tại đây, chúng tôi tối ưu hóa mọi trải nghiệm từ giao diện người dùng (UI) đến sự tiện lợi trong tính năng 
            như Lịch sử xem phim, Phim yêu thích và kho phim được cập nhật liên tục từ những nguồn dữ liệu uy tín nhất.
          </p>

          <p className="pt-6 border-t border-zinc-900 text-[10px] uppercase tracking-widest text-zinc-600">
            Cảm ơn bạn đã đồng hành cùng <span className="text-zinc-500">forUyn Cinema</span>.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}