import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Kết nối trực tiếp với file auth.js chứa callbacks của anh
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb';

// Tên Database và Collection thực tế trong hệ thống của anh
const DB_NAME = 'ForUynDB'; 
const COLLECTION_NAME = 'users';

// ── 1. API LẤY DANH SÁCH USER, TRẠNG THÁI ONLINE & LỊCH SỬ XEM (GET) ──
export async function GET(request) {
  try {
    // 🛡️ Bảo mật: Kiểm tra quyền truy cập độc quyền của tài khoản admin anh yêu
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Truy vấn dữ liệu từ collection users, xếp người mới nhất lên đầu
    const usersFromDb = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Chuẩn hóa dữ liệu trả về (Đồng bộ id dạng chuỗi string từ _id của MongoDB)
    const formattedUsers = usersFromDb.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      isOnline: user.isOnline || false,
      watching: user.watching || null,
      history: user.history || []
    }));

    return NextResponse.json(formattedUsers);

  } catch (error) {
    console.error("Lỗi khi kết nối MongoDB lấy danh sách user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ── 2. API THÊM TÀI KHOẢN MỚI VÀO DATABASE (POST) ──
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Kiểm tra trùng lặp email trên hệ thống ForUynDB
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã tồn tại trên hệ thống rạp' }, { status: 400 });
    }

    // Tiến hành chèn tài khoản thành viên mới tinh vào database
    const newUser = {
      name,
      email: email.toLowerCase(),
      role: 'user',
      isOnline: false,
      watching: null,
      history: [],
      createdAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newUser);

    return NextResponse.json({ 
      id: result.insertedId.toString(), 
      ...newUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Lỗi khi chèn tài khoản mới vào MongoDB:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ── 3. API XÓA TÀI KHOẢN KHỎI DATABASE (DELETE) ──
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Ngăn chặn tuyệt đối hành vi vô tình xóa nhầm tài khoản admin sáng lập của anh
    const userToDelete = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    if (userToDelete && userToDelete.email === 'hb.tungg@gmail.com') {
      return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 403 });
    }

    // Kích hoạt lệnh xóa vĩnh viễn khỏi Database
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Lỗi khi thực hiện xóa user trên MongoDB:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}