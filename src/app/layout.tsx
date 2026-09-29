import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qin Ziwen — Enter the Unknown",
  description:
    "秦子雯的个人作品集。艺术市场、品牌策划、内容运营与 AIGC。每一次点击，都是一段经历。",
};

export const viewport: Viewport = {
  themeColor: "#050403",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>
        {children}
        <noscript>
          <div style={{ padding: "12vh 8vw", maxWidth: 680 }}>
            <p style={{ letterSpacing: "0.42em", fontSize: 12 }}>QIN ZIWEN</p>
            <h1 style={{ fontWeight: 300, fontSize: 48, letterSpacing: "0.18em" }}>ENTER THE UNKNOWN</h1>
            <p>请开启 JavaScript，进入这座个人作品集。</p>
            <p>
              <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/秦子雯--2027应届.pdf`}>下载简历</a>
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
