import { MdHourglassEmpty } from "react-icons/md";

export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="animate-spin mb-4">
        <MdHourglassEmpty className="w-8 h-8 text-blue-500" />
      </div>
      <p className="text-gray-600 text-lg">時刻表を読み込み中...</p>
      <p className="text-gray-400 text-sm mt-2">少々お待ちください</p>
    </div>
  );
};
