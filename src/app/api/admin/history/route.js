import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Import chính xác clientPromise gốc của anh

export async function GET(request) {
  try {
    // 1. Chờ Promise kết nối thành công để lấy MongoClient instance
    const client = await clientPromise;
    
    // 2. ÉP CỨNG: Trỏ chính xác vào tên Database "ForUynDB" giống file Register của anh
    const db = client.db("ForUynDB"); 

    // 3. Truy vấn trực tiếp vào Collection lưu lịch sử phim
    // Đã chuyển sang xếp theo _id: -1 để bản ghi mới nhất luôn nhảy lên đầu hàng chuẩn 100%
    const allHistory = await db
      .collection('histories') 
      .find({})
      .sort({ _id: -1 }) 
      .toArray();

    // 4. Trả về định dạng JSON chuẩn mã nguồn Client đọc mượt mà
    return NextResponse.json({ success: true, data: allHistory }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy lịch sử admin tại API Route:", error);
    
    // Nếu có lỗi, trả về JSON an toàn thay vì ném ra trang HTML sập nguồn
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối cơ sở dữ liệu hệ thống" }, 
      { status: 500 }
    );
  }
}