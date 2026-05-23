// src/app/layout.js
import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: {
    default: 'forUyn Cinema 🍿', // Tiêu đề mặc định khi trang con không khai báo
    template: '%s - forUyn Cinema 🍿', // %s sẽ được thay bằng tiêu đề của trang con
  },
  description: 'Em bảo em thích xem phim',
  icons: {
    icon: '/favicon.ico', // Đảm bảo anh có icon để tab trông xịn hơn
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* ĐÃ KHÔI PHỤC: Import font trực tiếp để trị dứt điểm lỗi chữ Ơ, Â, Ư của anh */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,400;0,700;0,900;1,100;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Ép cứng font chữ Be Vietnam Pro lên body toàn cục để không trang nào bị nhảy chữ */}
      <body 
        className="bg-black text-white antialiased"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        suppressHydrationWarning
      >
        {/* Trả lại Providers gốc quyền lực chứa trọn bộ cấu trúc ban đầu của anh */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}