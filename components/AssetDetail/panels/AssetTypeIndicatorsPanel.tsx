import type { AssetDetailData } from "@/types/asset-detail";
import { isStockBrAsset } from "@/types/asset-detail";
import { AssetTypePlaceholderPanel } from "@/components/AssetDetail/panels/AssetTypePlaceholderPanel";
import { StockBrIndicatorsPanel } from "@/components/AssetDetail/panels/StockBrIndicatorsPanel";

type AssetTypeIndicatorsPanelProps = {
  asset: AssetDetailData;
};

/** Escolhe o painel de indicadores conforme o tipo do ativo. */
export function AssetTypeIndicatorsPanel({ asset }: AssetTypeIndicatorsPanelProps) {
  if (isStockBrAsset(asset)) {
    return <StockBrIndicatorsPanel indicators={asset.indicators} />;
  }
  return <AssetTypePlaceholderPanel type={asset.type} />;
}
