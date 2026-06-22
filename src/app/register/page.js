'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login"); // Đăng ký xong đẩy qua Login
    } else {
      setError(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans relative overflow-hidden select-none touch-manipulation">
      {/* Hiệu ứng ánh sáng đỏ mờ ảo ở góc trang */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/50 p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* LOGO THƯƠNG HIỆU */}
        {/* 🛠️ ĐÃ SỬA: Thay thế h1 text cũ thành logo.png đồng bộ với hệ thống */}
        <header className="flex flex-col items-center justify-center mb-12">
          <Link href="/home" className="block select-none">
            <img 
              src="/logo.png" 
              alt="Uynflix Logo" 
              className="h-10 w-auto object-contain select-none" 
            />
          </Link>
          <p className="text-zinc-500 text-[9px] font-black uppercase mt-4 tracking-[0.4em] opacity-60">
            Create Account
          </p>
        </header>

        {/* THÔNG BÁO LỖI */}
        {error && (
          <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-4 rounded-2xl mb-8 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-[0.2em]">
              Your name
            </label>
            <input 
              type="text" 
              required
              placeholder="Tên của bạn"
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-zinc-800 shadow-inner select-text"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-[0.2em]">
              Email
            </label>
            <input 
              type="email" 
              required
              placeholder="xxx@gmail.com"
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-zinc-800 shadow-inner select-text"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-[0.2em]">
              Password
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-zinc-800 shadow-inner select-text"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* 🛠️ ĐÃ SỬA: Xóa icon "❤️" ở nút bấm đăng ký */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase py-4 rounded-2xl shadow-[0_15px_35px_rgba(220,38,38,0.4)] active:scale-[0.95] transition-all mt-6 flex items-center justify-center gap-3 tracking-widest text-xs ${loading ? 'opacity-50 cursor-wait' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Đang tạo tài khoản...
              </span>
            ) : "Đăng ký ngay"}
          </button>
        </form>
        
        <footer className="mt-12 text-center border-t border-zinc-800/30 pt-8">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Đã có tài khoản? 
            <Link 
              href="/login" 
              className="text-red-600 ml-2 hover:underline transition-all active:opacity-70"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Đăng nhập ngay
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}