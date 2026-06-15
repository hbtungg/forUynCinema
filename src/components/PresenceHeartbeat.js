"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Đặt khoảng cách gửi nhịp đập 30 giây là cực kỳ chuẩn cấu hình
const HEARTBEAT_INTERVAL = 30 * 1000;

export default function PresenceHeartbeat() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (status !== "authenticated" || !userEmail) return;

    const updatePresence = (nextStatus = "online", useBeacon = false) => {
      const payload = JSON.stringify({ userEmail, status: nextStatus });

      // Ưu tiên dùng sendBeacon khi đóng tab để đẩy request đi bất tử
      if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/presence", blob);
        return;
      }

      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    };

    // Báo cáo online ngay khi vừa mount trang sạch sẽ
    updatePresence("online");

    // Vòng lặp nhịp đập định kỳ khi người dùng đang thức xem phim
    const heartbeatId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        updatePresence("online");
      }
    }, HEARTBEAT_INTERVAL);

    // Xử lý thông minh: Ẩn tab phát báo offline lập tức, mở tab báo online tức thì
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updatePresence("online");
      } else {
        updatePresence("offline", true); // Dùng Beacon khóa chết luồng đóng tab ngầm
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(heartbeatId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updatePresence("offline", true);
    };
  }, [status, userEmail]);

  return null;
}