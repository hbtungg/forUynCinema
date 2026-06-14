"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const HEARTBEAT_INTERVAL = 30 * 1000;

export default function PresenceHeartbeat() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (status !== "authenticated" || !userEmail) return;

    const updatePresence = (nextStatus = "online", useBeacon = false) => {
      const payload = JSON.stringify({ userEmail, status: nextStatus });

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

    updatePresence("online");

    const heartbeatId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        updatePresence("online");
      }
    }, HEARTBEAT_INTERVAL);

    const handleVisibilityChange = () => {
      updatePresence(document.visibilityState === "visible" ? "online" : "offline", true);
    };

    const handlePageHide = () => {
      updatePresence("offline", true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      window.clearInterval(heartbeatId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
      updatePresence("offline", true);
    };
  }, [status, userEmail]);

  return null;
}
