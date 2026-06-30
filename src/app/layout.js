// src/app/layout.js
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/context/ThemeContext";
import MidnightShader from "@/components/MidnightShader"; 
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  // 🚀 ĐÃ SỬA: Thêm metadataBase để định vị domain thực tế trên Vercel của anh
  metadataBase: new URL("https://uynflix.vercel.app"),

  title: {
    default: "Uynflix",
    template: "%s - Uynflix",
  },
  description: "Uynflix - Watch series online, watch films online free",

  appleWebApp: {
    capable: true,
    title: "Uynflix",
    statusBarStyle: "black-translucent",
  },

  openGraph: {
    title: "Uynflix",
    description: "Anh ơi em thích xem phim",
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
        className={`${beVietnamPro.className} bg-transparent text-on-surface antialiased`}
        suppressHydrationWarning
      >
        <MidnightShader />
        
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}