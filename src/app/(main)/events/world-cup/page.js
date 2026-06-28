"use client";

import { useEffect } from 'react';
import Link from 'next/link';

const BORDER_GRADIENT = "absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FFD700] via-[#009A44] to-[#C8102E]";

export default function WorldCupEventPage() {
  
  useEffect(() => {
    document.title = "World Cup 2026 — Rực lửa cùng Seleção & Cristiano Ronaldo 🇵🇹";
  }, []);

  const roadToChampion = [
    { stage: "Vòng Bảng (Group Stage)", opponent: "Đang cập nhật", status: "Chờ xuất kích", date: "Tháng 06/2026" },
    { stage: "Vòng 32 Đội (Round of 32)", opponent: "Đang cập nhật", status: "Chờ đối thủ", date: "Tháng 07/2026" },
    { stage: "Vòng 16 Đội (Round of 16)", opponent: "Đang cập nhật", status: "Chờ đối thủ", date: "Tháng 07/2026" },
    { stage: "Tứ Kết (Quarter-Finals)", opponent: "Đang cập nhật", status: "Chờ đối thủ", date: "Tháng 07/2026" },
    { stage: "Bán Kết (Semi-Finals)", opponent: "Đang cập nhật", status: "Chờ đối thủ", date: "Tháng 07/2026" },
    { stage: "Chung Kết (Final)", opponent: "Đang cập nhật", status: "Mục tiêu tối thượng: VÔ ĐỊCH 🏆", date: "19/07/2026" }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white px-4 md:px-12 py-12 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/home" className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all w-fit">
          ← Về trang chủ
        </Link>

        {/* Tiêu đề trang - 🛠️ ĐÃ VÁ CHUẨN: Thay dấu nháy đơn thành &apos; để diệt sạch lỗi ESLint */}
        <div className="border-b border-zinc-900 pb-6 mb-8">
          <p className="text-gradient bg-gradient-to-r from-[#009A44] to-[#C8102E] bg-clip-text text-[10px] font-black uppercase tracking-[0.4em] mb-2 text-transparent">
            🇵🇹 PORTUGAL&apos;S LAST DANCE — WORLD CUP 2026
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
            Hành trình chinh phục <span className="text-red-600">Cúp Vàng Thế Giới</span> của CR7
          </h1>
          <p className="text-zinc-500 text-sm mt-3 max-w-2xl leading-relaxed">
            Trang theo dõi đặc biệt chiến dịch World Cup 2026. Tất cả vì mục tiêu đưa Bồ Đào Nha và huyền thoại Cristiano Ronaldo hoàn thiện bộ sưu tập danh hiệu vĩ đại nhất lịch sử bóng đá.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: THÔNG TIN HUYỀN THOẠI CRISTIANO RONALDO + 📸 ẢNH ANH 7 XỊN MỊN */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
              👑 Thống kê thủ lĩnh
            </h2>
            
            <div className="bg-[#111115] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl">
              <div className={BORDER_GRADIENT}></div>
              
              {/* 📸 ĐÃ THÊM: Khu vực hiển thị ảnh dọc của anh 7 Cristiano Ronaldo cực chất */}
              <div className="w-full h-80 rounded-xl overflow-hidden border border-white/5 mb-5 bg-black/40 relative">
                <img 
                  src="https://i.pinimg.com/736x/20/0a/e7/200ae737ddeafe22f102a1653f55bf58.jpg" 
                  alt="Cristiano Ronaldo World Cup 2026" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-500"
                />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl bg-black/40 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  🇵🇹
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-wide text-zinc-200">C. Ronaldo</h3>
                  <span className="text-xs text-red-500 font-bold">Tiền đạo · Áo số 7</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-4 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Số lần tham dự WC:</span>
                  <span className="text-zinc-200 font-bold">6 lần (Kỷ lục)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Số bàn thắng hiện tại:</span>
                  <span className="text-amber-400 font-bold">Đang cập nhật</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Trạng thái thể lực:</span>
                  <span className="text-emerald-400 font-bold">Sẵn sàng 100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mục tiêu tối thượng:</span>
                  <span className="text-[#FFD700] font-bold">Vô địch World Cup</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: LỘ TRÌNH VÀ NHÁNH ĐẤU HƯỚNG TỚI NGÔI VƯƠNG */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
              🗺️ Lộ trình tiến đến ngôi vương
            </h2>

            <div className="space-y-4">
              {roadToChampion.map((item, i) => (
                <div 
                  key={i} 
                  className={`border rounded-2xl p-5 flex items-center justify-between transition-all relative overflow-hidden select-none shadow-xl
                    ${item.stage.includes("Chung Kết") 
                      ? "bg-gradient-to-r from-[#1a1505] to-[#111115] border-[#FFD700]/30" 
                      : "bg-[#111115] border-white/5"
                    }`}
                >
                  {item.stage.includes("Chung Kết") && (
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FFD700]"></div>
                  )}
                  {!item.stage.includes("Chung Kết") && (
                    <div className={BORDER_GRADIENT}></div>
                  )}
                  
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${item.stage.includes("Chung Kết") ? "text-[#FFD700]" : "text-zinc-500"}`}>
                      {item.stage}
                    </span>
                    <div className="text-sm font-black text-zinc-200 uppercase tracking-wide">
                      Đối thủ: <span className="text-zinc-400 font-normal normal-case">{item.opponent}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border
                      ${item.stage.includes("Chung Kết")
                        ? "text-[#FFD700] bg-[#FFD700]/5 border-[#FFD700]/20 animate-pulse"
                        : "text-amber-400 bg-amber-400/5 border-amber-400/10"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 mt-1">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}