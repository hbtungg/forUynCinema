'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Copyright, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
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
            Trang chủ
          </Link>
        </div>

        {/* BỐ CỤC GRID 2 CỘT TÂN TIẾN KHÔNG LO KHOẢNG TRỐNG */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): TIÊU ĐỀ PHÂN KHU GHIM CỐ ĐỊNH ÁNH VÀNG */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
            <header className="border-l-4 border-[#E6C687] pl-5 text-left space-y-1">
              <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">
                Legal Disclaimer
              </p>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
                Miễn trừ: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Trách nhiệm</span>
              </h1>
              <p className="text-[#d0c5b5]/30 font-bold uppercase tracking-[0.25em] text-[9px] pt-1">
                Thông tin pháp lý cần lưu ý
              </p>
            </header>
            
            <p className="text-[#d0c5b5]/40 text-xs leading-relaxed font-medium pl-6 max-w-xs text-justify">
              Bằng việc sử dụng website, bạn xác nhận đã đọc, hiểu rõ và đồng ý tuân thủ toàn bộ các tuyên bố miễn trừ trách nhiệm này từ tinh hệ hệ thống.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): DANH SÁCH CÁC KÉN TUYÊN BỐ PHA LÊ KÍNH MỜ */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* KHỐI NGUỒN NỘI DUNG STREAM */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> Nguồn nội dung stream
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                <span className="text-white font-bold italic tracking-wide">Uynflix</span> là một nền tảng tích hợp công cụ giao diện hiển thị tối giản. Hệ thống hoạt động theo cơ chế nhúng luồng phát trực tuyến tự động thông qua cổng giao thức API công cộng từ đối tác cung cấp dữ liệu <span className="text-[#ffe3ae] font-semibold">phim.nguonc.com</span>. Chúng tôi hoàn toàn không trực tiếp lưu trữ, sao lưu hay tải lên bất kỳ tệp tin video hoặc phương tiện truyền thông vi phạm nào lên máy chủ riêng.
              </p>
            </div>

            {/* KHỐI VẤN ĐỀ BẢN QUYỀN */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <Copyright className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> Vấn đề bản quyền sở hữu
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Tất cả các nhãn hiệu, bản quyền thương mại, logo và hình ảnh độc quyền thuộc về chủ sở hữu hợp pháp của các tác phẩm điện ảnh. Uynflix chỉ cung cấp giải pháp liên kết kỹ thuật tới các luồng phát đã có sẵn công khai trên không gian mạng internet. Nếu bạn là đại diện chủ sở hữu bản quyền hợp pháp và muốn yêu cầu gỡ bỏ nội dung, vui lòng liên hệ trực tiếp với đơn vị lưu trữ nguồn (Source Provider).
              </p>
            </div>

            {/* KHỐI RỦI RO SỬ DỤNG */}
            <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[22px] shadow-2xl space-y-2 transition-all duration-300 hover:border-[#E6C687]/20 group">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E6C687]/60 group-hover:text-[#E6C687] transition-colors" /> Rủi ro sử dụng tự nguyện
              </h2>
              <p className="text-[#d0c5b5]/60 text-xs md:text-sm leading-relaxed font-medium text-justify">
                Việc truy cập dịch vụ, trải nghiệm giao diện và theo dõi nội dung từ các liên kết phát trực tuyến của bên thứ ba là sự lựa chọn và quyết định hoàn toàn tự nguyện từ phía người dùng. <span className="text-white font-bold">Uynflix</span> không chịu bất kỳ trách nhiệm pháp lý nào đối với các thiệt hại, mất mát dữ liệu hoặc các khiếu nại phát sinh gián tiếp/trực tiếp từ việc sử dụng các thông tin này.
              </p>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-6 border-t border-white/5 mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#d0c5b5]/20 font-bold">
            Bảo mật và tối giản cùng hệ thống liên kết <span className="text-[#d0c5b5]/40 hover:text-[#E6C687] transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>
    </div>
  );
}