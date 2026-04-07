import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GHI NHỚ LỊCH SỬ XEM (POST)
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    if (!movie || !userEmail) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

    // Cập nhật hoặc thêm mới dựa trên email và slug của phim
    await db.collection("history").updateOne(
      { userEmail: userEmail, "movie.slug": movie.slug },
      { $set: { movie: movie, updatedAt: new Date() } },
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
    const { userEmail, slug } = await req.json();

    if (!userEmail || !slug) {
      return NextResponse.json({ error: "Thiếu email hoặc slug" }, { status: 400 });
    }

    // Xóa bản ghi dựa trên email người dùng và slug phim
    const result = await db.collection("history").deleteOne({
      userEmail: userEmail,
      "movie.slug": slug
    });

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