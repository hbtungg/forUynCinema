'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

// ─── Web Audio: cinematic low drone + click thud ─────────────────────────────
function createAudioEngine() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const playAmbient = () => {
      [40, 40.3].forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        const filt = ctx.createBiquadFilter();

        osc.type      = 'sine';
        osc.frequency.value = freq;
        filt.type     = 'lowpass';
        filt.frequency.value = 300;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.5);
        gain.gain.linearRampToValueAtTime(0.028, ctx.currentTime + 6);

        osc.connect(filt);
        filt.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 8);
      });
    };

    const playEnterThud = () => {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
      }
      const src  = ctx.createBufferSource();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      src.buffer        = buf;
      filt.type         = 'lowpass';
      filt.frequency.value = 120;
      gain.gain.setValueAtTime(1.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      src.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    };

    return { playAmbient, playEnterThud, ctx };
  } catch {
    return { playAmbient: () => {}, playEnterThud: () => {}, ctx: null };
  }
}

// ─── Particle system ─────────────────────────────────────────────────────────
function useParticles(count = 28) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x:    Math.random() * 100,
      y:    Math.random() * 100,
      size: Math.random() * 1.4 + 0.3,
      dur:  Math.random() * 14 + 10,
      del:  Math.random() * -12,
      dx:   (Math.random() - 0.5) * 18,
      dy:   -(Math.random() * 25 + 10),
      op:   Math.random() * 0.35 + 0.05,
    }))
  );
  return particles;
}

// ─── Mouse parallax hook ─────────────────────────────────────────────────────
function useParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return pos;
}

