"use client";

import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  useCurrentTime();
  useTrains();

  return <>{children}</>;
};
