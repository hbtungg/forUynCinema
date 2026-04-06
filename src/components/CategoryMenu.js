'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_DATA = {
  categories: [
    { name: 'Hành Động', slug: 'hanh-dong' }, { name: 'Phiêu Lưu', slug: 'phieu-luu' }, { name: 'Hoạt Hình', slug: 'hoat-hinh' },
    { name: 'Hài', slug: 'hai' }, { name: 'Hình Sự', slug: 'hinh-su' }, { name: 'Tài Liệu', slug: 'tai-lieu' },
    { name: 'Chính Kịch', slug: 'chinh-kich' }, { name: 'Gia Đình', slug: 'gia-dinh' }, { name: 'Giả Tưởng', slug: 'gia-tuong' },
    { name: 'Lịch Sử', slug: 'lich-su' }, { name: 'Kinh Dị', slug: 'kinh-di' }, { name: 'Nhạc', slug: 'nhac' },
    { name: 'Bí Ẩn', slug: 'bi-an' }, { name: 'Lãng Mạn', slug: 'lang-man' }, { name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
    { name: 'Gây Cấn', slug: 'gay-can' }, { name: 'Chiến Tranh', slug: 'chien-tranh' }, { name: 'Tâm Lý', slug: 'tam-ly' },
    { name: 'Tình Cảm', slug: 'tinh-cam' }, { name: 'Cổ Trang', slug: 'co-trang' },
    { name: 'Phim 18+', slug: 'phim-18' }
  ],
  countries: [
    { name: 'Âu Mỹ', slug: 'au-my' }, { name: 'Anh', slug: 'anh' }, { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Việt Nam', slug: 'viet-nam' }, { name: 'Pháp', slug: 'phap' }, { name: 'Hồng Kông', slug: 'hong-kong' },
    { name: 'Hàn Quốc', slug: 'han-quoc' }, { name: 'Nhật Bản', slug: 'nhat-ban' }, { name: 'Thái Lan', slug: 'thai-lan' }
  ]
};

export default function CategoryMenu() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [openMenu, setOpenMenu] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

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
          if (!finalCats.find(c => c.slug === 'phim-18')) {
            finalCats = [...finalCats, { name: 'Phim 18+', slug: 'phim-18' }];
          }

          setData({
            categories: finalCats,
            countries: counts.items?.length > 0 ? counts.items : FALLBACK_DATA.countries
          });
        }
      } catch (e) { console.log("Dùng fallback data cho Thu Uyên"); }
    }
    fetchData();

    const close = () => setOpenMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const handleMouseEnter = (type) => {
    if (!isTouchDevice) setOpenMenu(type);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setOpenMenu(null);
  };

  const handleClick = (e, type) => {
    if (isTouchDevice) {
      e.stopPropagation();
      setOpenMenu(openMenu === type ? null : type);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-10 font-sans relative z-[60]">
      
      {/* DROPDOWN THỂ LOẠI */}
      <div 
        className="relative group"
        onMouseEnter={() => handleMouseEnter('cat')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          onClick={(e) => handleClick(e, 'cat')}
          className="px-5 py-2.5 bg-red-600 text-white text-[11px] font-black uppercase rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
        >
          Thể Loại <span className="transition-transform duration-300">{openMenu === 'cat' ? '▲' : '▼'}</span>
        </button>
        
        {openMenu === 'cat' && (
          <div className="absolute top-full left-0 w-[90vw] md:w-[520px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[999] grid grid-cols-2 md:grid-cols-3 gap-1 
            before:content-[''] before:absolute before:top-[-15px] before:left-0 before:w-full before:h-[20px] before:bg-transparent">
            {data.categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`} 
                onClick={() => setOpenMenu(null)}
                className={`px-3 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all truncate
                  ${cat.slug === 'phim-18' 
                    ? 'text-red-600 border border-red-600/30 bg-red-600/5 hover:bg-red-600 hover:text-white shadow-[inset_0_0_10px_rgba(220,38,38,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DROPDOWN QUỐC GIA */}
      <div 
        className="relative group"
        onMouseEnter={() => handleMouseEnter('count')}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          onClick={(e) => handleClick(e, 'count')}
          className="px-5 py-2.5 bg-zinc-800 text-zinc-300 text-[11px] font-black uppercase rounded-xl border border-zinc-700 flex items-center gap-2 active:scale-95 transition-all"
        >
          Quốc Gia <span className="transition-transform duration-300">{openMenu === 'count' ? '▲' : '▼'}</span>
        </button>
        
        {openMenu === 'count' && (
          <div className="absolute top-full left-0 w-[90vw] md:w-[320px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[999] grid grid-cols-2 gap-1
            before:content-[''] before:absolute before:top-[-15px] before:left-0 before:w-full before:h-[20px] before:bg-transparent">
            {data.countries.map((c) => (
              <Link key={c.slug} href={`/country/${c.slug}`} onClick={() => setOpenMenu(null)}
                className="px-3 py-2.5 text-[10px] font-black text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all uppercase truncate italic">
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}