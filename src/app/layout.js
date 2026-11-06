// src/app/layout.js
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/context/ThemeContext";

import "./globals.css";



export const viewport = { viewportFit: "cover", themeColor: "#050505" };

export const metadata = {
  // 🚀 ĐÃ SỬA: Thêm metadataBase để định vị domain thực tế trên Vercel của anh
  metadataBase: new URL("https://uynflix.vercel.app"),

  title: {
    default: "Uynflix",
    template: "%s - Uynflix",
  },
  description: "Khám phá phim mới, phim lẻ và phim bộ trên Uynflix.",

  appleWebApp: {
    capable: true,
    title: "Uynflix",
    statusBarStyle: "black-translucent",
  },

  openGraph: {
    title: "Uynflix",
    description: "Khám phá phim mới, phim lẻ và phim bộ trên Uynflix.",
    url: "https://uynflix.vercel.app",
    siteName: "Uynflix",
    images: [
      {
        url: "https://uynflix.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Uynflix Preview Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`text-on-surface antialiased`}
        suppressHydrationWarning
      >

        
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}