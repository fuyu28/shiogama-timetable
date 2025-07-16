import Link from "next/link";
import { useAtomValue } from "jotai";
import { IoMdArrowBack } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { useFormat } from "@/hooks/useFormat";

type PageHeaderProps = {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
};

export const PageHeader = ({
  title,
  showBackButton,
  backHref,
}: PageHeaderProps) => {
  const currentTime = useAtomValue(currentTimeAtom);
  const { formatTimeHHMM } = useFormat();

  return (
    <header className="sticky top-0 bg-blue-600 text-white shadow-lg z-10">
      <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        {showBackButton && backHref ? (
          <Link 
            href={backHref}
            className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
          >
            <IoMdArrowBack className="w-5 h-5" />
          </Link>
        ) : (
          <div className="w-10 h-10" />
        )}
        
        <h1 className="text-xl font-bold text-center flex-1">{title}</h1>
        
        <div className="flex items-center bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
          <MdAccessTime className="w-4 h-4 mr-1" />
          <span suppressHydrationWarning>{formatTimeHHMM(currentTime)}</span>
        </div>
      </div>
    </header>
  );
};
