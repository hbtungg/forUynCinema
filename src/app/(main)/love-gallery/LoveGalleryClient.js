'use client';
import { useState } from 'react';
import LoveGallery from '@/components/LoveGallery';

export default function LoveGalleryClient() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // Anh đổi mật khẩu ở đây nhé
  const SECRET_PASSWORD = 'uyn'; 

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-[0.5em]">Private Access</h2>
          <p className="text-white font-semibold italic text-xl uppercase tracking-tighter">UNLOCK FOR LOVE ❤️</p>
        </div>

        <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4 w-full max-w-xs">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••"
            className={`w-full bg-zinc-950 border-2 ${error ? 'border-neutral-600 animate-shake' : 'border-zinc-900'} rounded-2xl px-6 py-4 text-center text-white focus:outline-none focus:border-neutral-600 transition-all font-semibold tracking-[0.3em]`}
            autoFocus
          />
          {error && <p className="text-neutral-300 text-[9px] font-semibold uppercase tracking-widest animate-pulse">Mật mã không đúng rồi anh ơi!</p>}
          
          <button
            type="submit"
            className="mt-2 px-8 py-3 bg-neutral-700 hover:bg-neutral-700 text-white rounded-xl text-[10px] font-semibold uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-neutral-600/20"
          >
            Mở khóa
          </button>
        </form>
      </div>
    );
  }

  // Khi đã nhập đúng pass
  return <LoveGallery />;
}