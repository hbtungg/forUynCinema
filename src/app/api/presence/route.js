import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const ONLINE_TTL_MS = 45 * 1000;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ error: "Thiếu email người dùng" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ForUynDB");
    const user = await db.collection("users").findOne(
      { email: userEmail },
      { projection: { email: 1, name: 1, isOnline: 1, lastSeenAt: 1, wentOfflineAt: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const lastSeenAt = user.lastSeenAt ? new Date(user.lastSeenAt).getTime() : 0;
    const isOnline = Boolean(user.isOnline && Date.now() - lastSeenAt <= ONLINE_TTL_MS);

    return NextResponse.json({
      email: user.email,
      name: user.name,
      isOnline,
      lastSeenAt: user.lastSeenAt || null,
      wentOfflineAt: user.wentOfflineAt || null,
    });
  } catch (error) {
    console.error("Lỗi lấy trạng thái online:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userEmail, status } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: "Thiếu email người dùng" }, { status: 400 });
    }

    const now = new Date();
    const isOnline = status !== "offline";
    const client = await clientPromise;
    const db = client.db("ForUynDB");

    await db.collection("users").updateOne(
      { email: userEmail },
      {
        $set: {
          isOnline,
          lastSeenAt: now,
          ...(isOnline ? {} : { wentOfflineAt: now }),
        },
      }
    );

    return NextResponse.json({
      success: true,
      isOnline,
      lastSeenAt: now,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái online:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
