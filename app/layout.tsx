import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://market-power-scan.vercel.app';

export const metadata: Metadata = {
  title: "市場価値スカウター | Market Power Scan",
  description: "スキル・経験・副業・AI活用から、転職・独立時の想定市場年収と戦闘力を診断。あなたの市場価値、いくつ？",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "市場価値スカウター | Market Power Scan",
    description: "スキル・経験・副業・AI活用から、転職・独立時の想定市場年収と戦闘力を診断。あなたの市場価値、いくつ？",
    url: APP_URL,
    siteName: "市場価値スカウター",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "市場価値スカウター | Market Power Scan",
    description: "スキル・経験・副業・AI活用から、転職・独立時の想定市場年収と戦闘力を診断。あなたの市場価値、いくつ？",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-[#020d18] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
