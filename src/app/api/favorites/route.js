import { requireUserEmail, apiError, validMovieKey } from "@/lib/userApi";
import getMongoClient from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userEmail = await requireUserEmail(req);
    if (!userEmail) return NextResponse.json([]);

    const client = await getMongoClient();
    const db = client.db("ForUynDB");
    const favorites = await db.collection("favorites")
      .find({ userEmail })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(favorites);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(req) {
  try {
    const userEmail = await requireUserEmail(req);
    const client = await getMongoClient();
    const db = client.db("ForUynDB");
    const { movie } = await req.json();
    if (movie?.canonicalKey !== undefined && !validMovieKey(movie.canonicalKey)) return NextResponse.json({error:"Mã phim không hợp lệ"},{status:400});
    if (!movie || typeof movie.slug !== "string" || !movie.slug) return NextResponse.json({error:"Thiếu phim"},{status:400});

    const movieKey = movie.canonicalKey
      ? { userEmail, canonicalKey: movie.canonicalKey }
      : { userEmail, slug: movie.slug };

    await db.collection("favorites").updateOne(
      movieKey,
      { $set: { ...Object.fromEntries(Object.entries(movie).filter(([key]) => !["_id", "userEmail", "updatedAt"].includes(key))), userEmail, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ message: "Đã lưu vào mây ❤️" });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(req) {
  try {
    const userEmail = await requireUserEmail(req);
    const client = await getMongoClient();
    const db = client.db("ForUynDB");
    const { slug, canonicalKey } = await req.json();
    if (canonicalKey !== undefined && !validMovieKey(canonicalKey)) return NextResponse.json({error:"Mã phim không hợp lệ"},{status:400});
    if (typeof slug !== "string" || !slug) return NextResponse.json({error:"Thiếu slug"},{status:400});

    await db.collection("favorites").deleteOne({
      userEmail,
      $or: [
        ...(canonicalKey ? [{ canonicalKey }] : []),
        { slug }
      ]
    });
    return NextResponse.json({ message: "Đã xóa khỏi mây" });
  } catch (error) {
    return apiError(error);
  }
}
