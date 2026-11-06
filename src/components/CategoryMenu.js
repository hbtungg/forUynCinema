'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FALLBACK_DATA = {
  categories: [
    { name: 'Hành Động', slug: 'hanh-dong' }, { name: 'Phiêu Lưu', slug: 'phieu-luu' }, { name: 'Hoạt Hình', slug: 'hoat-hinh' },
    { name: 'Hài', slug: 'hai' }, { name: 'Hình Sự', slug: 'hinh-su' }, { name: 'Tài Liệu', slug: 'tai-lieu' },
    { name: 'Chính Kịch', slug: 'chinh-kich' }, { name: 'Gia Đình', slug: 'gia-dinh' }, { name: 'Giả Tưởng', slug: 'gia-tuong' },
    { name: 'Lịch Sử', slug: 'lich-su' }, { name: 'Kinh Dị', slug: 'kinh-di' }, { name: 'Nhạc', slug: 'nhac' },
    { name: 'Bí Ẩn', slug: 'bi-an' }, { name: 'Lãng Mạn', slug: 'lang-man' }, { name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
    { name: 'Gây Cấn', slug: 'gay-can' }, { name: 'Chiến Tranh', slug: 'chien-tranh' }, { name: 'Tâm Lý', slug: 'tam-ly' },
    { name: 'Tình Cảm', slug: 'tinh-cam' }, { name: 'Cổ Trang', slug: 'co-trang' }, { name: 'Miền Tây', slug: 'mien-tay' },
    { name: 'Phim 18+', slug: 'phim-18' }
  ],
  countries: [
    { name: 'Âu Mỹ', slug: 'au-my' }, { name: 'Anh', slug: 'anh' }, { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Việt Nam', slug: 'viet-nam' }, { name: 'Pháp', slug: 'phap' }, { name: 'Hồng Kông', slug: 'hong-kong' },
    { name: 'Hàn Quốc', slug: 'han-quoc' }, { name: 'Nhật Bản', slug: 'nhat-ban' }, { name: 'Thái Lan', slug: 'thai-lan' }
  ]
};

export default function CategoryMenu({ isMobile = false, closeMobileMenu }) {
  const [data, setData] = useState(FALLBACK_DATA);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, countRes] = await Promise.all([
          fetch('https://phim.nguonc.com/api/the-loai'),
          fetch('https://phim.nguonc.com/api/quoc-gia')
        ]);
        if (catRes.ok && countRes.ok) {
          const cats = await catRes.json();
          const counts = await countRes.json();
          
          let finalCats = cats.items?.length > 0 ? cats.items : FALLBACK_DATA.categories;
          // Đảm bảo luôn có Phim 18+ và Miền Tây nếu API thiếu
          if (!finalCats.find(c => c.slug === 'phim-18')) finalCats.push({ name: 'Phim 18+', slug: 'phim-18' });
          if (!finalCats.find(c => c.slug === 'mien-tay')) finalCats.push({ name: 'Miền Tây', slug: 'mien-tay' });

          setData({
            categories: finalCats,
            countries: counts.items?.length > 0 ? counts.items : FALLBACK_DATA.countries
          });
        }
      } catch (e) { console.log("Dùng dữ liệu dự phòng"); }
    }
    fetchData();
  }, []);

  // --- GIAO DIỆN MOBILE ---
  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="border-b border-white/5">
          <button onClick={() => setOpenMenu(openMenu === 'cat' ? null : 'cat')} className="w-full flex items-center justify-between py-4 text-white font-semibold uppercase text-[10px] tracking-widest">
            Thể Loại <span className={`transition-transform duration-300 ${openMenu === 'cat' ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'cat' ? 'max-h-[600px] pb-6' : 'max-h-0'}`}>
            {data.categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={closeMobileMenu} className="px-3 py-2.5 glass-trim rounded-xl text-zinc-400 text-[9px] font-semibold uppercase truncate">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b border-white/5">
          <button onClick={() => setOpenMenu(openMenu === 'count' ? null : 'count')} className="w-full flex items-center justify-between py-4 text-white font-semibold uppercase text-[10px] tracking-widest">
            Quốc Gia <span className={`transition-transform duration-300 ${openMenu === 'count' ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${openMenu === 'count' ? 'max-h-[400px] pb-6' : 'max-h-0'}`}>
            {data.countries.map((c) => (
              <Link key={c.slug} href={`/country/${c.slug}`} onClick={closeMobileMenu} className="px-3 py-2.5 glass-trim rounded-xl text-zinc-400 text-[9px] font-semibold uppercase truncate">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN DESKTOP ---
  return (
    <div className="flex items-center gap-4">
      {/* Dropdown Thể loại */}
      <div className="relative group" onMouseEnter={() => setOpenMenu('cat')} onMouseLeave={() => setOpenMenu(null)}>
        <button className="px-5 py-2.5 glass-trim text-white text-[10px] font-semibold uppercase rounded-xl transition-transform active:scale-95 shadow-lg shadow-neutral-600/20">
          Thể Loại
        </button>
        {/* Lớp đệm kết nối tàng hình */}
        <div className="absolute top-full left-0 w-full h-4 bg-transparent"></div>
        
        {openMenu === 'cat' && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[520px] clear-glass glass-popover p-5 rounded-[2rem] grid grid-cols-3 gap-1  animate-in fade-in zoom-in-95 duration-200">
            {data.categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={`px-4 py-2.5 text-[10px] font-semibold uppercase rounded-xl transition-all truncate ${cat.slug === 'phim-18' ? 'text-neutral-300 bg-neutral-700/5 hover:bg-neutral-700 hover:text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Quốc gia */}
      <div className="relative group" onMouseEnter={() => setOpenMenu('count')} onMouseLeave={() => setOpenMenu(null)}>
        <button className="px-5 py-2.5 glass-trim text-zinc-100 text-[10px] font-semibold uppercase rounded-xl border border-white/5 transition-transform active:scale-95">
          Quốc Gia
        </button>
        <div className="absolute top-full left-0 w-full h-4 bg-transparent"></div>
        
        {openMenu === 'count' && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] clear-glass glass-popover p-5 rounded-[2rem] grid grid-cols-2 gap-1  animate-in fade-in zoom-in-95 duration-200">
            {data.countries.map((c) => (
              <Link key={c.slug} href={`/country/${c.slug}`} className="px-4 py-2.5 text-[10px] font-semibold uppercase text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all truncate">
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}