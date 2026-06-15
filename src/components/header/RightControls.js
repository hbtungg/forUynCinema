"use client";

import UserMenu from "../UserMenu";
import EventButton from "../EventButton";

export default function RightControls({
  isSearchOpen,
  setIsSearchOpen,
  isUserMenuOpen,
  setIsUserMenuOpen,
  userMenuRef,
}) {
  return (
    <div className="flex items-center gap-1 ml-auto flex-shrink-0 z-40">

      {/* ── 1. SEARCH TOGGLE (mobile only) ── */}
      <button
        onClick={() => setIsSearchOpen((v) => !v)}
        aria-label={isSearchOpen ? "Close search" : "Open search"}
        className={`
          md:hidden w-8 h-8 flex items-center justify-center rounded-lg
          transition-all duration-200
          ${isSearchOpen
            ? "text-red-400 bg-white/[0.06]"
            : "text-zinc-500 hover:text-white hover:bg-white/[0.05]"
          }
        `}
      >
        {isSearchOpen ? (
          /* X icon */
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Magnifier icon */
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>

      {/* ── 2. EVENT / NOTIFICATION BUTTON ── */}
      <EventButton />

      {/* ── 3. WATCH HISTORY (hidden on mobile) ── */}
      <button
        aria-label="Watch history"
        className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* ── 4. USER PROFILE (desktop) ── */}
      <div className="relative hidden md:block" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen((v) => !v)}
          className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-white/[0.05] transition-all"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-red-950 border border-red-800/40 flex items-center justify-center text-[11px] font-bold text-red-300 flex-shrink-0 select-none">
            H
          </div>

          {/* Premium indicator */}
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Premium" />

          {/* Chevron */}
          <svg
            width="10" height="10"
            className={`text-zinc-600 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-[#0f0f12] border border-white/[0.08] rounded-2xl p-3 z-50 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-1 duration-150">
            <UserMenu />
          </div>
        )}
      </div>
    </div>
  );
}