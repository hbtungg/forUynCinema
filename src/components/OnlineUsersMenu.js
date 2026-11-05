"use client";

import { useEffect, useState } from "react";

const REFRESH_INTERVAL = 30 * 1000;

export default function OnlineUsersMenu() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOnlineUsers = async () => {
      try {
        const res = await fetch("/api/presence?online=1", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (isMounted) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        }
      } catch (error) {
        if (isMounted) {
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOnlineUsers();
    const intervalId = window.setInterval(loadOnlineUsers, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="px-5 py-5 border-b border-white/[0.04]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
          Đang online
        </h3>
        <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">
          {users.length} user
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-1">
          {users.map((user) => (
            <div
              key={user.email}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.015] hover:bg-white/[0.04] transition-all"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-[12px] font-semibold text-white">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0c0c0f]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-zinc-200 truncate leading-none">
                  {user.name || "Thành viên forUyn"}
                </p>
                <p className="text-[9px] text-zinc-600 truncate mt-1.5 font-medium">
                  Đang hoạt động
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-zinc-600 text-center py-2 font-medium">
          Chưa có user nào online.
        </p>
      )}
    </section>
  );
}
