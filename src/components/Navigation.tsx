"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MdSchedule,
  MdList,
  MdMap,
  MdNightsStay,
  MdDirectionsRun,
  MdMenu,
  MdClose,
} from "react-icons/md";

const navigationItems = [
  { href: "/", label: "時刻表", icon: MdSchedule },
  { href: "/list", label: "一覧表示", icon: MdList },
  { href: "/saitan-train", label: "最短電車", icon: MdDirectionsRun },
  { href: "/last-train", label: "終電情報", icon: MdNightsStay },
  { href: "/route-map", label: "路線図", icon: MdMap },
];

export function Navigation() {
  const pathname = usePathname();
  // メニューの開閉状態を管理するstate
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                塩釜口駅時刻表
              </h1>
            </div>
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <IconComponent className="mr-2" size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* ここからモバイル用のハンバーガーメニューボタン */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <MdClose className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MdMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          {/* ここまでモバイル用のハンバーガーメニューボタン */}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          /* メニュー開閉アニメーション定義 */
          sm:hidden border-t border-gray-200
          transition-all duration-300 ease-in-out overflow-hidden
          ${isMenuOpen ? 'max-h-96' : 'max-h-0'}
        `}
        id="mobile-menu"
      >
        {/* 表示されるメニュー項目 */}
        <div className="pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}  // メニュー項目クリック時にメニューを閉じる
                className={`flex items-center pl-3 pr-4 py-2 text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 border-blue-500 text-blue-700 border-l-4"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <IconComponent className="mr-2" size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
