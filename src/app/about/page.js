import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About', 
  description: 'Uynflix - Nơi mỗi khung hình đều là một kỷ niệm dành riêng cho bạn.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden flex flex-col justify-between select-none">
      <Header />
      
      {/* 🚀 ĐÃ SỬA: Giảm pt-24 xuống pt-12 (md:pt-16) để kéo toàn bộ nội dung lên sát Header, không còn khoảng trống lớn */}
      <div className="w-full px-6 md:px-12 pt-12 md:pt-16 pb-20 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* NÚT QUAY LẠI TỐI GIẢN */}
        <div className="w-full flex justify-start mb-6">
          <Link 
            href="/home" 
            className="text-zinc-600 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all group"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
          </Link>
        </div>

        {/* 🚀 BỐ CỤC GRID 2 CỘT: Cân đối không gian toàn diện, lấp đầy mọi khoảng trống trải */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): HEADER THƯƠNG HIỆU PHẲNG LÌ */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
            <header className="border-l-[4px] border-red-600 pl-6 text-left">
              <p className="text-red-600 font-black uppercase tracking-[0.45em] text-[9px] mb-1">
                Premium Streaming
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-3">
                Giới <span className="text-zinc-800">thiệu</span>
              </h1>
              <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[9px] opacity-80">
                Uynflix - Beyond Streaming
              </p>
            </header>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium pl-7 max-w-sm">
              Chào mừng bạn đến với <span className="text-white font-black italic tracking-wide">Uynflix</span>. 
              Đây không chỉ là một nền tảng xem phim trực tuyến thông thường, mà là một không gian giải trí cá nhân hóa 
              được xây dựng trọn vẹn với niềm đam mê dành cho điện ảnh và công nghệ cốt lõi.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): KHỐI SỨ MỆNH VÀ CÁC KÉN TÍNH NĂNG BỔ TRỢ */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* KHỐI SỨ MỆNH CỐT LÕI KÉN MỎNG */}
            <div className="bg-white/[0.01] border border-white/[0.04] p-8 md:p-10 rounded-2xl shadow-2xl space-y-3">
               <h3 className="text-red-600 font-black uppercase text-[9px] tracking-[0.5em]">Sứ mệnh cốt lõi</h3>
               <p className="italic text-zinc-200 text-base md:text-lg font-light leading-relaxed">
                 &ldquo;Mang đến trải nghiệm xem phim mượt mà, tối giản và lãng mạn nhất. 
                 Nơi mỗi khung hình đều là một kỷ niệm dành riêng cho bạn.&rdquo;
               </p>
            </div>

            {/* HỆ THỐNG GRID PHỤ CHO CÁC TÍNH NĂNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.005] border border-white/[0.02] p-5 rounded-xl space-y-1.5">
                <span className="text-base">🎬</span>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Kho phim chọn lọc</h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Dữ liệu nguồn uy tín được cập nhật liên tục thời gian thực, đảm bảo luồng phát mượt mà kịch trần.</p>
              </div>

              <div className="bg-white/[0.005] border border-white/[0.02] p-5 rounded-xl space-y-1.5">
                <span className="text-base">👁️</span>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Lưu vết lịch sử</h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Hệ thống lưu vết tự động tiến trình tập phim đang xem dở, giúp bạn tiếp tục hành trình điện ảnh bất cứ lúc nào.</p>
              </div>

              <div className="bg-white/[0.005] border border-white/[0.02] p-5 rounded-xl space-y-1.5 sm:col-span-2">
                <span className="text-base">💎</span>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Thiết kế tối giản kịch trần</h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Ngôn ngữ thiết kế kén mỏng phẳng lỳ, loại bỏ mọi chi tiết thừa thãi để tập trung trọn vẹn vào nội dung phim.</p>
              </div>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-8 border-t border-white/[0.03] mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-bold">
            Cảm ơn bạn đã đồng hành cùng <span className="text-zinc-500 hover:text-zinc-400 transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>

      <Footer />
    </main>
  );
}