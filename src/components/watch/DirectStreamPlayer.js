'use client';

import { useEffect, useRef } from 'react';

export default function DirectStreamPlayer({ url, onReady, onError, onProgress, resumeSeconds = 0 }) {
  const videoRef = useRef(null);
  const callbacks = useRef({ onReady, onError, onProgress });
  useEffect(() => { callbacks.current = { onReady, onError, onProgress }; }, [onReady, onError, onProgress]);
  useEffect(() => {
    const video = videoRef.current;
    const seek = () => {
      if (Number.isFinite(resumeSeconds) && resumeSeconds > 0 && resumeSeconds < video.duration - 10) video.currentTime = resumeSeconds;
    };
    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, { once: true });
    return () => video.removeEventListener('loadedmetadata', seek);
  }, [resumeSeconds, url]);
  useEffect(() => {
    const video = videoRef.current;
    let hls;
    let cancelled = false;
    async function attach() {
      if (!url.startsWith('https://')) { callbacks.current.onError(); return; }
      if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = url;
      else {
        try {
          const { default: Hls } = await import('hls.js');
          if (cancelled) return;
          if (!Hls.isSupported()) { callbacks.current.onError(); return; }
          hls = new Hls({ maxBufferLength: 30 });
          hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) callbacks.current.onError(); });
          hls.loadSource(url);
          hls.attachMedia(video);
        } catch { if (!cancelled) callbacks.current.onError(); }
      }
    }
    attach();
    return () => { cancelled = true; hls?.destroy(); video.pause(); video.removeAttribute('src'); video.load(); };
  }, [url]);
  return <video ref={videoRef} className="w-full h-full bg-black" controls playsInline preload="metadata"
    onLoadedMetadata={() => {
      callbacks.current.onReady();
    }}
    onError={() => callbacks.current.onError()}
    onTimeUpdate={e => callbacks.current.onProgress?.({ positionSeconds: e.currentTarget.currentTime, durationSeconds: e.currentTarget.duration })}
  />;
}
