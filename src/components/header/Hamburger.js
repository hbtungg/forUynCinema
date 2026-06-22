'use client';

export default function Hamburger({ onClick, sidebarCollapsed, isMobileMenuOpen, isSearchOpen }) {
  // Giải pháp an toàn của anh: Định nghĩa trạng thái xoay dựa trên Props truyền vào
  const isMobileCross = isMobileMenuOpen;
  const isDesktopCross = !sidebarCollapsed;
  const hiddenOnMobile = isSearchOpen;
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      className={`w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-white/[0.05] transition-all duration-200 active:scale-95
        ${hiddenOnMobile ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}
      `}
    >
      {/* ── THANH TRÊN CÙNG ── */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 w-5 ${
          isMobileCross 
            ? 'rotate-45 translate-y-[7px]' 
            : isDesktopCross 
              ? 'md:rotate-45 md:translate-y-[7px] max-md:rotate-0 max-md:translate-y-0' 
              : 'rotate-0 translate-y-0'
        }`}
      />

      {/* ── THANH GIỮA ── */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
          isMobileCross 
            ? 'w-0 opacity-0' 
            : isDesktopCross 
              ? 'md:w-0 md:opacity-0 max-md:w-4 max-md:opacity-100' 
              : 'w-4 opacity-100'
        }`}
      />

      {/* ── THANH DƯỚI CÙNG ── */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 w-5 ${
          isMobileCross 
            ? '-rotate-45 -translate-y-[7px]' 
            : isDesktopCross 
              ? 'md:-rotate-45 md:-translate-y-[7px] max-md:rotate-0 max-md:translate-y-0' 
              : 'rotate-0 translate-y-0'
        }`}
      />
    </button>
  );
}