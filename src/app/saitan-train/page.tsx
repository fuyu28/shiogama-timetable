'use client';

import { SaitanTrainViewer } from '@/components/SaitanTrainViewer';

export default function SaitanTrainPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">最短電車検索</h1>
      <SaitanTrainViewer />
    </div>
  );
}