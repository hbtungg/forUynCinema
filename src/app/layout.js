// src/app/layout.js
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/context/ThemeContext";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "400", "700", "900"],
  subsets: ["vietnamese"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-be-vietnam-pro", // Khởi tạo biến CSS nếu cần dùng sau này
});

export const metadata = {
  // 🚀 ĐÃ SỬA: Thêm metadataBase để định vị domain thực tế trên Vercel của anh
  metadataBase: new URL("https://uynflix.vercel.app"),

  title: {
    default: "Uynflix",
    template: "%s - Uynflix",
  },
  description:
    "Uynflix - Watch series online, watch films online free",

  openGraph: {
    title: "Uynflix - Watch series online, watch films online free",
    description:
      "Anh ơi em thích xem phim",
    url: "https://uynflix.vercel.app",
    siteName: "Uynflix",
    images: [
      {
        // 🚀 ĐÃ SỬA: Ép cứng đường dẫn URL tuyệt đối chứa tên miền để Bot Facebook quét được trực tiếp
        url: "https://uynflix.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Uynflix Preview Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
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
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
