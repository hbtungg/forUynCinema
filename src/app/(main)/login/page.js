'use client';
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Login - Uynflix";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, 
      });

      if (result.error) {
        setError("Incorrect password or email address! ❌");
        setLoading(false);
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      setError("Có lỗi hệ thống xảy ra, vui lòng kiểm tra lại!");
      setLoading(false);
    }
  };

  return (
    /* 🚀 ĐÃ SỬA: Sử dụng bg-transparent để lộ mây tinh vân Shader chạy ngầm lộng lẫy dưới gầm trang */
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 font-sans relative overflow-hidden select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* Hào quang Moonlight Gold mờ sương vuốt nhẹ góc trên tinh hệ */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E6C687]/5 rounded-full blur-[130px] pointer-events-none"></div>
      
      {/* HỘP KÉN TRUNG TÂM KÍNH MỜ PHA LÊ XANH ĐÊM THẲM */}
      <div className="w-full max-w-md bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* LOGO THƯƠNG HIỆU PHÁT SÁNG CHUẨN MIDNIGHT TEXT GLOW */}
        <header className="flex flex-col items-center justify-center mb-10">
          <Link href="/home" className="block select-none transition-transform duration-300 hover:scale-105">
            <span 
              className="text-3xl font-bold tracking-[0.2em] text-[#E6C687] font-sans"
              style={{ textShadow: '0 0 15px rgba(230, 198, 135, 0.45)' }}
            >
              UYNFLIX
            </span>
          </Link>
          <p className="text-[#d0c5b5]/30 text-[9px] font-bold uppercase mt-3 tracking-[0.45em]">
            Premium Membership
          </p>
        </header>

        {/* THÔNG BÁO LỖI KÍNH MỜ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-[10px] font-bold uppercase p-4 rounded-xl mb-6 text-center tracking-wider backdrop-blur-md">
            {error}
          </div>
        )}

        {/* FORM ĐĂNG NHẬP BIẾN ĐỔI GIAO DIỆN */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-[#d0c5b5]/30 uppercase ml-1 tracking-[0.25em]">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F1326]/60 border border-white/5 rounded-xl px-5 py-3.5 text-xs text-[#e8e1da] focus:outline-none focus:border-[#E6C687]/40 transition-all placeholder:text-[#d0c5b5]/10 shadow-inner select-text font-medium"
              placeholder="Input your mail..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-[#d0c5b5]/30 uppercase ml-1 tracking-[0.25em]">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F1326]/60 border border-white/5 rounded-xl px-5 py-3.5 text-xs text-[#e8e1da] focus:outline-none focus:border-[#E6C687]/40 transition-all placeholder:text-[#d0c5b5]/10 shadow-inner select-text font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {/* NÚT SUBMIT CHUẨN VÀNG MOONLIGHT KHỞI CHẠY */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold uppercase py-3.5 rounded-xl active:scale-[0.97] transition-all duration-300 mt-6 flex items-center justify-center gap-2.5 tracking-widest text-[10px] cursor-pointer focus:outline-none shadow-md ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
                Connecting...
              </span>
            ) : "Watch the movie now"}
          </button>
        </form>

        {/* PHẦN DƯỚI CHÂN FORM */}
        <footer className="mt-10 text-center border-t border-white/5 pt-6 space-y-4">
          <p className="text-[#d0c5b5]/30 text-[10px] font-bold uppercase tracking-[0.2em]">
            Don't have an account? 
            <Link 
              href="/register" 
              className="text-[#E6C687] ml-1.5 hover:text-[#ffe3ae] hover:underline transition-all"
            >
              Sign up now
            </Link>
          </p>

          <Link 
            href="/home" 
            className="text-[#d0c5b5]/20 text-[9px] font-bold uppercase hover:text-[#ffe3ae] transition-colors tracking-[0.25em] inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            Return to the homepage
          </Link>
        </footer>
      </div>
    </div>
  );
}