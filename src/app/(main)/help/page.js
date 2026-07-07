'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle, Sparkles, ChevronDown, Monitor, Cpu, History } from 'lucide-react';

const faqs = [
  {
    id: 'pwa',
    icon: <Monitor className="w-4 h-4 text-[#E6C687]" />,
    question: 'Làm sao để xem phim tràn viền không có thanh địa chỉ Safari?',
    answer: 'Rất đơn giản bạn ơi! Trên iPhone/iPad, bạn chỉ cần nhấn nút "Chia sẻ" (Share) trên trình duyệt Safari, cuộn xuống và chọn "Thêm vào MH chính" (Add to Home Screen). Sau đó, bạn thoát ra màn hình chính và mở app bằng Icon vừa tạo. Uynflix sẽ tự động kích hoạt chế độ Full-Screen IMAX, nuốt trọn thanh công cụ chuẩn đét điện ảnh!'
  },
  {
    id: 'lag',
    icon: <Cpu className="w-4 h-4 text-[#E6C687]" />,
    question: 'Phim bị chậm hoặc tải ảnh lâu thì xử lý thế nào?',
    answer: 'Hệ thống của Uynflix sử dụng các đường truyền băng thông cao kết hợp bộ nhớ đệm thông minh. Nếu gặp tình trạng ảnh tải chậm hoặc giật lag, bạn hãy thử kiểm tra lại kết nối Wi-Fi/4G của mình, hoặc đơn giản là F5 (Tải lại trang). Động cơ bọc thép ngầm sẽ tự động làm sạch cache và định tuyến lại luồng stream mượt mà nhất.'
  },
  {
    id: 'history',
    icon: <History className="w-4 h-4 text-[#E6C687]" />,
    question: 'Tính năng "Phim Đang Xem" và "Lịch Sử" hoạt động ra sao?',
    answer: 'Khi bạn xem bất kỳ bộ phim nào, hệ thống sẽ tự động ghi nhớ chính xác tập phim và tiến trình xem dở của bạn lên đám mây (đồng bộ qua Email tài khoản). Ở lần vào sau, các khay "Phim Đang Xem" ở trang chủ và bảng phụ Aside bên phải sẽ tự động hiển thị để bạn click vào cày tiếp chỉ trong 1 nốt nhạc.'
  }
];

export default function HelpPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState('pwa'); // Mặc định mở câu đầu tiên

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div 
      className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none pb-24 font-sans animate-in fade-in duration-500" 
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ── NÚT QUAY LẠI ── */}
      <div className="pt-6 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── TIÊU ĐỀ CHÍNH ── */}
      <section className="pt-8 md:pt-12 max-w-[800px] mx-auto px-4 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#ffe3ae]/10 px-3.5 py-1 rounded-full border border-[#ffe3ae]/20 shadow-[0_0_15px_rgba(255,227,174,0.1)]">
          <HelpCircle className="w-3.5 h-3.5 text-[#E6C687]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#ffe3ae]">Observatory Support</span>
        </div>
        <h1 
          className="text-3xl md:text-4xl font-bold text-white tracking-wide uppercase leading-tight"
          style={{ textShadow: '0 0 15px rgba(255,227,174,0.15)' }}
        >
          Trung Tâm Hỗ Trợ Uynflix
        </h1>
        <p className="text-xs md:text-sm text-[#d0c5b5]/50 font-medium max-w-[500px] mx-auto leading-relaxed">
          Nơi giải đáp mọi tọa độ thắc mắc và tối ưu hóa trải nghiệm.
        </p>
      </section>

      {/* ── DANH SÁCH FAQ KÍNH MỜ (MIDNIGHT GLASS) ── */}
      <section className="mt-12 max-w-[800px] mx-auto px-4 space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div 
              key={faq.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-[#0F1326]/60 border-[#E6C687]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]' 
                  : 'bg-[#0F1326]/30 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Thanh Tiêu Đề Câu Hỏi */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                    isOpen ? 'bg-[#E6C687]/10 border-[#E6C687]/30' : 'bg-white/5 border-white/5'
                  }`}>
                    {faq.icon}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#e8e1da] tracking-wide leading-snug">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#d0c5b5]/45 transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#E6C687]' : ''
                }`} />
              </button>

              {/* Khối Nội Dung Trả Lời Điều Hướng Mượt */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[200px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 text-xs md:text-sm text-[#d0c5b5]/70 leading-relaxed font-medium bg-black/10">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── FOOTER ── */}
      <div className="mt-16 text-center space-y-2">
        <div className="flex justify-center items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#d0c5b5]/20">
          <Sparkles className="w-3 h-3 text-[#E6C687]/30" /> System Status: Operational
        </div>
      </div>
    </div>
  );
}