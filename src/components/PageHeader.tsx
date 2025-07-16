import Link from "next/link";
import { useAtomValue } from "jotai";
import { IoMdArrowBack } from "react-icons/io";
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
    <header className="sticky top-0 bg-white shadow">
      <div className="flex items-center justify-between">
        {showBackButton && backHref && (
          <Link href={backHref}>
            <IoMdArrowBack />
          </Link>
        )}
        <h1>{title}</h1>
        <div>現在時刻: {formatTimeHHMM(currentTime)}</div>
      </div>
    </header>
  );
};
