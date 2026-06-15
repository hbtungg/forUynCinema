'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        // 🛠️ ĐÃ SỬA: Xóa từ ngữ tình cảm chỉ đích danh
        setError("Email hoặc mật khẩu không đúng! ❌");
        setLoading(false);
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err) {
      // 🛠️ ĐÃ SỬA: Chuẩn hóa câu thông báo lỗi hệ thống trung lập
      setError("Có lỗi hệ thống xảy ra, vui lòng kiểm tra lại!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans relative overflow-hidden select-none touch-manipulation">
      {/* Hiệu ứng ánh sáng đỏ mờ ảo ở góc trang */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/50 p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* LOGO THƯƠNG HIỆU */}
        {/* 🛠️ ĐÃ SỬA: Thay thế hoàn toàn text cũ bằng file logo.png, khống chế chiều cao tinh tế */}
        <header className="flex flex-col items-center justify-center mb-12">
          <Link href="/home" className="block select-none">
            <img 
              src="/logo.png" 
              alt="Uynflix Logo" 
              className="h-10 w-auto object-contain select-none" 
            />
          </Link>
          <p className="text-zinc-500 text-[9px] font-black uppercase mt-4 tracking-[0.4em] opacity-60">
            Premium Membership
          </p>
        </header>

        {/* THÔNG BÁO LỖI */}
        {error && (
          <div className="bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase p-4 rounded-2xl mb-8 text-center animate-pulse tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-[0.2em]">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-zinc-800 shadow-inner select-text"
              placeholder="xxx@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-[0.2em]">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-zinc-800 shadow-inner select-text"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase py-4 rounded-2xl shadow-[0_15px_35px_rgba(220,38,38,0.4)] active:scale-[0.95] transition-all mt-6 flex items-center justify-center gap-3 tracking-widest text-xs ${loading ? 'opacity-50 cursor-wait' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Đang kết nối...
              </span>
            ) : "Vào xem phim ngay"}
          </button>
        </form>

        <footer className="mt-12 text-center border-t border-zinc-800/30 pt-8 space-y-4">
          {/* Nút Đăng ký mới */}
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Chưa có tài khoản? 
            {/* 🛠️ ĐÃ SỬA: Xóa icon trái tim ở text link đăng ký */}
            <Link 
              href="/register" 
              className="text-red-600 ml-2 hover:underline transition-all active:opacity-70"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Đăng ký ngay
            </Link>
          </p>

          <Link 
            href="/home" 
            className="text-zinc-700 text-[9px] font-black uppercase hover:text-red-600 transition-all tracking-[0.3em] inline-flex items-center gap-2 group active:opacity-70"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
          </Link>
        </footer>
      </div>
    </div>
  );
}