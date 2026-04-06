'use client';
import Link from 'next/link';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-zinc-900 pb-10">
      {/* TRÁI: Thương hiệu forUyn Cinema */}
      <div className="flex flex-col items-center md:items-start">
        <Link href="/">
          <h1 className="text-4xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition italic leading-none">
            <span className="text-white">for</span>
            <span className="text-red-600">Uyn</span>
            <span className="text-white ml-2">Cinema</span>
          </h1>
        </Link>
        <p className="text-zinc-500 text-[10px] md:text-sm mt-2 italic font-medium">
          Gọi cho anh bất cứ khi nào em thấy cần 🥦
        </p>
      </div>

      {/* PHẢI: Tìm kiếm & Đăng nhập */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
        <SearchBox />
        <div className="border-l border-zinc-800 pl-4 ml-2 hidden md:block">
           <UserMenu />
        </div>
        {/* Hiện UserMenu riêng trên mobile */}
        <div className="md:hidden">
           <UserMenu />
        </div>
      </div>
    </header>
  );
}