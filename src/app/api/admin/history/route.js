import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Gọi chính xác kết nối MongoDB tĩnh

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB"); // Trỏ chuẩn vào ForUynDB

    // ĐÃ ĐỒNG BỘ:
    // 1. Tìm chính xác tại collection "history" (số ít, không có chữ s)
    // 2. Sắp xếp giảm dần theo trường "updatedAt" (Phim ai vừa click xem xong sẽ nhảy lên đầu bảng ngay lập tức)
    const allHistory = await db
      .collection('history') 
      .find({})
      .sort({ updatedAt: -1 }) 
      .toArray();

    return NextResponse.json({ success: true, data: allHistory }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy lịch sử tại Admin API Route:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối cơ sở dữ liệu hệ thống", data: [] }, 
      { status: 500 }
    );
  }
}