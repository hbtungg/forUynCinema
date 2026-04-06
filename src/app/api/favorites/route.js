import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    await db.collection("favorites").updateOne(
      { userEmail: userEmail, slug: movie.slug },
      { $set: { ...movie, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Đã lưu vào bộ sưu tập của bà xã" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi lưu phim" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { slug, userEmail } = await req.json();

    await db.collection("favorites").deleteOne({ userEmail: userEmail, slug: slug });

    return NextResponse.json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi xóa phim" }, { status: 500 });
  }
}