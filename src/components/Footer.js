'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Điều khoản',  href: '/terms' },
  { label: 'Miễn trừ',   href: '/disclaimer' },
  { label: 'Liên hệ',    href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0a0a0c]">

      {/* Single subtle glow — không cần nhiều layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[50%] -translate-x-1/2 bg-red-700/8 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:py-12">

        {/* ── MAIN ROW ── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* LEFT — Logo */}
          <Link href="/home" className="group shrink-0 self-start md:self-auto">
            <img
              src="/logo.png"
              alt="forUynCinema"
              className="h-12 w-auto object-contain select-none transition-all duration-300
                         group-hover:brightness-110 group-hover:scale-[1.03]
                         drop-shadow-[0_0_14px_rgba(220,38,38,0.18)]"
            />
          </Link>

          {/* CENTER — Nav */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group relative text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500
                           transition-colors duration-200 hover:text-red-400"
              >
                {label}
                <span className="absolute -bottom-0.5 left-1/2 h-px w-0 bg-red-600
                                 transition-all duration-250 -translate-x-1/2 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT — Tagline */}
          <p className="text-[10px] italic tracking-[0.15em] text-zinc-700 transition-colors
                        duration-500 hover:text-red-500/50 md:text-right shrink-0">
            Private Streaming Collection
          </p>

        </div>

        {/* ── DIVIDER ── */}
        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">

          {/* Copyright */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-600">
            &copy; {new Date().getFullYear()} · All Rights Reserved ·{' '}
            <span className="text-zinc-500">ThTung</span>
          </p>

          {/* Animated dot — signature */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-zinc-800" />
            <div className="relative flex items-center justify-center">
              <div className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-red-600/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)]" />
            </div>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>

        </div>

      </div>
    </footer>
  );
}