import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 🚀 Ép chạy môi trường Node.js truyền thống để hoạt động bất tử trên cả Netlify và Vercel
export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const userEmail = searchParams.get('userEmail');

    // Nếu không truyền slug hoặc người dùng chưa đăng nhập (không có email), mặc định báo chưa yêu thích
    if (!slug || !userEmail) {
      return NextResponse.json({ isFavorite: false }, { status: 200 });
    }

    // Kết nối vào cụm MongoDB Atlas ForUynDB của anh
    const client = await clientPromise;
    const db = client.db("ForUynDB");

    // Tìm kiếm xem bộ phim này đã được tài khoản này lưu vào mây chưa
    const favorite = await db.collection("favorites").findOne({
      userEmail,
      $or: [
        { slug },
        { canonicalKey: slug },
        { "movie.slug": slug },
        { "movie.canonicalKey": slug },
      ],
    });

    // Trả về kết quả logic: true nếu tìm thấy, false nếu chưa có
    return NextResponse.json({ isFavorite: !!favorite }, { status: 200 });

  } catch (error) {
    console.error("Lỗi hệ thống tại api/favorites/check:", error);
    // Bọc lót an toàn: Nếu sập database, vẫn trả về false để giao diện xem phim nạp bình thường, không bị sập trang
    return NextResponse.json({ isFavorite: false }, { status: 200 });
  }
}