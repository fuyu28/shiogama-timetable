import { useAtom } from "jotai";
import { activeTabAtom } from "@/atoms/tabAtom";

export const TabNavigation = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const activeTabStyle = "bg-blue-500 text-white border-b-2 border-blue-500";
  const inactiveTabStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-3 px-4 text-center ${
          activeTab === "up" ? activeTabStyle : inactiveTabStyle
        }`}
        onClick={() => setActiveTab("up")}
      >
        上り
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center ${
          activeTab === "down" ? activeTabStyle : inactiveTabStyle
        }`}
        onClick={() => setActiveTab("down")}
      >
        下り
      </button>
    </div>
  );
};
