import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import getMongoClient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = "ForUynDB";
const COLLECTION_NAME = "history";

// ── 1. LẤY DANH SÁCH LỊCH SỬ XEM PHIM (GET) ──
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    // Sắp xếp giảm dần theo trường "updatedAt" (Phim ai vừa click xem xong sẽ nhảy lên đầu bảng ngay lập tức)
    const allHistory = await db
      .collection(COLLECTION_NAME)
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

// ── 2. XÓA MỘT DÒNG HOẶC DỌN SẠCH NHẬT KÝ XEM PHIM (DELETE) ──
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    if (clearAll) {
      // Dọn sạch toàn bộ nhật ký giám sát rạp
      await db.collection(COLLECTION_NAME).deleteMany({});
      return NextResponse.json({ success: true, message: "Đã dọn sạch toàn bộ nhật ký rạp phim" });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing history ID' }, { status: 400 });
    }

    // Xóa một log cụ thể
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Không tìm thấy dòng nhật ký này' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa dòng nhật ký thành công" });

  } catch (error) {
    console.error("Lỗi khi thực hiện xóa nhật ký rạp phim:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
