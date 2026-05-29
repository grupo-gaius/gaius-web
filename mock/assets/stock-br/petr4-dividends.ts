import type { AssetDividendsData } from "@/types/asset-detail";

export const petr4Dividends: AssetDividendsData = {
  yearlyYield: [
    { year: 2019, yieldPct: 3.2 },
    { year: 2020, yieldPct: 2.9 },
    { year: 2021, yieldPct: 18.6 },
    { year: 2022, yieldPct: 42.8 },
    { year: 2023, yieldPct: 12.4 },
    { year: 2024, yieldPct: 9.1 },
    { year: 2025, yieldPct: 7.35 },
  ],
  payments: [
    {
      id: "1",
      type: "JCP",
      comDate: "22/05/2025",
      paymentDate: "05/06/2025",
      valuePerShare: 0.67,
    },
    {
      id: "2",
      type: "Dividendo",
      comDate: "13/03/2025",
      paymentDate: "20/03/2025",
      valuePerShare: 0.54,
    },
    {
      id: "3",
      type: "JCP",
      comDate: "20/12/2024",
      paymentDate: "23/12/2024",
      valuePerShare: 0.72,
    },
    {
      id: "4",
      type: "Dividendo",
      comDate: "14/11/2024",
      paymentDate: "21/11/2024",
      valuePerShare: 0.53,
    },
    {
      id: "5",
      type: "JCP",
      comDate: "22/08/2024",
      paymentDate: "05/09/2024",
      valuePerShare: 0.48,
    },
    {
      id: "6",
      type: "Dividendo",
      comDate: "14/05/2024",
      paymentDate: "23/05/2024",
      valuePerShare: 0.55,
    },
    {
      id: "7",
      type: "JCP",
      comDate: "21/02/2024",
      paymentDate: "07/03/2024",
      valuePerShare: 0.51,
    },
    {
      id: "8",
      type: "Dividendo",
      comDate: "30/11/2023",
      paymentDate: "22/12/2023",
      valuePerShare: 1.02,
    },
  ],
};
