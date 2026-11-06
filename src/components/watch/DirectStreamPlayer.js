'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

export default function DirectStreamPlayer({ url, title, onReady, onError, onProgress, onBuffering, resumeSeconds = 0 }) {
  const videoRef = useRef(null);
  const resumed = useRef(false);
  const reportError = useEffectEvent(onError);

  function resume(video) {
    if (resumed.current || !Number.isFinite(resumeSeconds) || resumeSeconds <= 0 || video.readyState < 1) return;
    resumed.current = true;
    if (video.currentTime < 2 && resumeSeconds < video.duration - 10) video.currentTime = resumeSeconds;
  }

  const applyResume = useEffectEvent(() => resume(videoRef.current));
  useEffect(() => { applyResume(); }, [resumeSeconds]);

  useEffect(() => {
    const video = videoRef.current;
    let hls;
    let cancelled = false;

    async function attach() {
      try {
        if (new URL(url).protocol !== 'https:') throw new Error('Invalid video URL');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          return;
        }
        const { default: Hls } = await import('hls.js');
        if (cancelled) return;
        if (!Hls.isSupported()) throw new Error('HLS unavailable');
        hls = new Hls({ maxBufferLength: 30 });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!cancelled && data.fatal) reportError();
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } catch {
        if (!cancelled) reportError();
      }
    }

    attach();
    return () => {
      cancelled = true;
      hls?.destroy();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [url]);

  return (
    <video ref={videoRef} aria-label={title} className="bg-black" controls playsInline preload="metadata"
      onLoadedMetadata={event => { resume(event.currentTarget); onReady(); }}
      onPlaying={onReady}
      onCanPlay={onReady}
      onPause={onReady}
      onWaiting={event => { if (!event.currentTarget.paused) onBuffering(); }}
      onError={onError}
      onTimeUpdate={event => onProgress?.({
        positionSeconds: event.currentTarget.currentTime,
        durationSeconds: event.currentTarget.duration,
      })} />
  );
}
