'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);

  const SECRET_CODE = "ghequa";

  const openEpoAccess = () => {
    setShowPopup(true);
    setError(false);
    setInputCode('');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (inputCode.toLowerCase() === SECRET_CODE) {
      router.push('/epo');
    } else {
      setError(true);
      setInputCode('');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-x-hidden relative select-none">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#FB6F92]/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>

      {/* 1. BRANDING */}
      <div className="relative z-10 text-center mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          HB<span className="text-red-600">.</span>TUNGG
        </h1>
        <p className="text-[7px] md:text-[10px] text-zinc-500 uppercase tracking-[0.6em] md:tracking-[0.8em] mt-3 md:mt-4 font-black">
          Digital Entertainment Universe
        </p>
      </div>

      {/* 2. OPTIONS CONTAINER */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-6 md:px-10">
        
        {/* Option 01: forUyn Cinema - Đã thêm touch-none và tap-transparent */}
        <Link 
          href="/home" 
          className="group relative bg-zinc-900/30 border border-zinc-800 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-center hover:border-red-600/50 transition-all duration-300 transform-gpu active:scale-95 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] md:rounded-[2.5rem]"></div>
          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-3 md:mb-4 text-white/90">
            FOR<span className="text-red-600">UYN</span> CINEMA
          </h3>
          <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
            Hệ thống phim cá nhân <br className="hidden md:block"/> Created For Uyn ❤️
          </p>
          <div className="mt-6 md:mt-8 text-red-600 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
            Truy cập ngay <span>→</span>
          </div>
        </Link>

        {/* Option 02: SECRET SYSTEM - Đã thêm touch-none và tap-transparent */}
        <button 
          onClick={openEpoAccess}
          className="group relative bg-zinc-900/30 border border-zinc-800 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-center hover:border-[#FB6F92]/50 transition-all duration-300 transform-gpu active:scale-95 touch-manipulation focus:outline-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FB6F92]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] md:rounded-[2.5rem]"></div>
          
          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-3 md:mb-4 text-white/90 italic transition-all">
            SECRET <span className="text-[#FB6F92]">SYSTEM</span>
          </h3>
          <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
            Hệ thống phim mở rộng <br className="hidden md:block"/> Không dành cho số đông
          </p>
          <div className="mt-6 md:mt-8 text-[#FB6F92] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
            Xác minh quyền <span>→</span>
          </div>
        </button>
      </div>

      {/* 3. POPUP XÁC MINH */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] max-w-sm w-full text-center relative shadow-2xl">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-6 right-6 md:right-8 text-zinc-600 hover:text-[#FB6F92] transition-colors font-black uppercase text-[9px] md:text-[10px] tracking-widest"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              [x]
            </button>

            <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tight mb-2 text-white">Access Required</h2>
            <p className="text-zinc-500 text-[8px] md:text-[10px] uppercase tracking-widest mb-8 md:mb-10 leading-relaxed px-4">
              Vui lòng nhập mã bảo mật <br/> để truy cập Secret System
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input 
                type="password"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="..."
                className={`w-full bg-black border ${error ? 'border-red-600' : 'border-zinc-800'} rounded-2xl px-4 py-4 md:px-6 text-center text-white focus:outline-none focus:border-[#FB6F92] transition-all font-black tracking-[0.2em] uppercase text-sm`}
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest animate-pulse mt-2">
                  Mật mã không chính xác!
                </p>
              )}
              
              <button 
                type="submit"
                className="w-full bg-[#FB6F92] hover:bg-[#ff85a2] text-black py-4 rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-[#FB6F92]/20 active:brightness-90"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. FOOTER MINI */}
      <footer className="absolute bottom-8 md:bottom-10 left-0 w-full text-center text-[7px] md:text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] px-4">
        &copy; {new Date().getFullYear()} hb.tungg • Created for <span className="text-red-600/60 uppercase">ThuUyn</span>
      </footer>
    </main>
  );
}