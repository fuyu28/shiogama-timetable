import { useAtomValue } from "jotai";
import { activeTabAtom } from "@/atoms/tabAtom";
import { downTrainsAtom, upTrainsAtom } from "@/atoms/trainAtom";
import { PageHeader } from "./PageHeader";
import { TabNavigation } from "./TabNavigation";
import { TrainList } from "./TrainList";
import { LoadingFallback } from "./LoadingFallback";
import { EmptyState } from "./EmptyState";

export const TrainListView = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);

  const trains = activeTab === "up" ? upTrains : downTrains;

  // ローディング状態の判定
  const isLoading = upTrains.length === 0 && downTrains.length === 0;
  const isEmpty = trains.length === 0 && !isLoading;

  return (
    <div>
      <PageHeader title="一覧画面" showBackButton={true} backHref="/" />
      <TabNavigation />

      {isLoading ? (
        <LoadingFallback />
      ) : isEmpty ? (
        <EmptyState
          title="時刻表データがありません"
          message={`${activeTab === "up" ? "上り" : "下り"}の時刻表データが見つかりません`}
        />
      ) : (
        <TrainList trains={trains} direction={activeTab} />
      )}
    </div>
  );
};
