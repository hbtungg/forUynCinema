import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Cấu hình kết nối MongoDB tĩnh của anh

export async function GET(request) {
  try {
    // 1. Kết nối cơ sở dữ liệu qua clientPromise
    const client = await clientPromise;
    
    // 2. Trỏ trực tiếp vào đúng tên Database "ForUynDB" giống file Register và History của anh
    const db = client.db("ForUynDB"); 

    // 3. Truy vấn trực tiếp dữ liệu lịch sử phim
    // Sử dụng bộ sắp xếp giảm dần theo hệ thống ID mặc định (_id: -1) để phim mới xem luôn nằm trên đầu bảng
    const allHistory = await db
      .collection('histories') // 💡 Sửa thành 'history' nếu tên collection trong ForUynDB của anh không có chữ 's' nhé
      .find({})
      .sort({ _id: -1 }) 
      .toArray();

    // 4. Trả về mảng JSON sạch bóng lỗi 500 cho Client
    return NextResponse.json({ success: true, data: allHistory }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy lịch sử admin tại API Route:", error);
    
    // Trả về mảng rỗng an toàn nếu hệ thống DB gặp sự cố kết nối đột ngột
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối cơ sở dữ liệu hệ thống", data: [] }, 
      { status: 500 }
    );
  }
}