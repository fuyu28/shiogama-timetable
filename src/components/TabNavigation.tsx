import { useAtom } from "jotai";
import { activeTabAtom } from "@/atoms/tabAtom";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { Direction } from "@/types/train";

export const TabNavigation = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  return (
    <div className="flex bg-gray-50 p-1 rounded-lg shadow-sm">
      <button
        className={`flex-1 py-3 px-6 text-center font-medium rounded-md transition-all duration-200 ${
          activeTab === "up"
            ? "bg-blue-500 text-white shadow-md transform scale-105"
            : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
        }`}
        onClick={() => setActiveTab(Direction.Up)}
      >
        <MdArrowUpward className="w-4 h-4 inline mr-1" />
        上り
      </button>
      <button
        className={`flex-1 py-3 px-6 text-center font-medium rounded-md transition-all duration-200 ml-1 ${
          activeTab === "down"
            ? "bg-green-500 text-white shadow-md transform scale-105"
            : "text-gray-600 hover:bg-white hover:text-green-600 hover:shadow-sm"
        }`}
        onClick={() => setActiveTab(Direction.Down)}
      >
        <MdArrowDownward className="w-4 h-4 inline mr-1" />
        下り
      </button>
    </div>
  );
};
