import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Miễn trừ trách nhiệm', // Trình duyệt sẽ hiện: Giới thiệu - forUyn Cinema 🍿
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <Header />
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-20 max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Trang chủ
        </Link>

        <header className="mb-12 border-l-[6px] border-red-600 pl-8">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Miễn trừ <span className="text-red-600">trách nhiệm</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Thông tin pháp lý cần lưu ý</p>
        </header>

        <section className="space-y-10 text-zinc-400 text-sm leading-relaxed">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-red-600/20">
            <h2 className="text-white font-black uppercase tracking-widest mb-4">Nguồn nội dung</h2>
            <p>
              <span className="text-white font-bold italic">forUyn Cinema</span> là một công cụ tìm kiếm và thu thập dữ liệu tự động. Chúng tôi không trực tiếp lưu trữ, lưu trữ hay tải lên bất kỳ tệp tin video hoặc phương tiện truyền thông nào lên máy chủ của mình. Tất cả nội dung được cung cấp bởi các bên thứ ba không liên kết.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">!!</span> Vấn đề bản quyền
            </h2>
            <p>
              Tất cả các nhãn hiệu, logo và hình ảnh thuộc về chủ sở hữu bản quyền hợp pháp của họ. Chúng tôi chỉ cung cấp liên kết tới các nội dung đã có sẵn công khai trên mạng internet. Nếu bạn là chủ sở hữu bản quyền và muốn yêu cầu gỡ bỏ nội dung, vui lòng liên hệ với nhà cung cấp lưu trữ nguồn (Source Provider).
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">!!</span> Rủi ro sử dụng
            </h2>
            <p>
              Việc sử dụng dịch vụ và xem nội dung từ các liên kết bên thứ ba là lựa chọn tự nguyện của người dùng. <span className="text-white font-bold">forUyn Cinema</span> không chịu trách nhiệm cho bất kỳ thiệt hại, mất mát hoặc khiếu nại nào phát sinh từ việc sử dụng các thông tin hoặc nội dung này.
            </p>
          </div>

          <div className="pt-8 border-t border-zinc-900 italic text-[11px] text-zinc-600 text-center uppercase tracking-widest">
            Bằng việc sử dụng website, bạn xác nhận đã đọc và hiểu rõ các tuyên bố miễn trừ này.
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}