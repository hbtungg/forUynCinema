'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoaderCircle, Lock } from 'lucide-react';
import DirectStreamPlayer from './DirectStreamPlayer';

const frame = 'watch-frame relative w-full overflow-hidden rounded-xl border border-border-subtle bg-black';

function Playback({ stream, embed, title, onProgress, resumeSeconds }) {
  const [mode, setMode] = useState(stream ? 'hls' : 'embed');
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState('loading');
  const source = mode === 'hls' ? stream : embed;

  function fail() {
    if (mode === 'hls' && embed) {
      setMode('embed');
      setState('loading');
    } else {
      setState('error');
    }
  }

  useEffect(() => {
    if (!source || state !== 'loading') return;
    const timeout = setTimeout(() => {
      if (mode === 'hls' && embed) {
        setMode('embed');
      } else {
        setState('error');
      }
    }, 20000);
    return () => clearTimeout(timeout);
  }, [source, state, mode, embed, attempt]);

  function restart(nextMode) {
    setMode(nextMode);
    setState('loading');
    setAttempt(value => value + 1);
  }

  if (!source) {
    return <div className={frame + ' grid place-items-center text-sm text-on-surface-variant'} role="status">Không có nguồn phim.</div>;
  }

  return (
    <div className={frame}>
      {state === 'error' ? (
        <div className="absolute inset-0 grid place-content-center gap-2 p-2 text-center">
          <p role="alert" className="text-sm">Không thể phát phim từ nguồn này.</p>
          <p className="text-xs text-on-surface-variant">Kiểm tra kết nối hoặc chọn máy chủ khác trong Tập phim.</p>
          <button type="button" onClick={() => restart(stream ? 'hls' : 'embed')} className="button-primary justify-self-center px-4 text-sm">Thử lại</button>
        </div>
      ) : mode === 'hls' ? (
        <DirectStreamPlayer key={attempt} url={source} title={title} resumeSeconds={resumeSeconds} onProgress={onProgress}
          onReady={() => setState('ready')} onBuffering={() => setState('buffering')} onError={fail} />
      ) : (
        <iframe key={attempt} src={source} title={title} allowFullScreen allow="autoplay; fullscreen"
          onLoad={() => setState('ready')} onError={fail} />
      )}

      {(state === 'loading' || state === 'buffering') && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" role="status">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/85 px-4 py-2 text-xs">
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            {state === 'loading' ? 'Đang tải video…' : 'Đang đệm video…'}
          </span>
        </div>
      )}
      {mode === 'embed' && stream && state !== 'error' && (
        <button type="button" onClick={() => restart('hls')} className="absolute right-2 top-2 min-h-11 rounded-lg border border-border-subtle bg-black/85 px-3 text-xs">
          Thử nguồn HLS
        </button>
      )}
    </div>
  );
}

export default function WatchPlayer({ movie, currentEp, epName, loginHref, onProgress, resumeSeconds }) {
  const { data: session, status } = useSession();
  const stream = currentEp?.m3u8;
  const embedUrl = currentEp?.embed;
  const embed = embedUrl && embedUrl + (embedUrl.includes('?') ? '&' : '?') + 't=0&autoplay=1';
  const title = [movie.name, epName].filter(Boolean).join(' · ');

  useEffect(() => { document.title = title + ' - Uynflix'; }, [title]);

  if (status === 'loading') {
    return <div className={frame + ' grid place-items-center text-sm'} role="status">Đang kiểm tra quyền xem…</div>;
  }
  if (!session) {
    return (
      <div className={frame + ' grid place-content-center justify-items-center gap-2 p-3 text-center'}>
        <Lock size={20} aria-hidden="true" />
        <p className="text-sm text-on-surface-variant">Đăng nhập để xem phim.</p>
        <Link className="button-primary inline-flex items-center px-4 text-sm" href={loginHref}>Đăng nhập</Link>
      </div>
    );
  }

  return <Playback key={JSON.stringify([stream, embed])} stream={stream} embed={embed} title={title}
    onProgress={onProgress} resumeSeconds={resumeSeconds} />;
}
