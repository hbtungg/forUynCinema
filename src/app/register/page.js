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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/50 p-10 rounded-[2.5rem] shadow-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter">
            <span className="text-white">for</span><span className="text-red-600">Uyn</span><span className="text-white ml-2 text-2xl">Register</span>
          </h1>
        </header>

        {error && <div className="bg-red-600/10 text-red-500 p-4 rounded-xl mb-6 text-center text-[10px] font-black uppercase">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" placeholder="Tên của anh/em" required
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-red-600 outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-red-600 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Mật khẩu bí mật" required
            className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-red-600 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
            {loading ? "Đang tạo tài khoản..." : "Đăng ký thành viên ❤️"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-zinc-500 text-[10px] font-black uppercase">
          Đã có tài khoản? <Link href="/login" className="text-red-600 ml-2">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}