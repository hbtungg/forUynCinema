import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
    return NextResponse.json([]);
  }
}

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
    return NextResponse.json({ message: "Đã lưu vào mây ❤️" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { slug, userEmail } = await req.json();

    await db.collection("favorites").deleteOne({ userEmail, slug });
    return NextResponse.json({ message: "Đã xóa khỏi mây" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi" }, { status: 500 });
  }
}