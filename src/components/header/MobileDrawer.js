"use client";

import UserMenu from "../UserMenu";
import Image from 'next/image';

export default function MobileDrawer({ isOpen, onClose }) {
  return (
    <>
      {/* Lớp màng mờ bọc nền phía sau */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Thùng chứa Menu trượt dọc */}
      <div
        className={`fixed top-0 left-0 w-[75vw] max-w-[300px] h-full bg-[#0c0c0f] border-r border-white/[0.05] z-[160] flex flex-col transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
          {/* LOGO THƯƠNG HIỆU MOBILE */}
          <div className="block select-none pointer-events-none h-7 relative w-28">
            <Image 
              src="/logo.png" 
              alt="Uynflix Logo" 
              fill
              priority // Tải ưu tiên để tăng tốc độ LCP
              sizes="112px"
              className="object-contain" 
            />
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-3">
          <UserMenu isMobile={true} />
        </div>
      </div>
    </>
  );
}
