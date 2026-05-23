'use client';
import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext"; // 🚀 ĐÃ THÊM: Import lớp bọc kính mờ cao cấp vào đây

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {/* 🚀 KÍCH HOẠT: Bọc AuthModalProvider ôm trọn children để mọi khay phim, banner đều gọi được Modal thông báo */}
      <AuthModalProvider>
        {children}
      </AuthModalProvider>
    </SessionProvider>
  );
}