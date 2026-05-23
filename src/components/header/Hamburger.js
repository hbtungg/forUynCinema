'use client';

export default function Hamburger({ onClick, sidebarCollapsed, isMobileMenuOpen }) {
  // Giải pháp an toàn: Trên Mobile chỉ xoay khi Drawer mở, trên PC chỉ xoay khi Sidebar bung mở
  const isMobileCross = isMobileMenuOpen;
  const isDesktopCross = !sidebarCollapsed;

  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex-shrink-0 flex flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-white/[0.05] transition-colors z-[170]"
      aria-label="Toggle menu"
    >
      {/* THANH TRÊN CÙNG */}
      {/* md: biến đổi class theo trạng thái Desktop, mặc định không có tiền tố biến đổi theo Mobile */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
          isMobileCross 
            ? 'w-5 rotate-45 translate-y-[7px]' 
            : `w-5 ${isDesktopCross ? 'md:rotate-45 md:translate-y-[7px]' : 'md:rotate-0 md:translate-y-0'}`
        }`}
      />

      {/* THANH GIỮA */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
          isMobileCross 
            ? 'w-0 opacity-0' 
            : `w-4 ${isDesktopCross ? 'md:w-0 md:opacity-0' : 'md:w-4 md:opacity-100'}`
        }`}
      />

      {/* THANH DƯỚI CÙNG */}
      <span
        className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
          isMobileCross 
            ? 'w-5 -rotate-45 -translate-y-[7px]' 
            : `w-5 ${isDesktopCross ? 'md:-rotate-45 md:-translate-y-[7px]' : 'md:rotate-0 md:translate-y-0'}`
        }`}
      />
    </button>
  );
}