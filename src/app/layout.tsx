import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "塩釜口駅時刻表APP",
  description: "名古屋市営地下鉄鶴舞線塩釜口駅の時刻表が見れるWebアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
