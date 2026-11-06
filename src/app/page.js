'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const backdrops = [
  'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
  'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
  'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
];

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (manual) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const interval = setInterval(() => {
      if (!motion.matches && document.visibilityState === 'visible') {
        setIndex(value => (value + 1) % backdrops.length);
      }
    }, 6500);
    return () => clearInterval(interval);
  }, [manual]);

  return (
    <main className="welcome-screen relative isolate flex flex-col bg-surface text-white">
      <Image src={backdrops[index]} alt="" fill sizes="100vw" fetchPriority={index === 0 ? 'high' : 'auto'}
        loading="eager" className="-z-20 object-cover object-center opacity-55" />
      <div aria-hidden="true" className="welcome-scrim absolute inset-0 -z-10" />

      <nav aria-label="Điều hướng Uynflix" className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 py-3">
        <Link href="/home" aria-label="Uynflix — Trang chủ" className="inline-flex min-h-11 items-center text-lg font-bold tracking-[.18em] sm:text-xl">
          UYNFLIX
        </Link>
        {session ? (
          <span className="max-w-[50%] truncate text-sm text-on-surface-variant">Xin chào, {session.user?.name || 'thành viên'}</span>
        ) : status !== 'loading' ? (
          <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl border border-border-subtle bg-black/50 px-4 text-sm font-semibold hover:bg-white/10">
            Đăng nhập
          </Link>
        ) : <span className="h-11 w-24" aria-hidden="true" />}
      </nav>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-center py-10 md:py-16">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-on-surface-variant">Uynflix Cinema</p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">Trải nghiệm điện ảnh cùng Uynflix</h1>
          <p className="max-w-md text-base leading-relaxed text-on-surface-variant">Khám phá phim mới cập nhật, tìm bộ phim yêu thích và tiếp tục xem theo nhịp của bạn.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/home" className="button-primary inline-flex items-center gap-2 px-4 text-sm">
              <Play size={16} aria-hidden="true" /> Bắt đầu xem ngay
            </Link>
            <Link href="/home" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border-subtle bg-black/50 px-4 text-sm font-semibold hover:bg-white/10">
              Khám phá thêm <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-3 border-t border-border-subtle py-2 text-xs text-on-surface-variant">
        <p>© 2026 Uynflix · HB.TUNGG</p>
        <div className="flex" role="group" aria-label="Chọn ảnh nền">
          {backdrops.map((src, position) => (
            <button type="button" key={src} aria-pressed={index === position} aria-label={'Ảnh nền ' + (position + 1)}
              onClick={() => { setManual(true); setIndex(position); }} className="grid size-11 place-items-center rounded-lg hover:bg-white/10">
              <span aria-hidden="true" className={index === position ? 'h-1.5 w-5 rounded-full bg-white' : 'size-1.5 rounded-full bg-white/50'} />
            </button>
          ))}
        </div>
      </footer>
    </main>
  );
}
