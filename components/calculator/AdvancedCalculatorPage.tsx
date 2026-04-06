"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DashboardAppBar } from "@/components/home/dashboard/DashboardAppBar";
import { DashboardFooter } from "@/components/home/dashboard/DashboardFooter";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  cdiGrossReturn,
  compoundInterest,
  emergencyFund,
  monthsToReachTarget,
  percentageOf,
  percentChange,
  simpleInterest,
  whatPercentIs,
} from "@/lib/advanced-calculator";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUM = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const FIRST_MILLION = 1_000_000;

function parseBrNumber(raw: string): number {
  const t = raw.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}

const TAB_DEFS = [
  { id: "compound", label: "Juros compostos" },
  { id: "simple", label: "Juros simples" },
  { id: "million", label: "Primeiro milhão" },
  { id: "percent", label: "Porcentagem" },
  { id: "emergency", label: "Reserva de emergência" },
  { id: "cdi", label: "CDI" },
] as const;

type PercentMode = "of" | "what" | "delta";

export function AdvancedCalculatorPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { user, loading: profileLoading } = useProfile(isAuthenticated);
  const [tab, setTab] = useState(0);

  const [compoundPv, setCompoundPv] = useState("10000");
  const [compoundRate, setCompoundRate] = useState("0,8");
  const [compoundMonths, setCompoundMonths] = useState("120");
  const [compoundPmt, setCompoundPmt] = useState("500");

  const [simpleC, setSimpleC] = useState("10000");
  const [simpleRate, setSimpleRate] = useState("1");
  const [simpleMonths, setSimpleMonths] = useState("12");

  const [millionPv, setMillionPv] = useState("0");
  const [millionPmt, setMillionPmt] = useState("2000");
  const [millionRate, setMillionRate] = useState("0,7");

  const [percentMode, setPercentMode] = useState<PercentMode>("of");
  const [pctA, setPctA] = useState("10");
  const [pctB, setPctB] = useState("1000");
  const [pctFrom, setPctFrom] = useState("100");
  const [pctTo, setPctTo] = useState("115");

  const [emerExpense, setEmerExpense] = useState("5000");
  const [emerMonths, setEmerMonths] = useState("6");

  const [cdiCapital, setCdiCapital] = useState("10000");
  const [cdiAnnual, setCdiAnnual] = useState("11");
  const [cdiShare, setCdiShare] = useState("100");
  const [cdiDays, setCdiDays] = useState("252");

  function handleLogout() {
    logout();
    router.replace("/home");
  }

  const compoundResult = useMemo(() => {
    const r = compoundInterest(parseBrNumber(compoundPv), parseBrNumber(compoundRate), parseBrNumber(compoundMonths), parseBrNumber(compoundPmt));
    return r;
  }, [compoundPv, compoundRate, compoundMonths, compoundPmt]);

  const simpleResult = useMemo(() => {
    return simpleInterest(parseBrNumber(simpleC), parseBrNumber(simpleRate), parseBrNumber(simpleMonths));
  }, [simpleC, simpleRate, simpleMonths]);

  const millionResult = useMemo(() => {
    return monthsToReachTarget(parseBrNumber(millionPv), parseBrNumber(millionPmt), parseBrNumber(millionRate), FIRST_MILLION);
  }, [millionPv, millionPmt, millionRate]);

  const percentResult = useMemo(() => {
    if (percentMode === "of") {
      return { type: "of" as const, value: percentageOf(parseBrNumber(pctB), parseBrNumber(pctA)) };
    }
    if (percentMode === "what") {
      return { type: "what" as const, value: whatPercentIs(parseBrNumber(pctA), parseBrNumber(pctB)) };
    }
    return { type: "delta" as const, value: percentChange(parseBrNumber(pctFrom), parseBrNumber(pctTo)) };
  }, [percentMode, pctA, pctB, pctFrom, pctTo]);

  const emerResult = useMemo(() => {
    return emergencyFund(parseBrNumber(emerExpense), parseBrNumber(emerMonths));
  }, [emerExpense, emerMonths]);

  const cdiResult = useMemo(() => {
    return cdiGrossReturn(parseBrNumber(cdiCapital), parseBrNumber(cdiAnnual), parseBrNumber(cdiShare), parseBrNumber(cdiDays));
  }, [cdiCapital, cdiAnnual, cdiShare, cdiDays]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardAppBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        userName={user?.name}
        userEmail={user?.email}
        profileLoading={profileLoading}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          pt: { xs: "108px", sm: "64px" },
          pb: 0,
          overflowX: "hidden",
        }}
      >
        <Box sx={{ flex: 1, pb: 4 }}>
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Button
            component={Link}
            href="/home"
            startIcon={<ArrowBack />}
            color="inherit"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Voltar ao início
          </Button>

          <Typography variant="h4" component="h1" fontWeight={800} sx={{ mb: 0.5, letterSpacing: "-0.02em" }}>
            Calculadora avançada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Simule juros, meta de patrimônio, porcentagens, reserva e rendimento em CDI (aproximação com 252 dias úteis).
          </Typography>

          <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 1,
                [`& .MuiTab-root`]: { fontWeight: 700, minHeight: 48, textTransform: "none" },
              }}
            >
              {TAB_DEFS.map((t, i) => (
                <Tab key={t.id} label={t.label} value={i} />
              ))}
            </Tabs>

            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {tab === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montante com capital inicial, taxa mensal e aportes no fim de cada mês.
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField label="Capital inicial" value={compoundPv} onChange={(e) => setCompoundPv(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="Taxa ao mês (%)" value={compoundRate} onChange={(e) => setCompoundRate(e.target.value)} />
                    <TextField label="Prazo (meses)" value={compoundMonths} onChange={(e) => setCompoundMonths(e.target.value)} type="text" />
                    <TextField label="Aporte mensal" value={compoundPmt} onChange={(e) => setCompoundPmt(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                  </Box>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Montante final: {BRL.format(compoundResult.futureValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de juros (ganho sobre o que foi colocado): {BRL.format(compoundResult.interestEarned)}
                  </Typography>
                </Box>
              )}

              {tab === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Juros não se capitalizam; a taxa incide sempre sobre o capital inicial.
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField label="Capital" value={simpleC} onChange={(e) => setSimpleC(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="Taxa ao mês (%)" value={simpleRate} onChange={(e) => setSimpleRate(e.target.value)} />
                    <TextField label="Tempo (meses)" value={simpleMonths} onChange={(e) => setSimpleMonths(e.target.value)} sx={{ gridColumn: { sm: "span 2" } }} />
                  </Box>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Juros: {BRL.format(simpleResult.interest)} · Montante: {BRL.format(simpleResult.amount)}
                  </Typography>
                </Box>
              )}

              {tab === 2 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Em quanto tempo você atinge <strong>R$ 1.000.000</strong> com patrimônio atual, aporte mensal e taxa composta ao mês (projeção teórica).
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField label="Patrimônio hoje" value={millionPv} onChange={(e) => setMillionPv(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="Aporte mensal" value={millionPmt} onChange={(e) => setMillionPmt(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="Rentabilidade ao mês (%)" value={millionRate} onChange={(e) => setMillionRate(e.target.value)} sx={{ gridColumn: { sm: "span 2" } }} />
                  </Box>
                  <Divider />
                  {millionResult === null ? (
                    <Typography color="error.main" variant="body2">
                      Com esses números não dá para chegar a um milhão em até 100 anos de simulação (aumente aporte ou rentabilidade).
                    </Typography>
                  ) : millionResult === 0 ? (
                    <Typography variant="subtitle1" fontWeight={800}>
                      Patrimônio atual já atinge ou supera R$ 1.000.000.
                    </Typography>
                  ) : (
                    <Typography variant="subtitle1" fontWeight={800}>
                      Prazo estimado: {millionResult} meses ({Math.floor(millionResult / 12)} anos e {millionResult % 12} meses)
                    </Typography>
                  )}
                </Box>
              )}

              {tab === 3 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <ToggleButtonGroup
                    exclusive
                    value={percentMode}
                    onChange={(_, v) => v && setPercentMode(v)}
                    size="small"
                    sx={{ flexWrap: "wrap", gap: 0.5 }}
                  >
                    <ToggleButton value="of">% de um valor</ToggleButton>
                    <ToggleButton value="what">Parte em % do total</ToggleButton>
                    <ToggleButton value="delta">Variação %</ToggleButton>
                  </ToggleButtonGroup>

                  {percentMode === "of" && (
                    <>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <TextField label="Porcentagem (%)" value={pctA} onChange={(e) => setPctA(e.target.value)} />
                        <TextField label="Do valor (R$)" value={pctB} onChange={(e) => setPctB(e.target.value)} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Resultado: {BRL.format(percentResult.type === "of" ? percentResult.value : 0)}
                      </Typography>
                    </>
                  )}

                  {percentMode === "what" && (
                    <>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <TextField label="Parte" value={pctA} onChange={(e) => setPctA(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                        <TextField label="Total" value={pctB} onChange={(e) => setPctB(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {percentResult.type === "what" && Number.isFinite(percentResult.value)
                          ? `Representa ${NUM.format(percentResult.value)}% do total`
                          : "Total não pode ser zero."}
                      </Typography>
                    </>
                  )}

                  {percentMode === "delta" && (
                    <>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                        <TextField label="Valor inicial" value={pctFrom} onChange={(e) => setPctFrom(e.target.value)} />
                        <TextField label="Valor final" value={pctTo} onChange={(e) => setPctTo(e.target.value)} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {percentResult.type === "delta" && Number.isFinite(percentResult.value)
                          ? `Variação de ${NUM.format(percentResult.value)}%`
                          : "Valor inicial não pode ser zero."}
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              {tab === 4 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Multiplique seu gasto mensal essencial pelo número de meses de colchão (regra comum: 6 a 12 meses).
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField label="Gastos mensais estimados" value={emerExpense} onChange={(e) => setEmerExpense(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="Meses de cobertura" value={emerMonths} onChange={(e) => setEmerMonths(e.target.value)} />
                  </Box>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Reserva sugerida: {BRL.format(emerResult)}
                  </Typography>
                </Box>
              )}

              {tab === 5 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rendimento bruto aproximado: taxa anual efetiva = CDI × (% do CDI), capitalização diária com base em 252 dias úteis. Não considera IOF/IR; use como referência educacional.
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField label="Capital" value={cdiCapital} onChange={(e) => setCdiCapital(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
                    <TextField label="CDI ao ano (%)" value={cdiAnnual} onChange={(e) => setCdiAnnual(e.target.value)} />
                    <TextField label="% do CDI do investimento" value={cdiShare} onChange={(e) => setCdiShare(e.target.value)} />
                    <TextField label="Dias úteis" value={cdiDays} onChange={(e) => setCdiDays(e.target.value)} />
                  </Box>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight={800}>
                    Rendimento bruto no período: {BRL.format(cdiResult)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saldo final aproximado: {BRL.format(parseBrNumber(cdiCapital) + cdiResult)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          </Container>
        </Box>

        <DashboardFooter />
      </Box>
    </Box>
  );
}
