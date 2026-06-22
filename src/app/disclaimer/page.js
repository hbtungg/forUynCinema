import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// 🚀 ĐÃ SỬA: Đồng bộ tên trang con để khớp với cấu trúc template "%s - Uynflix" tại Root Layout
export const metadata = {
  title: 'Miễn trừ trách nhiệm', 
  description: 'Tuyên bố miễn trừ trách nhiệm pháp lý và bản quyền kỹ thuật số tại hệ thống Uynflix.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden flex flex-col justify-between select-none">
      <Header />
      
      {/* 🚀 ĐÃ SỬA: Hạ thấp padding-top xuống pt-12 (md:pt-16) để kéo nội dung sát lên Header */}
      <div className="w-full px-6 md:px-12 pt-12 md:pt-16 pb-20 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* NÚT QUAY LẠI TỐI GIẢN */}
        <div className="w-full flex justify-start mb-6">
          <Link 
            href="/home" 
            className="text-zinc-600 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all group"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Trang chủ
          </Link>
        </div>

        {/* 🚀 BỐ CỤC GRID 2 CỘT: Khắc phục triệt để lỗi trống trải và lệch trục visual */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): TIÊU ĐỀ PHÂN KHU GHIM CỐ ĐỊNH */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
            <header className="border-l-[4px] border-red-600 pl-6 text-left">
              <p className="text-red-600 font-black uppercase tracking-[0.45em] text-[9px] mb-1">
                Legal Disclaimer
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-3">
                Miễn trừ <span className="text-zinc-800">trách nhiệm</span>
              </h1>
              <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[9px]">
                Thông tin pháp lý cần lưu ý
              </p>
            </header>
            
            <p className="text-zinc-500 text-xs leading-relaxed font-medium pl-7 max-w-xs">
              Bằng việc sử dụng website, bạn xác nhận đã đọc, hiểu rõ và đồng ý tuân thủ toàn bộ các tuyên bố miễn trừ này.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): DANH SÁCH CÁC KÉN TUYÊN BỐ PHẲNG MỊN */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* KHỐI NGUỒN NỘI DUNG NÂNG CẤP THƯƠNG HIỆU UYNFLIX */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">#</span> Nguồn nội dung stream
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                <span className="text-white font-bold italic tracking-wide">Uynflix</span> là một nền tảng tích hợp công cụ giao diện hiển thị tối giản. Hệ thống hoạt động theo cơ chế nhúng luồng phát trực tuyến tự động thông qua cổng giao thức API công cộng từ đối tác cung cấp dữ liệu <span className="text-zinc-200 font-bold">phim.nguonc.com</span>. Chúng tôi hoàn toàn không trực tiếp lưu trữ, sao lưu hay tải lên bất kỳ tệp tin video hoặc phương tiện truyền thông vi phạm nào lên máy chủ riêng.
              </p>
            </div>

            {/* KHỐI VẤN ĐỀ BẢN QUYỀN */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">!!</span> Vấn đề bản quyền sở hữu
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Tất cả các nhãn hiệu, bản quyền thương mại, logo và hình ảnh độc quyền thuộc về chủ sở hữu hợp pháp của các tác phẩm điện ảnh. Uynflix chỉ cung cấp giải pháp liên kết kỹ thuật tới các luồng phát đã có sẵn công khai trên không gian mạng internet. Nếu bạn là đại diện chủ sở hữu bản quyền hợp pháp và muốn yêu cầu gỡ bỏ nội dung, vui lòng liên hệ trực tiếp với đơn vị lưu trữ nguồn (Source Provider).
              </p>
            </div>

            {/* KHỐI RỦI RO SỬ DỤNG */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">!!</span> Rủi ro sử dụng tự nguyện
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Việc truy cập dịch vụ, trải nghiệm giao diện và theo dõi nội dung từ các liên kết phát trực tuyến của bên thứ ba là sự lựa chọn và quyết định hoàn toàn tự nguyện từ phía người dùng. <span className="text-white font-bold">Uynflix</span> không chịu bất kỳ trách nhiệm pháp lý nào đối với các thiệt hại, mất mát dữ liệu hoặc các khiếu nại phát sinh gián tiếp/trực tiếp từ việc sử dụng các thông tin này.
              </p>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-8 border-t border-white/[0.03] mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-bold">
            Bảo mật và tối giản cùng hệ thống <span className="text-zinc-500 hover:text-zinc-400 transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>

      <Footer />
    </main>
  );
}