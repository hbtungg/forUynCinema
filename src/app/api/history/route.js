import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

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

// THÊM HÀM NÀY ĐỂ LẤY LỊCH SỬ VỀ
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

    // Map lại dữ liệu để trả về danh sách movie phẳng cho dễ dùng
    return NextResponse.json(history.map(item => item.movie));
  } catch (e) {
    return NextResponse.json([]);
  }
}