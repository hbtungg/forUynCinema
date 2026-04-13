'use client';
import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RelatedMovies from '@/components/RelatedMovies';

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [movie, setMovie] = useState(initialMovie);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [hasInitialJump, setHasInitialJump] = useState(false);

  const epFromUrl = searchParams.get('ep');

  useEffect(() => {
    const handleHistoryAndSync = async () => {
      if (!movie) return;

      const servers = movie.episodes || [];
      const allEpisodes = servers[selectedServer]?.items || [];
      
      // Logic nhảy tập lần đầu tiên từ URL
      if (epFromUrl && !hasInitialJump && allEpisodes.length > 0) {
        const index = allEpisodes.findIndex(e => e.name === epFromUrl);
        if (index !== -1) {
          setSelectedEpisode(index);
          setHasInitialJump(true);
        }
      }

      const currentItem = {
        slug: slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        time: new Date().toLocaleDateString('vi-VN'),
        episode: allEpisodes[selectedEpisode]?.name || '1'
      };

      // Lưu LocalStorage
      const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const newHistory = [currentItem, ...history.filter(item => item.slug !== slug)].slice(0, 10);
      localStorage.setItem('watchHistory', JSON.stringify(newHistory));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('historyUpdated'));

      // Sync Database nếu có session
      if (session?.user?.email) {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movie: currentItem,
            userEmail: session.user.email
          })
        });
      }
    };

    handleHistoryAndSync();
  }, [movie, selectedServer, selectedEpisode, session, epFromUrl, hasInitialJump, slug]);

  if (!movie) return null;

  const servers = movie.episodes || [];
  const currentEpisodes = servers[selectedServer]?.items || [];

  const getCleanEmbedUrl = () => {
    let url = currentEpisodes[selectedEpisode]?.embed;
    if (!url) return "";
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=0&autoplay=1`;
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-10">
        <Link 
          href="/home" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Quay lại trang chủ
        </Link>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                {movie.name}
              </h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
                {movie.original_name} • {movie.category?.['3']?.list[0]?.name || "Đang cập nhật"}
              </p>
            </div>

            <div className="flex gap-4 text-zinc-600 text-[9px] font-black uppercase tracking-tighter bg-zinc-900/40 px-5 py-2.5 rounded-full border border-zinc-800/50">
              <span>Tập {currentEpisodes[selectedEpisode]?.name || '1'}</span>
              <span className="text-zinc-800">|</span>
              <span>{movie.quality}</span>
              <span className="text-zinc-800">|</span>
              <span className="text-red-800">{movie.language}</span>
            </div>
          </div>

          <div className="w-full max-w-5xl aspect-video bg-zinc-950 rounded-[2.5rem] overflow-hidden border-2 border-zinc-900 shadow-2xl mb-8 relative group">
            {currentEpisodes[selectedEpisode]?.embed ? (
              <iframe
                key={`${slug}-${selectedServer}-${selectedEpisode}`}
                src={getCleanEmbedUrl()}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-700 italic text-xs text-center px-10">
                Nguồn phim đang gặp sự cố...
              </div>
            )}
          </div>

          <div className="w-full max-w-5xl space-y-8 pb-10">
            {servers.length > 1 && (
              <div className="space-y-4">
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 flex items-center gap-2">
                  <span className="w-1 h-3 bg-red-600 rounded-full"></span> Chọn Server
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {servers.map((server, index) => (
                    <button
                      key={index}
                      onClick={() => { setSelectedServer(index); setSelectedEpisode(0); }}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selectedServer === index ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-zinc-600 rounded-full"></span> Danh sách tập phim ({currentEpisodes.length})
              </h2>
              <div className="flex flex-wrap gap-2.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {currentEpisodes.map((ep, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedEpisode(index);
                      const newUrl = `/watch/${slug}?ep=${ep.name}`;
                      window.history.pushState({ path: newUrl }, '', newUrl);
                    }}
                    className={`min-w-[50px] px-4 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${selectedEpisode === index ? 'bg-white border-white text-black scale-105 shadow-xl' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'}`}
                  >
                    {ep.name === 'Full' ? 'BẢN FULL' : `TẬP ${ep.name}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-900/50 backdrop-blur-sm">
              <h3 className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.3em]">Nội dung phim</h3>
              <div className="text-zinc-500 text-[11px] leading-relaxed opacity-90 font-medium" dangerouslySetInnerHTML={{ __html: movie.description }} />
            </div>

            <div className="w-full max-w-5xl">
              {movie && <RelatedMovies key={slug} allCategories={movie.category} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}