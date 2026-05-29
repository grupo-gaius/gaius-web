"use client";

import { use } from "react";
import { AssetDetailView } from "@/components/AssetDetail/AssetDetailView";

type AtivoPageProps = {
  params: Promise<{ ticker: string }>;
};

export default function AtivoPage({ params }: AtivoPageProps) {
  const { ticker } = use(params);
  return <AssetDetailView ticker={decodeURIComponent(ticker)} />;
}
