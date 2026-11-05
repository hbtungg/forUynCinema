'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, ShieldAlert, Terminal, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = "Tần số liên lạc - Uynflix";
  }, []);

  const handleSignalSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // Giả lập luồng gửi tín hiệu vô tuyến vào không gian vô tận
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 4000);
    }, 2000);
  };

  return (
    /* Khớp luồng với bg-transparent lộ lớp Shader chạy ngầm bên dưới gầm trang */
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] select-none font-sans" style={{ fontFamily: "var(--font-main)" }}>

      <div className="w-full px-4 md:px-12 py-6 max-w-6xl mx-auto flex flex-col items-center">

        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <div className="w-full flex justify-start mb-6">
          <Link
            href="/home"
            className="text-[#808080] hover:text-[#ffffff] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </Link>
        </div>

        {/* BỐ CỤC GRID 2 CỘT CÂN ĐỐI CHỐNG TRỐNG TRẢI */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-4">

          {/* CỘT TRÁI (2/5): THÔNG TIN ĐỊA CHỈ "VÔ HÌNH" GHIM CỐ ĐỊNH */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
            <header className="border-l-4 border-[#e8e8e8] pl-5 text-left space-y-1">
              <p className="text-[#e8e8e8] font-bold uppercase tracking-[0.45em] text-[9px]">
                Quantum Encryption
              </p>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
                Liên hệ: <span className="text-[#ffffff]" style={{ textShadow: 'none' }}>Tần số ẩn</span>
              </h1>
              <p className="text-[#808080] font-bold uppercase tracking-[0.25em] text-[9px] pt-1">
                Tọa độ không thể định vị
              </p>
            </header>

            <p className="text-[#808080] text-xs leading-relaxed font-medium pl-6 max-w-xs text-justify">
              Hệ thống mã hóa tối cao đã ẩn giấu toàn bộ danh tính vật lý. Không có email phản hồi trực tiếp, không có số điện thoại đường dây nóng, và không có vị trí trên bản đồ địa cầu.
            </p>

            {/* THÔNG TIN TOẠ ĐỘ PHÁP LÝ GIẢ LẬP ĐIỆN ẢNH KHÔNG THỂ KHAI THÁC */}
            <div className="pl-6 pt-2 space-y-3 text-[11px] font-medium text-[#b8b8b8] tracking-wide font-mono">
              <div className="flex items-start gap-2">
                <span className="text-[#e8e8e8]">Node:</span>
                <span>Cluster-VN.Edge-01 // Region: Southern</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#e8e8e8]">Protocol:</span>
                <span>WSS://Secure-Tunneling-v3.tls</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#e8e8e8]">Latency:</span>
                <span>12ms (Synchronized with Central DB)</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (3/5): KHỐI GỬI TÍN HIỆU VÔ TUYẾN PHA LÊ KÍNH MỜ */}
          <div className="lg:col-span-3 space-y-4">

            <div className="glass-surface border border-white/5 p-6 rounded-[24px] shadow-2xl space-y-4 transition-all duration-300">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#e8e8e8]" /> Gửi tín hiệu vào không gian
              </h2>
              <p className="text-[#b8b8b8] text-xs md:text-sm leading-relaxed font-medium text-justify">
                Nếu bạn có thông điệp khẩn cấp muốn truyền đạt, hãy nhập vào khung nhập liệu kỹ thuật số bên dưới. Tín hiệu sẽ được chuyển đổi thành các hạt hạt photon nén và bắn trực tiếp vào khoảng trống vũ trụ bao la.
              </p>

              {/* KHUNG POPUP TOAST THÔNG BÁO TÍN HIỆU THÀNH CÔNG */}
              {success && (
                <div className="bg-[#e8e8e8]/10 border border-[#e8e8e8]/30 text-[#ffffff] text-[10px] font-bold uppercase p-3 rounded-xl text-center tracking-wider backdrop-blur-md animate-in fade-in duration-300">
                  ✨ Tín hiệu đã được phân rã và phát tán vào hố đen thành công!
                </div>
              )}

              {/* FORM NHẬP TÍN HIỆU ĐỘC LẬP */}
              <form onSubmit={handleSignalSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-[#808080] uppercase ml-1 tracking-[0.25em]">
                    Nội dung thông điệp bí mật
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Gõ tâm tư hoặc mật mã của bạn tại đây..."
                    className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#e8e8e8]/40 transition-all placeholder:text-[#808080] shadow-inner font-medium resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
                      <span>Đang phóng luồng hạt...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Phát sóng tín hiệu</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* KHỐI BẢO MẬT PHÁP LÝ HỆ THỐNG */}
            <div className="glass-surface border border-white/5 p-5 rounded-[22px] space-y-2 group transition-all duration-300 hover:border-neutral-800/20">
              <h3 className="text-white font-bold uppercase text-[10px] tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#e8e8e8]/60" /> Tuyên bố an ninh mạng thiên văn
              </h3>
              <p className="text-[#808080] text-[11px] font-medium leading-relaxed text-justify">
                Trang liên hệ này được trang bị giao thức chống dò tìm định vị ngược (Anti-Tracer Protocol). Mọi hành vi cố tình quét địa chỉ IP máy chủ hoặc giải mã gói tin truyền tải sẽ tự động kích hoạt lệnh tự hủy luồng kết nối tạm thời.
              </p>
            </div>

          </div>
        </div>

        {/* LỜI KẾT THƯƠNG HIỆU */}
        <footer className="w-full text-center pt-6 border-t border-white/5 mt-16">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#808080] font-bold">
            fck <span className="text-[#808080] hover:text-[#e8e8e8] transition-colors">Uynflix</span>.
          </p>
        </footer>

      </div>
    </div>
  );
}