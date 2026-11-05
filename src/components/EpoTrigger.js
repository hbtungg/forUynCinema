'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EpoTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  // Đóng khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    router.push('/epo-secret-room');
  };

  return (
    <div className="fixed bottom-24 left-6 z-[100] font-sans" ref={menuRef}>
      
      {/* POPUP XÁC MINH MINI - Bung từ dưới lên, sang phải giống SecretChat */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-64 bg-zinc-950 border border-zinc-800 rounded-[2rem]  overflow-hidden animate-in fade-in slide-in-from-bottom-4 origin-bottom-left">
          <div className="p-4 border-b border-zinc-900 flex items-center gap-3 bg-neutral-800/5">
            <div className="w-2 h-2 bg-neutral-800 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-300">Restricted Area</span>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-zinc-400 text-[10px] mb-6 font-bold leading-relaxed">
              Nội dung dành cho người trên 18 tuổi. Anh đã sẵn sàng chưa?
            </p>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleConfirm}
                className="w-full py-3 bg-neutral-800 text-black font-semibold uppercase text-[9px] tracking-widest rounded-xl hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-800/10"
              >
                Xác nhận 18+
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-zinc-900 text-zinc-500 font-semibold uppercase text-[9px] tracking-widest rounded-xl hover:text-white transition-all"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NÚT BẤM CHỮ P - Nằm phía trên SecretChat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-2 ${
          isOpen 
          ? 'bg-neutral-800 border-neutral-800 scale-90' 
          : 'bg-black border-neutral-800/30 hover:border-neutral-800 hover:scale-110'
        }`}
      >
        <span className={`text-xl font-semibold italic transition-colors ${isOpen ? 'text-black' : 'text-neutral-300'}`}>
          P
        </span>
      </button>
    </div>
  );
}