import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    const client = await clientPromise;
    const db = client.db("ForUynDB");

    // Kiểm tra trùng lặp email
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email này đã đăng ký rồi anh yêu ơi! ❌" }, { status: 400 });
    }

    // Mã hóa bảo mật mật khẩu cho bà xã
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isOnline: false,
      lastSeenAt: null,
      wentOfflineAt: null,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Đăng ký thành công! ❤️" }, { status: 201 });
  } catch (error) {
    console.error("LỖI VERCEL:", error);
    return NextResponse.json({ error: "Lỗi hệ thống, anh kiểm tra lại DB nhé!" }, { status: 500 });
  }
}
