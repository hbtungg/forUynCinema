import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import LoveGalleryClient from './LoveGalleryClient'; // Import file vừa tạo

export const metadata = {
  title: 'Love Gallery',
};

export default function LoveGalleryPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />
      
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-10">
        <Link 
          href="/home" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        {/* Gọi component xử lý mật khẩu */}
        <LoveGalleryClient />
      </div>
      
      <Footer />
    </main>
  );
}