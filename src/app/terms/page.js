import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <Header />
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-20 max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Trang chủ
        </Link>

        <header className="mb-12 border-l-[6px] border-red-600 pl-8">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Điều khoản <span className="text-red-600">sử dụng</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Cập nhật lần cuối: Tháng 4, 2026</p>
        </header>

        <section className="space-y-10 text-zinc-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">01.</span> Chấp nhận điều khoản
            </h2>
            <p>
              Bằng cách truy cập và sử dụng <span className="text-white font-bold italic">forUyn Cinema</span>, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">02.</span> Quyền sở hữu trí tuệ
            </h2>
            <p>
              Giao diện, thiết kế, logo và các thành phần mã nguồn thuộc sở hữu độc quyền của <span className="text-white font-bold">forUyn Cinema</span>. Bạn không được phép sao chép, sửa đổi hoặc sử dụng lại bất kỳ phần nào của giao diện cho mục đích thương mại mà không có sự đồng ý của chúng tôi.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">03.</span> Trách nhiệm người dùng
            </h2>
            <p>
              Người dùng có trách nhiệm bảo mật thông tin tài khoản cá nhân. Nghiêm cấm mọi hành vi tấn công, phá hoại hoặc sử dụng các công cụ tự động để can thiệp vào hệ thống của trang web.
            </p>
          </div>

          <div>
            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-red-600">04.</span> Thay đổi dịch vụ
            </h2>
            <p>
              Chúng tôi có quyền thay đổi, tạm ngừng hoặc chấm dứt bất kỳ tính năng nào của trang web mà không cần thông báo trước để nâng cấp trải nghiệm người dùng.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}