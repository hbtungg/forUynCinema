'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import OnlineUsersMenu from "@/components/OnlineUsersMenu";

export default function RightPanel({ continueItems: initialItems, genres, topRated }) {
    const { data: session, status } = useSession();
    
    // 🚀 ĐÃ THÊM: State tự quản lý danh sách xem tiếp động từ API thực tế
    const [liveContinueItems, setLiveContinueItems] = useState([]);

    // 🚀 ĐÃ THÊM: Hàm nạp dữ liệu động từ database của tài khoản
    const loadRightPanelHistory = async () => {
        if (status === "authenticated" && session?.user?.email) {
            try {
                const res = await fetch(`/api/history?userEmail=${session.user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setLiveContinueItems(data.slice(0, 3)); // Chỉ lấy 3 phim xem gần nhất cho gọn đẹp panel
                }
            } catch (error) {
                console.error("Lỗi lấy lịch sử tại RightPanel:", error);
            }
        } else {
            setLiveContinueItems([]);
        }
    };

    // 🚀 ĐÃ THÊM: Khởi chạy lấy dữ liệu và lắng nghe sự kiện đồng bộ toàn trang
    useEffect(() => {
        if (status === "authenticated") {
            loadRightPanelHistory();
        } else {
            setLiveContinueItems([]);
        }
        window.addEventListener('historyUpdated', loadRightPanelHistory);
        return () => window.removeEventListener('historyUpdated', loadRightPanelHistory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session]);

    return (
        <aside className="hidden xl:flex flex-col w-[285px] 2xl:w-[305px] flex-shrink-0 h-full border-l border-white/[0.04] bg-[#0c0c0f] overflow-y-auto custom-scrollbar pb-10 relative z-10">

            {/* ── 1. TIẾP TỤC XEM ── */}
            <section className="px-5 pt-6 pb-5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Tiếp tục xem</h3>

                    {/* Chỉ hiện nút "Xem tất cả" khi user đã đăng nhập */}
                    {session && (
                        <a href="/lich-su" className="text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-wider transition-colors">
                            Xem tất cả
                        </a>
                    )}
                </div>

                {/* Khối bẫy điều kiện tài khoản */}
                {session ? (
                    // TRẠNG THÁI A: ĐÃ ĐĂNG NHẬP -> Hiện danh sách phim từ database
                    <div className="space-y-1">
                        {/* 🚀 ĐÃ TỐI ƯU: Đổi từ mảng ảo continueItems sang mảng dữ liệu thật liveContinueItems */}
                        {liveContinueItems && liveContinueItems.length > 0 ? (
                            liveContinueItems.map((item) => {
                                const epLabel = item.episode ? `Tập ${item.episode}` : 'Đang xem';

                                return (
                                    <a
                                        key={item.slug}
                                        href={`/watch/${item.slug}?ep=${item.episode || 1}`} // Khớp y hệt luồng truyền query tập phim của anh
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all group"
                                    >
                                        {/* Khung Poster thu nhỏ */}
                                        <div className="w-16 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900 relative">
                                            <img
                                                src={item.thumb_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Thanh tiến trình đồng bộ vạch đỏ */}
                                            <div
                                                className="absolute bottom-0 left-0 h-[3px] bg-red-600 transition-all"
                                                style={{ width: `${item.progress || 50}%` }}
                                            />
                                        </div>

                                        {/* Thông tin văn bản */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-zinc-200 truncate leading-none">
                                                {item.name}
                                            </p>
                                            <p className="text-[9px] text-zinc-600 truncate mt-1.5 font-medium">
                                                ● {epLabel}
                                            </p>
                                        </div>

                                        {/* Nút Play nhanh */}
                                        <button className="w-6 h-6 flex flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-zinc-600 group-hover:text-white group-hover:bg-red-600 transition-all">
                                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    </a>
                                );
                            })
                        ) : (
                            // Dự phòng khi đã đăng nhập nhưng chưa có lịch sử phim nào
                            <p className="text-[10px] text-zinc-600 text-center py-2 font-medium">Bạn chưa xem bộ phim nào gần đây.</p>
                        )}
                    </div>
                ) : (
                    // TRẠNG THÁI B: CHƯA ĐĂNG NHẬP -> Hiện khung nhắc nhở Premium sang trọng giữ nguyên của anh
                    <div className="p-4 rounded-2xl border border-dashed border-white/[0.03] bg-white/[0.01] flex flex-col items-center justify-center text-center group hover:border-red-600/20 hover:bg-red-600/[0.01] transition-all duration-300">
                        <p className="text-[11px] font-medium text-zinc-400 tracking-wide leading-relaxed group-hover:text-zinc-300 transition-colors">
                            Vui lòng đăng nhập<br />để xem tiếp hành trình của bạn 🎬
                        </p>
                        <Link
                            href="/login"
                            className="mt-3 px-4 py-1.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 active:scale-95"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}
            </section>

            <OnlineUsersMenu />

            {/* ── 2. THỂ LOẠI PHỔ BIẾN (GIỮ NGUYÊN BẢN CỦA ANH) ── */}
            <section className="px-5 py-5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Thể loại phổ biến</h3>
                    <a href="/the-loai" className="text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-wider transition-colors">Xem tất cả</a>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    {genres.map(({ label, icon, href }) => (
                        <a key={label} href={href}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                            <span className="text-sm leading-none">{icon}</span>
                            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-200 transition-colors truncate">{label}</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* ── 3. TOP RATED (GIỮ NGUYÊN BẢN CỦA ANH) ── */}
            <section className="px-5 py-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Top Rated</h3>
                    <a href="/top-rated" className="text-[9px] font-bold text-zinc-600 hover:text-red-500 uppercase tracking-wider transition-colors">Xem tất cả</a>
                </div>
                <div className="space-y-0.5">
                    {topRated.map((movie, i) => (
                        <a key={movie.slug} href={`/watch/${movie.slug}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all group">
                            <span className={`flex-shrink-0 w-5 text-center text-[13px] font-black tabular-nums ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-amber-700' : 'text-zinc-700'
                                }`}>{i + 1}</span>
                            <div className="w-9 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                                <img src={movie.thumb_url} alt={movie.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-zinc-200 truncate leading-none">{movie.name}</p>
                                <p className="text-[10px] text-zinc-600 mt-1">{movie.year || '2024'}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-amber-400 text-[10px] leading-none">★</span>
                                    <span className="text-[10px] font-bold text-zinc-500">{movie.fakeRating}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

        </aside>
    );
}
