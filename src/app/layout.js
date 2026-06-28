// src/app/layout.js
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/context/ThemeContext";
import MidnightShader from "@/components/MidnightShader"; // 🚀 1. NẠP COMPONENT SHADER
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  metadataBase: new URL("https://uynflix.app"),
  title: {
    default: "Uynflix",
    template: "%s - Uynflix",
  },
  description: "Uynflix - Premium Celestial Cinema Escape",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.className} bg-transparent text-on-surface antialiased`}
        suppressHydrationWarning
      >
        {/* 🚀 2. ĐẶT SHADER Ở ĐÂY: Chạy ngầm mượt mà 120Hz làm nền cho toàn bộ ứng dụng */}
        <MidnightShader />
        
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}