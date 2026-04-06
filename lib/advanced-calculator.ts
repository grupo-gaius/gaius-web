/** Fórmulas dos simuladores da calculadora avançada (valores em unidade monetária ou taxas decimais conforme o caso). */

const MONTHS_FIRST_MILLION_CAP = 1200;

export function compoundInterest(
  principal: number,
  monthlyRatePct: number,
  months: number,
  monthlyPayment: number,
): { futureValue: number; interestEarned: number } {
  const i = monthlyRatePct / 100;
  const p = Math.max(0, principal);
  const pmt = Math.max(0, monthlyPayment);
  const n = Math.max(0, Math.floor(months));

  let fv: number;
  if (i === 0) {
    fv = p + pmt * n;
  } else {
    const pow = (1 + i) ** n;
    fv = p * pow + pmt * ((pow - 1) / i);
  }

  const contributed = p + pmt * n;
  return { futureValue: fv, interestEarned: fv - contributed };
}

export function simpleInterest(capital: number, ratePctPerMonth: number, months: number): { interest: number; amount: number } {
  const c = Math.max(0, capital);
  const i = ratePctPerMonth / 100;
  const t = Math.max(0, months);
  const j = c * i * t;
  return { interest: j, amount: c + j };
}

/** Meses até atingir `target`, com aportes e taxa mensal. Retorna null se impossível. */
export function monthsToReachTarget(
  currentPatrimony: number,
  monthlyPayment: number,
  monthlyRatePct: number,
  target: number,
): number | null {
  const pv = Math.max(0, currentPatrimony);
  const pmt = Math.max(0, monthlyPayment);
  const i = monthlyRatePct / 100;
  const g = Math.max(0, target);

  if (g <= pv) return 0;
  if (pmt <= 0 && pv < g) return null;
  if (pmt <= 0 && i === 0) return null;

  if (i === 0) {
    const n = Math.ceil((g - pv) / pmt);
    return n >= 0 ? n : null;
  }

  if (pmt === 0) {
    const n = Math.log(g / pv) / Math.log(1 + i);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.ceil(n);
  }

  const fvAt = (n: number) => {
    if (i === 0) return pv + pmt * n;
    const pow = (1 + i) ** n;
    return pv * pow + pmt * ((pow - 1) / i);
  };

  let lo = 0;
  let hi = MONTHS_FIRST_MILLION_CAP;
  if (fvAt(hi) < g) return null;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (fvAt(mid) >= g) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

export function percentageOf(total: number, percent: number): number {
  return (Math.max(0, total) * percent) / 100;
}

export function whatPercentIs(part: number, of: number): number {
  if (of === 0) return NaN;
  return (part / of) * 100;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) return NaN;
  return ((to - from) / from) * 100;
}

export function emergencyFund(monthlyExpense: number, monthsCoverage: number): number {
  return Math.max(0, monthlyExpense) * Math.max(0, monthsCoverage);
}

/**
 * Rendimento bruto aproximado: convenção 252 dias úteis, taxa anual efetiva = CDI × (% do CDI).
 */
export function cdiGrossReturn(capital: number, cdiAnnualPct: number, percentOfCdi: number, businessDays: number): number {
  const pv = Math.max(0, capital);
  const annualDec = ((cdiAnnualPct * percentOfCdi) / 100 / 100);
  if (annualDec <= 0 || businessDays <= 0) return 0;
  const dailyFactor = (1 + annualDec) ** (1 / 252) - 1;
  const factorPeriod = (1 + dailyFactor) ** businessDays;
  return pv * (factorPeriod - 1);
}
