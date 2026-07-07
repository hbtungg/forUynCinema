import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GHI NHỚ LỊCH SỬ XEM (POST) - GIỮ NGUYÊN GỐC
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie, userEmail } = await req.json();

    if (!movie || !userEmail) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

    if (!movie.canonicalKey) {
      console.warn("[history/POST] Thiếu canonicalKey, bỏ qua lưu lịch sử:", movie.slug);
      return NextResponse.json({ error: "Thiếu canonicalKey" }, { status: 400 });
    }

    const existingHistory = await db.collection("history").findOne({
      userEmail: userEmail,
      $or: [
        { "movie.canonicalKey": movie.canonicalKey },
        { "movie.slug": movie.slug }
      ]
    });

    if (existingHistory) {
      await db.collection("history").updateOne(
        { _id: existingHistory._id },
        {
          $set: {
            movie: movie,
            updatedAt: new Date(),
          }
        }
      );
    } else {
      await db.collection("history").updateOne(
        { userEmail: userEmail, "movie.canonicalKey": movie.canonicalKey },
        {
          $set: {
            movie: movie,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
    return NextResponse.json({ message: "Đã ghi nhớ ❤️" });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi DB" }, { status: 500 });
  }
}

// 2. LẤY LỊCH SỬ XEM VỀ (GET) - TƯƠNG THÍCH NGƯỢC HOÀN HẢO
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    if (!userEmail) return NextResponse.json([]);

    const pageParam = searchParams.get('page');
    
    const client = await clientPromise;
    const db = client.db("ForUynDB");

    // TRƯỜNG HỢP 1: Trang /history gọi (có truyền tham số page) -> Trả về Object phân trang
    if (pageParam) {
      const page = parseInt(pageParam, 10) || 1;
      const limit = 8;
      const skip = (page - 1) * limit;

      const total = await db.collection("history").countDocuments({ userEmail: userEmail });
      
      const historyData = await db.collection("history")
        .find({ userEmail: userEmail })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return NextResponse.json({
        movies: historyData.map(item => item.movie).filter(Boolean),
        total: total
      });
    }

    // TRƯỜNG HỢP 2: Trang chủ gọi (không truyền page) -> Trả về mảng phẳng 10 phim như file gốc cũ
    const history = await db.collection("history")
      .find({ userEmail: userEmail })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(history.map(item => item.movie).filter(Boolean));
  } catch (e) {
    return NextResponse.json([]);
  }
}

// 3. XÓA MỘT BỘ PHIM KHỎI LỊCH SỬ (DELETE) - GIỮ NGUYÊN GỐC
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { userEmail, slug, canonicalKey } = await req.json();

    if (!userEmail || !slug) {
      return NextResponse.json({ error: "Thiếu email hoặc slug" }, { status: 400 });
    }

    const deleteFilter = {
      userEmail: userEmail,
      $or: [
        ...(canonicalKey ? [{ "movie.canonicalKey": canonicalKey }] : []),
        { "movie.slug": slug }
      ]
    };

    const result = await db.collection("history").deleteMany(deleteFilter);

    if (result.deletedCount >= 1) {
      return NextResponse.json({ message: "Đã dọn dẹp" });
    } else {
      return NextResponse.json({ error: "Không tìm thấy phim để xóa" }, { status: 404 });
    }
  } catch (e) {
    console.error("Lỗi xóa lịch sử:", e);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}