import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-neutral-300 text-[10px] font-semibold uppercase tracking-[0.4em] mb-3">
          forUyn Events
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold uppercase italic tracking-tighter">
          Sự kiện
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-2xl">
          Khu vực tổng hợp các sự kiện đặc biệt theo mùa. Nút trên header sẽ tự chuyển
          đến event đang active theo thời gian.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-10">
          <EventCard
            href="/events/world-cup"
            title="World Cup"
            description="Lịch thi đấu, live score và các thông tin bóng đá trong mùa World Cup."
          />
          <EventCard
            href="/events/christmas"
            title="Noel"
            description="Trang chúc mừng và nội dung theo mùa Giáng sinh."
          />
        </div>
      </div>
    </main>
  );
}

function EventCard({ href, title, description }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all"
    >
      <h2 className="text-xl font-semibold uppercase tracking-tight">{title}</h2>
      <p className="text-sm text-zinc-500 mt-2 leading-6">{description}</p>
    </Link>
  );
}
