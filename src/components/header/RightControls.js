'use client';

import { useSession } from "next-auth/react";
import Image from 'next/image';
import UserMenu from '../UserMenu';
import EventButton from '../EventButton';

export default function RightControls({ 
  isSearchOpen, 
  setIsSearchOpen, 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  userMenuRef 
}) {
  const { data: session } = useSession();

  // ── KHO LƯU TRỮ LINK ẢNH ĐẠI DIỆN ĐÔI ──
  const AVATARS = {
    anh: "https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/714444774_4348560982139938_2542907653976839403_n.jpg?stp=dst-jpg_tt6&cstp=mx958x958&ctp=s958x958&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF4e90gmcG1j34sXAsvl3RTIp1_mwcwvOYinX-bBzC85osYu-D-7-I9hp_zLlGKo0zZjBz39XcnqZcYjVet5BeT&_nc_ohc=Q_RLeBCVHygQ7kNvwFdn_Ys&_nc_oc=AdqZp1HgQqfRagIhLB8knNWYwmtZDDJ_LRX_Wr6pc8JWqYV3-_fc0HLEIdYCHJnScZ7Q8eWMctLBUjlgwK7MiOQY&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=LDTFhCxq91oEprPR0H4hkg&_nc_ss=7b2a8&oh=00_Af9V3Rt4FdeSs9QicjY5Lp5GLgnp5DDQFqL3EPASN4vL6g&oe=6A357F56",
    vợ: "https://scontent.fdad3-8.fna.fbcdn.net/v/t39.30808-1/563468115_4377997125757427_4038117445022005208_n.jpg?stp=dst-jpg_tt6&cstp=mx960x958&ctp=s200x200&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFc6CB6_qn2w6BKww3XFdn65AiTecNw1jLkCJN5w3DWMntU8N80wj5tUR0Z7pI5swDFFTbWT5PVa3HO-DuZUwq0&_nc_ohc=4mFRnQUHjj8Q7kNvwGEAaDC&_nc_oc=AdoCjHxEnsjumqu-Eh_VjvzkogQbKf3m-GToHRJx1yDXzwaAykGPOWJV3g5Sy_dn2-587GFcQwmmHAn7NyR3gesU&_nc_zt=24&_nc_ht=scontent.fdad3-8.fna&_nc_gid=Mr3PlkMevvZghTBUs2S3QA&_nc_ss=7b2a8&oh=00_Af-eWK5R04guq1Gs92IbOaerts7AenaLb4PytsVnHV3Yqw&oe=6A3588D1"
  };

  // Hàm quyết định render ruột nội dung bên trong vòng tròn avatar
  const renderAvatarContent = () => {
    const email = session?.user?.email;

    if (email === 'hb.tungg@gmail.com') {
      return (
        <Image 
          src={AVATARS.anh} 
          alt="Anh Avatar" 
          fill
          sizes="30px"
          className="object-cover"
          unoptimized
        />
      );
    } 
    
    if (email === 'thuuyen009900@gmail.com') {
      return (
        <Image 
          src={AVATARS.vợ} 
          alt="Vợ Avatar" 
          fill
          sizes="30px"
          className="object-cover"
          unoptimized
        />
      );
    }

    // Mặc định cho tất cả các tài khoản khác còn lại
    return session?.user?.name?.charAt(0).toUpperCase() ?? "U";
  };

  return (
    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0 z-40">

      {/* ── 1. NÚT KÍNH LÚP TÌM KIẾM MOBILE ── */}
      <button
        onClick={() => setIsSearchOpen((v) => !v)}
        className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all
          ${isSearchOpen ? 'opacity-0 scale-75 pointer-events-none w-0' : 'opacity-100 scale-100'}
        `}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* ── 2. NÚT DẤU X TẮT TÌM KIẾM MOBILE ── */}
      {isSearchOpen && (
        <button
          onClick={() => setIsSearchOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-red-500 active:scale-75 transition-all ml-1"
          aria-label="Close search"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* ── 3. QUẢ CHUÔNG THÔNG BÁO ── */}
      <EventButton />

      <button className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all relative">
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
      </button>

      {/* ── 4. LỊCH SỬ XEM NHANH ── */}
      <button className="w-9 h-9 hidden sm:flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* ── 5. KHỐI PROFILE USER ĐĂNG NHẬP PC ── */}
      <div className="relative hidden md:block" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen((v) => !v)}
          className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/[0.05] transition-all"
        >
          {/* Khung chứa Avatar tròn kiểm soát động qua hàm bổ trợ */}
          <div className="w-[30px] h-[30px] rounded-full bg-red-900 flex items-center justify-center text-[12px] font-semibold text-red-300 flex-shrink-0 overflow-hidden relative">
            {renderAvatarContent()}
          </div>

          {/* Premium dot nhỏ gọn tối giản */}
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" title="Premium" />

          {/* Chevron */}
          <svg
            width="10" height="10"
            className={`text-zinc-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu Popup PC */}
        {isUserMenuOpen && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-48 bg-[#111114] border border-white/[0.07] rounded-xl p-2 z-50 shadow-2xl">
            <UserMenu />
          </div>
        )}
      </div>

    </div>
  );
}