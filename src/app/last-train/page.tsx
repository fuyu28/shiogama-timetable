"use client";

import { LastTrainViewer } from "@/components/LastTrainViewer";

export default function LastTrainPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">終電情報</h1>
      <LastTrainViewer />
    </div>
  );
}
