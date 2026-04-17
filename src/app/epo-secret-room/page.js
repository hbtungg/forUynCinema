import Link from 'next/link';

export default function EpoSecretRoom() {
  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full">
        <Link href="/" className="group flex items-center gap-3 text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12 transition-all">
          <span className="group-hover:-translate-x-2 transition-transform">←</span> Thoát khỏi vùng hạn chế
        </Link>

        <div className="relative w-full aspect-video bg-black rounded-[3rem] overflow-hidden border-2 border-yellow-500/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
          <iframe 
            src="https://www.pornhub.com/view_video.php?viewkey=ph629cb2a8a9863" 
            frameBorder="0" 
            width="100%" 
            height="100%" 
            scrolling="no" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-yellow-900 font-black text-[10px] uppercase tracking-[0.6em] italic animate-pulse">
            Bảo mật cơ sở dữ liệu
          </p>
          <p className="text-zinc-800 font-bold text-[8px] uppercase tracking-[0.4em]">
            Access Granted • No Trace Mode
          </p>
        </div>
      </div>
    </main>
  );
}