// 🚀 MẸO DỌN LỖI HYDRATION TRÊN CLIENT KHÔNG DÙNG STATE CAO CẤP
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WelcomePage() {
  const router  = useRouter();
  const audioRef = useRef(null);
  const [phase, setPhase]   = useState('hidden'); 
  const parallax = useParallax();
  const particles = useParticles(28);
  
  // 🚀 ĐÃ SỬA CHÍNH XÁC: Kiểm tra môi trường client thông qua useSyncExternalStore thuần, không kích hoạt render lại
  const isClient = useIsClient();

  // Sequence: staggered reveal mà không chứa lệnh setMounted gây lặp render
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 80);
    const t2 = setTimeout(() => setPhase('idle'),   2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const startAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = createAudioEngine();
      audioRef.current.playAmbient();
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (phase === 'exit') return;
    startAudio();
    audioRef.current?.playEnterThud();
    navigator.vibrate?.([30, 20, 10]);
    setPhase('exit');
    setTimeout(() => router.push('/home'), 700);
  }, [phase, router, startAudio]);

  const px = parallax.x;
  const py = parallax.y;

  return (
    <main
      className="h-screen w-screen bg-[#070709] text-white flex flex-col overflow-hidden relative select-none"
      style={{ WebkitTapHighlightColor: 'transparent', cursor: 'default' }}
      onMouseMove={startAudio} 
    >

      {/* ── ATMOSPHERE LAYERS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        opacity: 0.6,
      }} />

      <div className="absolute inset-0 z-0 pointer-events-none grain-layer" style={{ opacity: 0.035 }} />

      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 25%, rgba(0,0,0,0.88) 100%)',
      }} />

      <div className="absolute z-0 pointer-events-none transition-transform duration-[1200ms] ease-out" style={{
        top: '-10%', left: '50%',
        width: 700, height: 520,
        transform: `translate(calc(-50% + ${px * 18}px), ${py * 10}px)`,
        background: 'radial-gradient(ellipse at top, rgba(160,0,0,0.13) 0%, transparent 68%)',
      }} />

      <div className="absolute z-0 pointer-events-none glow-breathe" style={{
        top: '50%', left: '50%',
        width: 560, height: 560,
        transform: `translate(calc(-50% + ${px * 24}px), calc(-50% + ${py * 16}px))`,
        background: 'radial-gradient(circle, rgba(140,0,0,0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        transition: 'transform 1s ease-out',
      }} />

      <div className="absolute z-0 pointer-events-none" style={{
        bottom: '-5%', right: '-5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(100,0,0,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
        transform: `translate(${px * -12}px, ${py * -8}px)`,
        transition: 'transform 1.4s ease-out',
      }} />

      {/* Layer 6: drifting particles */}
      {/* 🚀 ĐÃ SỬA TUYỆT ĐỐI: Dùng biến isClient an toàn, không chứa setState nên giao diện 
          vừa dải được hạt bụi ngẫu nhiên, vừa xóa sạch bóng lỗi Cascading Renders! */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {isClient && particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left:   `${p.x}%`,
              top:    `${p.y}%`,
              width:  p.size,
              height: p.size,
              opacity: p.op,
              animation: `particleDrift ${p.dur}s ${p.del}s ease-in-out infinite`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            }}
          />
        ))}
      </div>

      {/* ── EXIT OVERLAY ── */}
      <div className="absolute inset-0 z-[60] bg-black pointer-events-none transition-opacity duration-700 ease-in" style={{
        opacity: phase === 'exit' ? 1 : 0,
      }} />

      {/* ── TOP BAR ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-14 pt-8 md:pt-10 flex-shrink-0" style={seq(phase, 0, 'fadeDown')}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-zinc-700" />
            ))}
          </div>
          <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-600 font-bold">Est. 2026</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse inline-block" />
          Now Showing
        </div>
      </header>

      {/* ── CENTER CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0 w-full">
        <div className="flex flex-col items-center text-center w-full max-w-4xl gap-7 md:gap-10">

          <div style={seq(phase, 1, 'fadeUp')}>
            <div className="inline-flex items-center gap-3 border border-zinc-800/80 rounded-sm px-4 py-2 bg-zinc-950/70 backdrop-blur-sm">
              <div className="w-4 h-4 border border-red-700 flex items-center justify-center">
                <span className="text-[7px] font-black text-red-600">18</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-500 font-bold">Digital Cinema</span>
              <div className="w-px h-3 bg-zinc-800" />
              <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-600">4K · Dolby</span>
            </div>
          </div>

          <div className="w-full flex flex-col items-center" style={seq(phase, 2, 'fadeUpLogo')}>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[1em] text-zinc-600 font-bold mb-3 md:mb-5">
              HB<span className="text-red-600">.</span>TUNGG&nbsp;&nbsp;presents
            </p>

            <div className="relative inline-block w-full max-w-none px-4 overflow-visible">
              <div className="absolute inset-0 pointer-events-none logo-glow-pulse" style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(180,0,0,0.18) 0%, transparent 70%)',
                filter: 'blur(24px)',
                transform: `translate(${px * -8}px, ${py * -5}px)`,
                transition: 'transform 0.8s ease-out',
              }} />

              <img
                src="/logo1.png"
                alt="forUynCinema"
                className="h-32 sm:h-44 md:h-56 lg:h-60 w-auto object-contain mx-auto select-none relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 60px rgba(200,0,0,0.2)) drop-shadow(0 2px 12px rgba(0,0,0,0.9))',
                  transform: `translate(${px * 6}px, ${py * 4}px)`,
                  transition: 'transform 0.6s ease-out',
                }}
                draggable={false}
              />

              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" style={{ mixBlendMode: 'screen' }}>
                <div className={`absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent ${phase !== 'hidden' ? 'logo-shimmer' : 'opacity-0'}`} />
              </div>

              <div className="absolute -bottom-5 inset-x-0 flex items-center px-8 md:px-16 max-w-lg mx-auto">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-700/50" />
                <div className="w-1.5 h-1.5 bg-red-600 rotate-45 mx-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-700/50" />
              </div>
            </div>

            <p className="mt-8 text-[9px] md:text-[11px] italic text-zinc-600 tracking-[0.25em] md:tracking-[0.3em] font-light px-2">
              nơi mọi khoảnh khắc đều trở nên điện ảnh
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-14" style={seq(phase, 3, 'fadeIn')}>
            {[
              { label: 'Genre',  value: 'Phim Lậu' },
              { label: 'Rating', value: '★★★★★' },
              { label: 'Format', value: 'LOWKEY' },
            ].map(({ label, value }, i) => (
              <div key={i} className="text-center">
                <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-700 mb-1.5">{label}</p>
                <p className="text-[9px] md:text-[11px] font-bold text-zinc-400 tracking-wider">{value}</p>
              </div>
            ))}
          </div>

          <div style={seq(phase, 4, 'fadeUp')}>
            <button onClick={handleEnter} className="group relative overflow-hidden focus:outline-none active:scale-95 transition-transform duration-150">
              <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]" />
              <span className="relative z-10 flex items-center gap-4 border border-zinc-700 group-hover:border-red-700 px-8 md:px-10 py-3.5 transition-colors duration-300">
                <span className="w-1 h-1 rounded-full bg-red-600 group-hover:bg-white transition-colors duration-300" />
                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] font-black text-zinc-300 group-hover:text-white transition-colors duration-300">
                  Enter Cinema
                </span>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-red-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-6 md:px-14 pb-8 md:pb-10 flex-shrink-0" style={seq(phase, 5, 'fadeIn')}>
        <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto">
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>
          <p className="text-[7px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-zinc-800 font-bold px-2 text-center whitespace-nowrap">
            © 2026 HB.Tungg · All rights reserved
          </p>
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>
        </div>
      </footer>

      {/* ── STYLES ── */}
      <style jsx global>{`
        @keyframes particleDrift {
          0%   { transform: translate(0, 0) scale(1);   opacity: var(--op, 0.12); }
          40%  { transform: translate(calc(var(--dx) * 0.6), calc(var(--dy) * 0.7)) scale(1.3); opacity: calc(var(--op, 0.12) * 1.6); }
          80%  { transform: translate(var(--dx), var(--dy)) scale(0.8); opacity: calc(var(--op, 0.12) * 0.4); }
          100% { transform: translate(var(--dx), var(--dy)) scale(0.6); opacity: 0; }
        }
        .glow-breathe { animation: glowBreathe 6s ease-in-out infinite; }
        @keyframes logoGlowPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1.1; } }
        .logo-glow-pulse { animation: logoGlowPulse 4s ease-in-out infinite; }
        @keyframes logoShimmer { 0% { left: -40%; opacity: 0; } 10% { opacity: 1; } 100% { left: 140%; opacity: 0; } }
        .logo-shimmer { animation: logoShimmer 1.8s cubic-bezier(0.4, 0, 0.6, 1) 1.2s 1 forwards; top: 0; bottom: 0; position: absolute; }
        .grain-layer { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); background-size: 180px 180px; animation: grainShift 0.12s steps(1) infinite; }
        @keyframes grainShift { 0% { background-position: 0% 0%; } 20% { background-position: 30% 15%; } 40% { background-position: 60% 40%; } 60% { background-position: 10% 70%; } 80% { background-position: 80% 25%; } 100%{ background-position: 45% 85%; } }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUpLogo { from { opacity: 0; transform: translateY(32px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}

const BEATS = [0, 0.15, 0.32, 0.52, 0.70, 0.85]; 
const ANIMS = {
  fadeDown:   'fadeDown   0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
  fadeUp:     'fadeUp     0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
  fadeUpLogo: 'fadeUpLogo 0.90s cubic-bezier(0.16, 1, 0.3, 1) both',
  fadeIn:     'fadeIn     0.65s ease-out both',
};

function seq(phase, step, animName) {
  if (phase === 'hidden') return { opacity: 0 };
  return {
    animation: `${ANIMS[animName]}`,
    animationDelay: `${BEATS[step]}s`,
  };
}