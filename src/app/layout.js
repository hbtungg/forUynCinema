// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'forUyn Cinema 🍿',
  description: 'fck Netflix',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Import font trực tiếp để trị dứt điểm lỗi chữ Ơ, Â, Ư */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,400;0,700;0,900;1,100;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased"
        suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}