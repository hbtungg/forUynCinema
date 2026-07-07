import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GHI NHỚ LỊCH SỬ XEM (POST)
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

    // Tìm tài liệu lịch sử xem của phim này (trùng canonicalKey hoặc trùng slug)
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

// 2. LẤY LỊCH SỬ XEM VỀ (GET) - HỖ TRỢ PHÂN TRANG CỐ ĐỊNH 8 PHIM
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    
    // Đọc trang hiện tại, mặc định là trang 1
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = 8; // Cố định 8 phim trên 1 trang theo ý anh
    const skip = (page - 1) * limit;

    if (!userEmail) return NextResponse.json({ movies: [], total: 0 });

    const client = await clientPromise;
    const db = client.db("ForUynDB");
    
    // 1. Lấy tổng số phim thực tế đã xem trong DB của User
    const total = await db.collection("history").countDocuments({ userEmail: userEmail });

    // 2. Lấy danh sách phim đã được phân trang chọc lọc
    const historyData = await db.collection("history")
      .find({ userEmail: userEmail })
      .sort({ updatedAt: -1 }) // Phim mới xem lên đầu
      .skip(skip)
      .limit(limit)
      .toArray();

    // Trả về cả mảng dữ liệu phẳng và tổng số lượng chính xác
    return NextResponse.json({
      movies: historyData.map(item => item.movie),
      total: total
    });
  } catch (e) {
    console.error("Lỗi GET lịch sử phân trang:", e);
    return NextResponse.json({ movies: [], total: 0 });
  }
}

// 3. XÓA MỘT BỘ PHIM KHỎI LỊCH SỬ (DELETE) - MỚI CẬP NHẬT
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const { userEmail, slug, canonicalKey } = await req.json();

    if (!userEmail || !slug) {
      return NextResponse.json({ error: "Thiếu email hoặc slug" }, { status: 400 });
    }

    // Xóa tất cả các bản ghi lịch sử xem trùng canonicalKey hoặc slug
    const deleteFilter = {
      userEmail: userEmail,
      $or: [
        ...(canonicalKey ? [{ "movie.canonicalKey": canonicalKey }] : []),
        { "movie.slug": slug }
      ]
    };

    const result = await db.collection("history").deleteMany(deleteFilter);

    if (result.deletedCount >= 1) {
      return NextResponse.json({ message: "Đã dọn dẹp kho báu 🧹" });
    } else {
      return NextResponse.json({ error: "Không tìm thấy phim để xóa" }, { status: 404 });
    }
  } catch (e) {
    console.error("Lỗi xóa lịch sử:", e);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}