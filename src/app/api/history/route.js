import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    if (!movie || !userEmail) {
      return NextResponse.json({ error: "Thiếu dữ liệu rồi anh ơi" }, { status: 400 });
    }

    // Cập nhật nếu đã xem, hoặc thêm mới nếu chưa có
    await db.collection("history").updateOne(
      { userEmail: userEmail, "movie.slug": movie.slug },
      { 
        $set: { 
          movie: movie, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Đã ghi nhớ vào lịch sử của Thu Uyên ❤️" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Lỗi kết nối Database rồi" }, { status: 500 });
  }
}