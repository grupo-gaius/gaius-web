import type { Asset } from "@/types/api";

const SEED: Omit<Asset, "price" | "changePercent">[] = [
  { id: "1", name: "Ibovespa Futuro", symbol: "WIN" },
  { id: "2", name: "Dólar comercial", symbol: "USD" },
  { id: "3", name: "Ouro spot", symbol: "XAU" },
  { id: "4", name: "Bitcoin", symbol: "BTC" },
  { id: "5", name: "Ethereum", symbol: "ETH" },
];

/** Preços simulados com leve variação a cada atualização (ex.: a cada hora). */
export function buildSimulatedAssets(previous?: Asset[]): Asset[] {
  return SEED.map((base, i) => {
    const prev = previous?.find((a) => a.id === base.id);
    const basePrice = prev?.price ?? 100 + i * 37.42;
    const drift = (Math.random() - 0.5) * 2;
    const price = Math.max(0.01, basePrice * (1 + drift / 100));
    const prevChange = prev?.changePercent ?? (Math.random() - 0.5) * 3;
    const changePercent = prevChange + (Math.random() - 0.5) * 0.5;
    return {
      ...base,
      price: Number(price.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
    };
  });
}
