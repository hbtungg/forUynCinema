import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// LẤY DANH SÁCH TỪ MÂY
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    if (!userEmail) return NextResponse.json([]);

    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const favorites = await db.collection("favorites")
      .find({ userEmail })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(favorites);
  } catch (e) {
    return NextResponse.json({ error: "Lỗi lấy danh sách" }, { status: 500 });
  }
}

// LƯU PHIM VÀO MÂY
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    await db.collection("favorites").updateOne(
      { userEmail, slug: movie.slug },
      { $set: { ...movie, userEmail, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Đã lưu vào mây! ❤️" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi lưu phim" }, { status: 500 });
  }
}

// XÓA PHIM KHỎI MÂY
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { slug, userEmail } = await req.json();

    await db.collection("favorites").deleteOne({ userEmail, slug });

    return NextResponse.json({ message: "Đã xóa khỏi mây" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi xóa phim" }, { status: 500 });
  }
}