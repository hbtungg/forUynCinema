import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Điều khoản', 
  description: 'Điều khoản sử dụng và tuyên bố miễn trừ trách nhiệm bản quyền tại hệ thống Uynflix.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden flex flex-col justify-between select-none">
      <Header />
      
      {/* KHU VỰC NỘI DUNG CHÍNH SÁT HEADER */}
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

        {/* BỐ CỤC GRID 2 CỘT CÂN ĐỐI */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">
          
          {/* CỘT TRÁI (2/5): TIÊU ĐỀ PHÂN KHU GHIM CỐ ĐỊNH */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
            <header className="border-l-[4px] border-red-600 pl-6 text-left">
              <p className="text-red-600 font-black uppercase tracking-[0.45em] text-[9px] mb-1">
                Legal Agreements
              </p>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-3">
                Điều khoản <span className="text-zinc-800">sử dụng</span>
              </h1>
              <p className="text-zinc-500 font-black uppercase tracking-[0.25em] text-[9px] opacity-80">
                Cập nhật lần cuối: Tháng 6, 2026
              </p>
            </header>
            
            <p className="text-zinc-500 text-xs leading-relaxed font-medium pl-7 max-w-xs">
              Các quy định pháp lý, trách nhiệm thành viên và tuyên bố miễn trừ trách nhiệm bản quyền kỹ thuật số tại hệ thống Uynflix.
            </p>
          </div>

          {/* CỘT PHẢI (3/5): DANH SÁCH CÁC KÉN ĐIỀU KHOẢN PHẲNG MỊN */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* MỤC 01 */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">01.</span> Chấp nhận điều khoản
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Bằng cách truy cập và sử dụng <span className="text-white font-bold italic tracking-wide">Uynflix</span>, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
              </p>
            </div>

            {/* 🚀 MỤC 02: TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM BẢN QUYỀN ĐÃ ĐƯỢC CHÈN THÊM ĐANH THÉP */}
            <div className="bg-white/[0.01] border border-red-600/10 hover:border-red-600/20 p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-red-500 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">02.</span> Tuyên bố miễn trừ bản quyền
              </h2>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-semibold">
                <span className="text-white font-black italic tracking-wide">Uynflix</span> là một nền tảng cung cấp giải pháp công nghệ giao diện tối giản. Chúng tôi hoạt động hoàn toàn dựa trên việc kết nối và sử dụng giao thức API truyền phát trực tuyến (Streaming) nguồn ngoài công cộng từ đối tác cung cấp dữ liệu độc lập <span className="text-white font-bold underline decoration-zinc-700 underline-offset-4">phim.nguonc.com</span>.
              </p>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium pt-1">
                Hệ thống hoàn toàn <span className="text-zinc-200 font-bold">không tự lưu trữ, không tải lên, và không trực tiếp quản lý</span> bất kỳ tệp tin video hay phương tiện truyền thông nào. Do đó, Uynflix không chịu bất kỳ trách nhiệm pháp lý nào liên quan đến vấn đề bản quyền kỹ thuật số của nội dung phim được phân phối từ bên thứ ba.
              </p>
            </div>

            {/* MỤC 03 */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">03.</span> Quyền sở hữu trí tuệ
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Giao diện, cấu trúc kén tối giản, thiết kế, hệ thống mã hóa nhận diện avatar đôi, logo và các thành phần mã nguồn cốt lõi thuộc sở hữu độc quyền của <span className="text-white font-bold tracking-wide">Uynflix</span>. Bạn không được phép sao chép, sửa đổi hoặc sử dụng lại giao diện cho mục đích thương mại khi chưa được sự đồng ý.
              </p>
            </div>

            {/* MỤC 04 */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">04.</span> Trách nhiệm người dùng
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Người dùng có trách nhiệm bảo mật thông tin tài khoản cá nhân được cấp. Nghiêm cấm mọi hành vi tấn công, phá hoại cơ sở dữ liệu, hoặc sử dụng mã độc, script tự động can thiệp vào luồng API của trang web.
              </p>
            </div>

            {/* MỤC 05 */}
            <div className="bg-white/[0.005] border border-white/[0.02] hover:border-white/[0.04] p-6 rounded-xl transition-all space-y-2">
              <h2 className="text-zinc-200 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="text-red-600 font-sans">05.</span> Thay đổi dịch vụ
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
                Ban vận hành giữ toàn quyền điều chỉnh, nâng cấp tính năng, thay đổi cấu trúc hoặc tạm ngừng các cổng kết nối API nguồn ngoài bất cứ lúc nào mà không cần thông báo trước nhằm tối ưu hóa trải nghiệm rạp phim.
              </p>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-8 border-t border-white/[0.03] mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 font-bold">
            Cảm ơn bạn đã tuân thủ quy định cùng <span className="text-zinc-500 hover:text-zinc-400 transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>

      <Footer />
    </main>
  );
}