import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "塩釜口駅時刻表APP",
  description: "名古屋市営地下鉄鶴舞線塩釜口駅の時刻表が見れるWebアプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
