import type { OtherAssetDetail } from "@/types/asset-detail";
import { buildDefaultPriceHistory } from "@/mock/assets/_helpers";

export const kncr11Detail: OtherAssetDetail = {
  ticker: "KNCR11",
  name: "Kinea Rendimentos Imobiliários FII",
  exchange: "B3",
  type: "FII",
  currency: "BRL",
  currentPrice: 104.82,
  variation: 0.28,
  priceHistory: buildDefaultPriceHistory(104.82),
  about:
    "Fundo de papel focado em CRIs e títulos de renda fixa imobiliária, com gestão Kinea. Indicadores específicos de FIIs (DY, vacância, P/VP do fundo) serão exibidos nesta tela em breve.",
  news: [
    { title: "KNCR11 mantém distribuição mensal estável", source: "Funds Explorer", time: "há 3 h" },
    { title: "FIIs de papel atraem fluxo com queda da Selic", source: "Valor", time: "ontem" },
  ],
  stats: { volume: "R$ 18 mi", low52w: "R$ 98,40", high52w: "R$ 108,20", marketCap: "R$ 8,1 bi" },
  ohlc: { open: 104.5, prevClose: 104.53, dayLow: 104.2, dayHigh: 105.1 },
};
