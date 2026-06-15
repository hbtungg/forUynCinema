// src/app/layout.js
import Providers from '@/components/Providers';
import { ThemeProvider } from '@/context/ThemeContext'; 
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['100', '400', '700', '900'],
  subsets: ['vietnamese'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-be-vietnam-pro', // Khởi tạo biến CSS nếu cần dùng sau này
});

export const metadata = {
  title: {
    default: 'Uynflix',
    template: '%s - Uynflix',
  },
  description: 'Uynflix - Watch series online, watch films online free',
  // 🚀 Cấu hình Open Graph để đổi ảnh và chữ khi share link
  openGraph: {
    title: 'Uynflix - Watch series online, watch films online free',
    description: 'Em bảo anh ơi em thích xem phim',
    url: 'https://uynflix.vercel.app', // Đường dẫn rạp phim thực tế của anh
    siteName: 'Uynflix',
    images: [
      {
        url: '/opengraph-image.png', // Đường dẫn trỏ tới file ảnh anh để trong thư mục public
        width: 1200,
        height: 630,
        alt: 'Uynflix Preview Banner',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body 
        className={`${beVietnamPro.className} bg-white dark:bg-black text-zinc-900 dark:text-white antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}