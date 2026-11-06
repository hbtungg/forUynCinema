'use client';
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authHref, getAuthReturnPath } from "@/lib/authNavigation";

function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = getAuthReturnPath(params.get("next"));

  // 🚀 ĐÃ THÊM: Đồng bộ đổi tên tab tự động ngay khi nạp trang đăng ký
  useEffect(() => {
    document.title = "Đăng ký - Uynflix";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(res.status < 500 && data?.error ? data.error : "Chưa thể tạo tài khoản. Anh thử lại nhé.");
        return;
      }
      const login = authHref("/login", next);
      router.replace(login + (login.includes("?") ? "&" : "?") + "registered=1");
    } catch {
      setError("Không kết nối được. Kiểm tra mạng rồi thử lại nhé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🚀 ĐÃ SỬA: Sử dụng bg-transparent để lộ Shader chạy ngầm lộng lẫy dưới gầm trang */
    <div className="min-h-[65svh] bg-transparent flex items-center justify-center py-6 font-sans relative overflow-hidden select-none" style={{ fontFamily: "var(--font-main)" }}>
      
      {/* Hào quang Moonlight Gold mờ sương vuốt nhẹ góc trên */}
      

      {/* HỘP KÉN TRUNG TÂM KÍNH MỜ PHA LÊ XANH ĐÊM THẲM */}
      <div className="w-full max-w-md glass-surface border border-white/5 p-5 sm:p-8 md:p-10 rounded-[32px]  relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* LOGO THƯƠNG HIỆU PHÁT SÁNG CHUẨN MIDNIGHT TEXT GLOW */}
        <header className="flex flex-col items-center justify-center mb-10">
          <Link href="/home" className="block select-none transition-transform duration-300 hover:scale-105">
            <span 
              className="text-3xl font-bold tracking-[0.2em] text-[#e8e8e8] font-sans"
              style={{ textShadow: 'none' }}
            >
              UYNFLIX
            </span>
          </Link>
          <p className="text-[#808080] text-[9px] font-bold uppercase mt-3 tracking-[0.45em]">
            Đăng ký
          </p>
        </header>

        {/* THÔNG BÁO LỖI KÍNH MỜ */}
        {error && (
          <div role="alert" className="bg-neutral-700/10 border border-neutral-600/20 text-neutral-300 text-[10px] font-bold uppercase p-4 rounded-xl mb-6 text-center tracking-wider backdrop-blur-md">
            {error}
          </div>
        )}

        {/* FORM ĐĂNG KÝ BIẾN ĐỔI GIAO DIỆN CHUẨN PHA LÊ */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="register-text" className="block text-sm font-medium text-white/85">Họ và tên</label>
            <input id="register-text" type="text" autoComplete="name"
              required
              placeholder="Tên của bạn"
              className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-5 py-3.5 text-base text-[#ffffff] focus:outline-none focus:border-[#e8e8e8]/40 transition-all placeholder:text-[#808080] shadow-inner select-text font-medium"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-email" className="block text-sm font-medium text-white/85">Email</label>
            <input id="register-email" type="email" autoComplete="email"
              required
              placeholder="xxx@gmail.com"
              className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-5 py-3.5 text-base text-[#ffffff] focus:outline-none focus:border-[#e8e8e8]/40 transition-all placeholder:text-[#808080] shadow-inner select-text font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-password" className="block text-sm font-medium text-white/85">Mật khẩu</label>
            <input id="register-password" type="password" autoComplete="new-password"
              required
              placeholder="••••••••"
              className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-5 py-3.5 text-base text-[#ffffff] focus:outline-none focus:border-[#e8e8e8]/40 transition-all placeholder:text-[#808080] shadow-inner select-text font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* NÚT SUBMIT CHUẨN VÀNG MOONLIGHT KHỞI CHẠY */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] font-bold uppercase py-3.5 rounded-xl active:scale-[0.97] transition-all duration-300 mt-6 flex items-center justify-center gap-2.5 tracking-widest text-[10px] cursor-pointer focus:outline-none shadow-md ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
                Đang tạo tài khoản…
              </span>
            ) : "Tạo tài khoản"}
          </button>
        </form>
        
        {/* PHẦN DƯỚI CHÂN FORM */}
        <footer className="mt-10 text-center border-t border-white/5 pt-6 space-y-4">
          <p className="text-[#808080] text-[10px] font-bold uppercase tracking-[0.2em]">
            Đã có tài khoản?
            <Link 
              href={authHref("/login", next)}
              className="text-[#e8e8e8] ml-1.5 hover:text-[#ffffff] hover:underline transition-all"
            >
              Đăng nhập
            </Link>
          </p>

          <Link 
            href="/home" 
            className="text-[#808080] text-[9px] font-bold uppercase hover:text-[#ffffff] transition-colors tracking-[0.25em] inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            Về trang chủ
          </Link>
        </footer>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return <Suspense fallback={<p role="status" className="p-6 text-sm">Đang tải…</p>}><RegisterForm /></Suspense>;
}
