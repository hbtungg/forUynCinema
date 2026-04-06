import Link from 'next/link';

// Bộ dữ liệu dự phòng ĐẦY ĐỦ (phòng trường hợp API lỗi)
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
    { name: 'Indonesia', slug: 'indonesia' }, { name: 'Việt Nam', slug: 'viet-nam' }, { name: 'Pháp', slug: 'phap' },
    { name: 'Hồng Kông', slug: 'hong-kong' }, { name: 'Hàn Quốc', slug: 'han-quoc' }, { name: 'Nhật Bản', slug: 'nhat-ban' },
    { name: 'Thái Lan', slug: 'thai-lan' }, { name: 'Đài Loan', slug: 'dai-loan' }, { name: 'Nga', slug: 'nga' },
    { name: 'Hà Lan', slug: 'ha-lan' }, { name: 'Philippines', slug: 'philippines' }, { name: 'Ấn Độ', slug: 'an-do' },
    { name: 'Quốc gia khác', slug: 'quoc-gia-khac' }
  ]
};

async function getMenuData() {
  try {
    const [catRes, countRes] = await Promise.all([
      fetch('https://phim.nguonc.com/api/the-loai', { next: { revalidate: 86400 } }),
      fetch('https://phim.nguonc.com/api/quoc-gia', { next: { revalidate: 86400 } })
    ]);

    // Nếu API trả về lỗi HTML (lỗi <), ném lỗi để nhảy vào catch
    if (!catRes.ok || !countRes.ok) throw new Error("API bận");

    const cats = await catRes.json();
    const counts = await countRes.json();
    
    return {
      categories: cats.items?.length > 0 ? cats.items : FALLBACK_DATA.categories,
      countries: counts.items?.length > 0 ? counts.items : FALLBACK_DATA.countries
    };
  } catch (error) {
    console.log("Sử dụng dữ liệu dự phòng đầy đủ cho anh yêu...");
    return FALLBACK_DATA;
  }
}

export default async function CategoryMenu() {
  const { categories, countries } = await getMenuData();

  return (
    <div className="flex flex-wrap gap-4 mb-10 font-sans relative">
      
      {/* DROPDOWN THỂ LOẠI */}
      <div className="relative group">
        <button className="px-6 py-2 bg-red-600 text-white text-[11px] font-black uppercase rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all flex items-center gap-2">
          Thể Loại <span className="text-[8px] opacity-60">▼</span>
        </button>
        
        <div className="absolute top-full left-0 mt-2 w-[480px] bg-zinc-900/98 backdrop-blur-2xl border border-zinc-800 p-5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] grid grid-cols-3 gap-1">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-red-600 rounded-lg transition-all uppercase truncate">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* DROPDOWN QUỐC GIA */}
      <div className="relative group">
        <button className="px-6 py-2 bg-zinc-800 text-zinc-300 text-[11px] font-black uppercase rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700/50 flex items-center gap-2">
          Quốc Gia <span className="text-[8px] opacity-60">▼</span>
        </button>
        
        <div className="absolute top-full left-0 mt-2 w-[350px] bg-zinc-900/98 backdrop-blur-2xl border border-zinc-800 p-5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] grid grid-cols-2 gap-1">
          {countries.map((c) => (
            <Link key={c.slug} href={`/country/${c.slug}`}
              className="px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-600 rounded-lg transition-all uppercase truncate">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}