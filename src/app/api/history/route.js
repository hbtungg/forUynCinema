import { requireUserEmail, apiError, validMovieKey } from "@/lib/userApi";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GHI NHỚ LỊCH SỬ XEM (POST) - GIỮ NGUYÊN GỐC
export async function POST(req) {
  try {
    const userEmail = await requireUserEmail(req);
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { movie } = await req.json();
    if (!movie || typeof movie.slug !== "string" || !movie.slug) return NextResponse.json({error:"Thiếu phim"},{status:400});

    if (!movie || !userEmail) return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });

    if (!validMovieKey(movie.canonicalKey)) {
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
  } catch (error) {
    return apiError(error);
  }
}

// 2. LẤY LỊCH SỬ XEM VỀ (GET) - TƯƠNG THÍCH NGƯỢC HOÀN HẢO
export async function GET(req) {
  try {
    const userEmail = await requireUserEmail(req);
    const { searchParams } = new URL(req.url);
    if (!userEmail) return NextResponse.json([]);

    const pageParam = searchParams.get('page');
    
    const client = await clientPromise;
    const db = client.db("ForUynDB");

    // TRƯỜNG HỢP 1: Trang /history gọi (có truyền tham số page) -> Trả về Object phân trang
    if (pageParam) {
      const page = Math.max(1, Math.min(10000, parseInt(pageParam, 10) || 1));
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
  } catch (error) {
    return apiError(error);
  }
}

// 3. XÓA MỘT BỘ PHIM KHỎI LỊCH SỬ (DELETE) - GIỮ NGUYÊN GỐC
export async function DELETE(req) {
  try {
    const userEmail = await requireUserEmail(req);
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { slug, canonicalKey } = await req.json();
    if (!validMovieKey(slug) || (canonicalKey !== undefined && !validMovieKey(canonicalKey))) return NextResponse.json({error:"Mã phim không hợp lệ"},{status:400});

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
  } catch (error) {
    return apiError(error);
  }
}
