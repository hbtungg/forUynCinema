'use client';

import Link from 'next/link';
import { ArrowLeft, Film, Eye, Gem, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa nội bộ */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      <div className="w-full px-4 md:px-12 pt-6 pb-20 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <div className="w-full flex justify-start mb-6">
          <Link 
            href="/home" 
            className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </Link>
        </div>

        {/* BỐ CỤC GRID 2 CỘT TÂN TIẾN */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): HEADER THƯƠNG HIỆU PHẲNG LÌ ÁNH VÀNG */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
            <header className="border-l-4 border-[#E6C687] pl-5 text-left space-y-1">
              <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">
                Premium Streaming
              </p>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
                Giới thiệu: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Uynflix</span>
              </h1>
              <p className="text-[#d0c5b5]/30 font-bold uppercase tracking-[0.25em] text-[9px] pt-1">
                Beyond Streaming System
              </p>
            </header>
            
            <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium pl-6 max-w-sm text-justify">
              Chào mừng bạn đến với <span className="text-white font-bold italic tracking-wide">Uynflix</span>. 
              Đây không chỉ là một nền tảng xem phim trực tuyến thông thường, mà là một không gian giải trí cá nhân hóa 
              được xây dựng trọn vẹn với niềm đam mê sâu sắc dành cho điện ảnh nghệ thuật và công nghệ tối ưu cốt lõi.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): KHỐI SỨ MỆNH VÀ CÁC KÉN TÍNH NĂNG BỔ TRỢ PHA LÊ */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* KHỐI SỨ MỆNH CỐT LÕI BỌC KÍNH MỜ XANH ĐÊM THẲM */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 md:p-8 rounded-[24px] shadow-2xl space-y-3">
               <h3 className="text-[#E6C687] font-bold uppercase text-[9px] tracking-[0.4em] flex items-center gap-1.5">
                 <Sparkles className="w-3.5 h-3.5" /> Sứ mệnh cốt lõi
               </h3>
               <p className="italic text-[#e8e1da]/90 text-sm md:text-base font-medium leading-relaxed text-justify">
                 &ldquo;Mang đến trải nghiệm xem phim mượt mà, tối giản và lãng mạn nhất. 
                 Nơi mỗi khung hình đều là một kỷ niệm thiên văn dành riêng cho bạn.&rdquo;
               </p>
            </div>

            {/* HỆ THỐNG GRID PHỤ CHO CÁC TÍNH NĂNG CHUẨN PHA LÊ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-[#0F1326]/20 backdrop-blur-md border border-white/5 p-5 rounded-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
                <Film className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Kho phim chọn lọc</h4>
                <p className="text-[11px] text-[#d0c5b5]/40 font-medium leading-relaxed text-justify">Dữ liệu nguồn điện ảnh uy tín được đồng bộ liên tục theo thời gian thực, đảm bảo luồng phát mượt mà kịch trần.</p>
              </div>

              <div className="bg-[#0F1326]/20 backdrop-blur-md border border-white/5 p-5 rounded-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
                <Eye className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Lưu vết lịch sử</h4>
                <p className="text-[11px] text-[#d0c5b5]/40 font-medium leading-relaxed text-justify">Hệ thống ghi vết tự động chính xác tiến trình tập phim đang xem dở, giúp bạn tiếp nối hành trình bất cứ lúc nào.</p>
              </div>

              <div className="bg-[#0F1326]/20 backdrop-blur-md border border-white/5 p-5 rounded-2xl space-y-2 sm:col-span-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
                <Gem className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" />
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Thiết kế tối giản kịch trần</h4>
                <p className="text-[11px] text-[#d0c5b5]/40 font-medium leading-relaxed text-justify">Ngôn ngữ kén mỏng phẳng lỳ sang trọng, loại bỏ hoàn toàn các chi tiết thừa thãi để bạn tập trung trọn vẹn vào nội dung phim.</p>
              </div>

            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-6 border-t border-white/5 mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#d0c5b5]/20 font-bold">
            Cảm ơn bạn đã đồng hành cùng không gian <span className="text-[#d0c5b5]/40 hover:text-[#E6C687] transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>
    </div>
  );
}