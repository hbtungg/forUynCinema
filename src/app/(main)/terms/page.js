'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldAlert, Scale, UserCheck, RefreshCw } from 'lucide-react';

export default function TermsPage() {
  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa nội bộ */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      <div className="w-full px-4 md:px-12 py-6 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <div className="w-full flex justify-start mb-6">
          <Link 
            href="/home" 
            className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </Link>
        </div>

        {/* BỐ CỤC GRID 2 CỘT TÂN TIẾN KHÔNG LO KHOẢNG TRỐNG */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): TIÊU ĐỀ PHÂN KHU GHIM CỐ ĐỊNH ÁNH VÀNG */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
            <header className="border-l-4 border-[#E6C687] pl-5 text-left space-y-1">
              <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">
                Legal Agreements
              </p>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
                Điều khoản: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Sử dụng</span>
              </h1>
              <p className="text-[#d0c5b5]/30 font-bold uppercase tracking-[0.25em] text-[9px] pt-1">
                Cập nhật lần cuối: Tháng 6, 2026
              </p>
            </header>
            
            <p className="text-[#d0c5b5]/40 text-xs leading-relaxed font-medium pl-6 max-w-xs text-justify">
              Các quy định pháp lý, trách nhiệm thành viên và tuyên bố miễn trừ trách nhiệm bản quyền kỹ thuật số tại hệ thống Uynflix.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): DANH SÁCH CÁC KÉN ĐIỀU KHOẢN PHA LÊ KÍNH MỜ */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* MỤC 01 */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> 01. Chấp nhận điều khoản
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Bằng cách truy cập và sử dụng <span className="text-white font-bold italic tracking-wide">Uynflix</span>, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
              </p>
            </div>

            {/* MỤC 02: TUYÊN BỐ MIỄN TRỪ BẢN QUYỀN ĐỒNG BỘ ÁNH VÀNG ĐANH THÉP */}
            <div className="bg-[#0F1326]/60 backdrop-blur-2xl border border-[#E6C687]/30 p-6 rounded-[22px] shadow-2xl space-y-3 transition-all duration-300 shadow-[0_0_15px_rgba(230,198,135,0.05)]">
              <h2 className="text-[#ffe3ae] font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E6C687]" /> 02. Tuyên bố miễn trừ bản quyền
              </h2>
              <p className="text-[#e8e1da] text-xs md:text-sm leading-relaxed font-semibold text-justify">
                <span className="text-white font-bold italic tracking-wide">Uynflix</span> là một nền tảng cung cấp giải pháp công nghệ giao diện tối giản. Chúng tôi hoạt động hoàn toàn dựa trên việc kết nối và sử dụng giao thức API truyền phát trực tuyến (Streaming) nguồn ngoài công cộng từ đối tác cung cấp dữ liệu độc lập <span className="text-white font-bold underline decoration-white/20 underline-offset-4">phim.nguonc.com</span>.
              </p>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium pt-1 text-justify">
                Hệ thống hoàn toàn <span className="text-[#ffe3ae] font-bold">không tự lưu trữ, không tải lên, và không trực tiếp quản lý</span> bất kỳ tệp tin video hay phương tiện truyền thông nào. Do đó, Uynflix không chịu bất kỳ trách nhiệm pháp lý nào liên quan đến vấn đề bản quyền kỹ thuật số của nội dung phim được phân phối từ bên thứ ba.
              </p>
            </div>

            {/* MỤC 03 */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> 03. Quyền sở hữu trí tuệ
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Giao diện, cấu trúc kén tối giản, thiết kế, hệ thống mã hóa nhận diện avatar đôi, logo và các thành phần mã nguồn cốt lõi thuộc sở hữu độc quyền của <span className="text-white font-bold tracking-wide">Uynflix</span>. Bạn không được phép sao chép, sửa đổi hoặc sử dụng lại giao diện cho mục đích thương mại khi chưa được sự đồng ý.
              </p>
            </div>

            {/* MỤC 04 */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> 04. Trách nhiệm người dùng
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Người dùng có trách nhiệm bảo mật thông tin tài khoản cá nhân được cấp. Nghiêm cấm mọi hành vi tấn công, phá hoại cơ sở dữ liệu, hoặc sử dụng mã độc, script tự động can thiệp vào luồng API của trang web.
              </p>
            </div>

            {/* MỤC 05 */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors animate-[spin_8s_linear_infinite]" /> 05. Thay đổi dịch vụ
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Ban vận hành giữ toàn quyền điều chỉnh, nâng cấp tính năng, thay đổi cấu trúc hoặc tạm ngừng các cổng kết nối API nguồn ngoài bất cứ lúc nào mà không cần thông báo trước nhằm tối ưu hóa trải nghiệm rạp phim.
              </p>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-6 border-t border-white/5 mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#d0c5b5]/20 font-bold">
            Cảm ơn bạn đã tuân thủ quy định cùng không gian liên kết <span className="text-[#d0c5b5]/40 hover:text-[#E6C687] transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>
    </div>
  );
}