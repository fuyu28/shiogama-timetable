import { useAtomValue } from "jotai";
import { activeTabAtom } from "@/atoms/tabAtom";
import { downTrainsAtom, upTrainsAtom } from "@/atoms/trainAtom";
import { PageHeader } from "./PageHeader";
import { TabNavigation } from "./TabNavigation";
import { TrainList } from "./TrainList";

export const TrainListView = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);

  const trains = activeTab === "up" ? upTrains : downTrains;

  return (
    <div>
      <PageHeader title="一覧画面" showBackButton={true} backHref="/" />
      <TabNavigation />
      <TrainList trains={trains} direction={activeTab} />
    </div>
  );
};
