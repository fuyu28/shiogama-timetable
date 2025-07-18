import { useAtomValue } from "jotai";
import { useState, useEffect } from "react";
import { activeTabAtom } from "@/atoms/tabAtom";
import { downTrainsAtom, upTrainsAtom } from "@/atoms/trainAtom";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";
import { TabNavigation } from "./TabNavigation";
import { TrainList } from "./TrainList";
import { LoadingFallback } from "./LoadingFallback";
import { EmptyState } from "./EmptyState";
import { MdArrowUpward } from "react-icons/md";

export const TrainListView = () => {
  // 必要な機能を直接呼び出し
  useCurrentTime(true); // 現在時刻が必要（TrainListで使用）
  useTrains(true); // 電車データが必要

  const activeTab = useAtomValue(activeTabAtom);
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const trains = activeTab === "up" ? upTrains : downTrains;

  // ローディング状態の判定
  const isLoading = upTrains.length === 0 && downTrains.length === 0;
  const isEmpty = trains.length === 0 && !isLoading;

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-16 z-40 bg-white shadow-sm">
          <TabNavigation />
        </div>

        <div className="p-4 space-y-6">
          {isLoading ? (
            <LoadingFallback />
          ) : isEmpty ? (
            <EmptyState
              title="時刻表データがありません"
              message={`${
                activeTab === "up" ? "上り" : "下り"
              }の時刻表データが見つかりません`}
            />
          ) : (
            <TrainList trains={trains} direction={activeTab} />
          )}
        </div>
      </div>

      {/* 常にボタンを描画し、表示/非表示とアニメーションはCSSクラスの切り替えで行う。*/}
      <button
        onClick={scrollToTop}
        aria-label="一番上に戻る"
        className={`
          fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50
          
          /* アニメーションの定義 */
          transition-all duration-300 ease-in-out transform
          
          ${
            showBackToTop
              ? "opacity-100 translate-y-0" // 表示時
              : "opacity-0 translate-y-4 pointer-events-none" // 非表示時
          }
        `}
      >
        <MdArrowUpward size={24} />
      </button>
    </div>
  );
};
