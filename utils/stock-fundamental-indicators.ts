/** Rótulos dos indicadores fundamentalistas para ações (B3). */
export const STOCK_BR_FUNDAMENTAL_INDICATORS = [
  "P/L",
  "P/Receita (PSR)",
  "P/VP",
  "Dividend Yield",
  "Payout",
  "Margem Líquida",
  "Margem Bruta",
  "Margem Ebit",
  "Margem Ebitda",
  "EV/Ebitda",
  "EV/Ebit",
  "P/Ebitda",
  "P/Ebit",
  "P/Ativo",
  "P/Cap.Giro",
  "P/Ativo Circ. Liq.",
  "VPA",
  "LPA",
  "Giro Ativos",
  "ROE",
  "ROIC",
  "ROA",
  "Dívida Líquida / Patrimônio",
  "Dívida Líquida / Ebitda",
  "Dívida Líquida / Ebit",
  "Dívida Bruta / Patrimônio",
  "Patrimônio / Ativos",
  "Passivos / Ativos",
  "Liquidez Corrente",
  "CAGR Receitas 5 anos",
  "CAGR Lucros 5 anos",
] as const;

export type StockFundamentalIndicatorLabel = (typeof STOCK_BR_FUNDAMENTAL_INDICATORS)[number];

export type FundamentalIndicatorItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function parseIndicatorNumber(value: string): number | null {
  const n = parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function isFundamentalIndicatorHighlighted(
  label: string,
  value: string,
  highlight?: boolean,
): boolean {
  if (highlight) return true;
  if (label === "Dividend Yield") {
    return (parseIndicatorNumber(value) ?? 0) > 6;
  }
  return false;
}
