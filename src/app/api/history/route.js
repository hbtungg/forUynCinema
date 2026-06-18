import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GHI NHỚ LỊCH SỬ XEM (POST)
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    if (!movie || !userEmail) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

    // canonicalKey là key duy nhất nhận diện phim, độc lập với provider/slug.
    // Nếu thiếu canonicalKey thì từ chối lưu — tránh tạo bản ghi trùng khi fallback slug
    // không nhất quán giữa các nguồn (nguonc vs kkphim có thể dùng slug khác nhau).
    if (!movie.canonicalKey) {
      console.warn("[history/POST] Thiếu canonicalKey, bỏ qua lưu lịch sử:", movie.slug);
      return NextResponse.json({ error: "Thiếu canonicalKey" }, { status: 400 });
    }

    const movieKey = { userEmail: userEmail, "movie.canonicalKey": movie.canonicalKey };

    // Chỉ cập nhật các field cần thiết thay vì ghi đè toàn bộ movie.
    // Giữ nguyên movie.provider gốc (lần đầu xem), chỉ cập nhật tập đang xem và thời gian.
    await db.collection("history").updateOne(
      movieKey,
      {
        $set: {
          // Cập nhật toàn bộ movie snapshot (bao gồm provider hiện tại)
          movie: movie,
          updatedAt: new Date(),
        },
        // Chỉ set canonicalKey và slug khi upsert (document mới) — không ghi đè nếu đã có
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ message: "Đã ghi nhớ ❤️" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi DB" }, { status: 500 });
  }
}

// 2. LẤY LỊCH SỬ XEM VỀ (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    if (!userEmail) return NextResponse.json([]);

    const client = await clientPromise;
    const db = client.db("ForUynDB");
    
    const history = await db.collection("history")
      .find({ userEmail: userEmail })
      .sort({ updatedAt: -1 }) // Phim mới xem lên đầu
      .limit(10)
      .toArray();

    // Trả về danh sách movie phẳng
    return NextResponse.json(history.map(item => item.movie));
  } catch (e) {
    return NextResponse.json([]);
  }
}

// 3. XÓA MỘT BỘ PHIM KHỎI LỊCH SỬ (DELETE) - MỚI CẬP NHẬT
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { userEmail, slug, canonicalKey } = await req.json();

    if (!userEmail || !slug) {
      return NextResponse.json({ error: "Thiếu email hoặc slug" }, { status: 400 });
    }

    // Ưu tiên xóa theo canonicalKey (nhận diện phim chính xác, độc lập provider).
    // Chỉ fallback về slug nếu không có canonicalKey (dữ liệu cũ chưa có field này).
    const deleteFilter = canonicalKey
      ? { userEmail: userEmail, "movie.canonicalKey": canonicalKey }
      : { userEmail: userEmail, "movie.slug": slug };

    const result = await db.collection("history").deleteOne(deleteFilter);

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Đã dọn dẹp kho báu 🧹" });
    } else {
      return NextResponse.json({ error: "Không tìm thấy phim để xóa" }, { status: 404 });
    }
  } catch (e) {
    console.error("Lỗi xóa lịch sử:", e);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}