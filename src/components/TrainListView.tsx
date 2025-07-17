import { useAtomValue } from "jotai";
import { useState, useEffect } from "react";
import { activeTabAtom } from "@/atoms/tabAtom";
import { downTrainsAtom, upTrainsAtom } from "@/atoms/trainAtom";
import { TabNavigation } from "./TabNavigation";
import { TrainList } from "./TrainList";
import { LoadingFallback } from "./LoadingFallback";
import { EmptyState } from "./EmptyState";
import { MdArrowUpward } from "react-icons/md";

export const TrainListView = () => {
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
        <div className="bg-white shadow-sm">
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

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
          aria-label="一番上に戻る"
        >
          <MdArrowUpward />
        </button>
      )}
    </div>
  );
};
