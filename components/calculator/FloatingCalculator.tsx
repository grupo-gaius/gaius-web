"use client";

import Calculate from "@mui/icons-material/Calculate";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useState } from "react";

type Op = "+" | "-" | "×" | "÷";

function applyOp(a: number, op: Op, b: number): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

/** Símbolos no prompt (sem ×/÷ duplicando o visual das teclas). */
function opInPrompt(o: Op): string {
  switch (o) {
    case "×":
      return "x";
    case "÷":
      return "/";
    default:
      return o;
  }
}

function parseSeg(s: string): number {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "Erro";
  const str = String(n);
  if (str.length > 14) return n.toExponential(4).replace(".", ",");
  return str.replace(".", ",");
}

function appendDigit(seg: string, d: string): string {
  if (seg === "0" && d !== ",") return d;
  if (d === "0" && seg === "0") return "0";
  if (seg.length >= 14) return seg;
  return seg + d;
}

function appendComma(seg: string): string {
  if (seg.includes(",") || seg.includes(".")) return seg;
  if (seg === "" || seg === "0") return "0,";
  return seg + ",";
}

const BTN_SX = {
  minWidth: 0,
  height: 48,
  fontSize: "1.1rem",
  fontWeight: 700,
  borderRadius: 2,
} as const;

function CalcPadButton({
  label,
  onClick,
  color = "default",
  compact,
}: {
  label: string;
  onClick: () => void;
  color?: "default" | "primary" | "secondary";
  /** Rótulos longos (ex.: 1/x, x²) em fonte menor. */
  compact?: boolean;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        ...BTN_SX,
        fontSize: compact ? "0.9rem" : BTN_SX.fontSize,
        border: 1,
        borderColor: "divider",
        bgcolor:
          color === "primary" ? "primary.main" : color === "secondary" ? "action.hover" : "background.paper",
        color: color === "primary" ? "primary.contrastText" : "text.primary",
        cursor: "pointer",
        fontFamily: "inherit",
        "&:hover": {
          filter: "brightness(0.95)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      {label}
    </Box>
  );
}

const MAX_HISTORY = 8;

export function FloatingCalculator() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [a, setA] = useState("0");
  const [op, setOp] = useState<Op | null>(null);
  const [b, setB] = useState("");
  /** Após "=": `a` é o resultado até começar nova conta. */
  const [afterEquals, setAfterEquals] = useState(false);

  const mainPrompt = useMemo(() => {
    if (a === "Erro") return "Erro";
    if (op === null) return a;
    if (b === "") return `${a}${opInPrompt(op)}`;
    return `${a}${opInPrompt(op)}${b}`;
  }, [a, op, b]);

  const resetEntry = useCallback(() => {
    setA("0");
    setOp(null);
    setB("");
    setAfterEquals(false);
  }, []);

  const onDigit = (d: string) => {
    if (a === "Erro") resetEntry();
    if (afterEquals) {
      setA(d === "," ? "0," : d);
      setOp(null);
      setB("");
      setAfterEquals(false);
      return;
    }
    if (op === null) {
      setA((prev) => appendDigit(prev, d));
      return;
    }
    setB((prev) => (prev === "" ? (d === "," ? "0," : d) : appendDigit(prev, d)));
  };

  const onComma = () => {
    if (a === "Erro") resetEntry();
    if (afterEquals) {
      setA("0,");
      setOp(null);
      setB("");
      setAfterEquals(false);
      return;
    }
    if (op === null) {
      setA((prev) => appendComma(prev));
      return;
    }
    setB((prev) => (prev === "" ? "0," : appendComma(prev)));
  };

  const onOp = (newOp: Op) => {
    if (a === "Erro") return;
    if (afterEquals) {
      setOp(newOp);
      setB("");
      setAfterEquals(false);
      return;
    }
    if (op !== null && b !== "") {
      const left = parseSeg(a);
      const right = parseSeg(b);
      const res = applyOp(left, op, right);
      if (!Number.isFinite(res)) {
        resetEntry();
        setA("Erro");
        return;
      }
      setA(formatNum(res));
      setOp(newOp);
      setB("");
      return;
    }
    if (op !== null && b === "") {
      setOp(newOp);
      return;
    }
    setOp(newOp);
    setB("");
  };

  const onEquals = () => {
    if (a === "Erro" || op === null || b === "") return;
    const left = parseSeg(a);
    const right = parseSeg(b);
    const res = applyOp(left, op, right);
    if (!Number.isFinite(res)) {
      resetEntry();
      setA("Erro");
      return;
    }
    const expr = `${a}${opInPrompt(op)}${b}`;
    const line = `${expr}=${formatNum(res)}`;
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), line]);
    setA(formatNum(res));
    setOp(null);
    setB("");
    setAfterEquals(true);
  };

  const onClear = () => resetEntry();

  /** CE: limpa a entrada atual (estilo Calculadora do Windows). */
  const onClearEntry = () => {
    if (a === "Erro") {
      resetEntry();
      return;
    }
    if (b !== "") {
      setB("");
      return;
    }
    if (afterEquals) {
      setA("0");
      setAfterEquals(false);
      return;
    }
    if (op !== null) {
      setOp(null);
      setB("");
      return;
    }
    setA("0");
  };

  /**
   * % no estilo Windows: só número → divide por 100;
   * com +/− o segundo operando vira (primeiro × segundo ÷ 100);
   * com ×/÷ o segundo vira segundo ÷ 100.
   */
  const onPercent = () => {
    if (a === "Erro") return;
    const left = parseSeg(a);
    if (op === null || afterEquals) {
      setA(formatNum(left / 100));
      setOp(null);
      setB("");
      setAfterEquals(false);
      return;
    }
    if (b === "") return;
    const right = parseSeg(b);
    if (op === "+" || op === "-") {
      setB(formatNum((left * right) / 100));
    } else {
      setB(formatNum(right / 100));
    }
    setAfterEquals(false);
  };

  const applyUnary = (fn: (n: number) => number) => {
    if (a === "Erro") return;
    if (op !== null && b !== "") {
      const n = parseSeg(b);
      const r = fn(n);
      if (!Number.isFinite(r)) {
        resetEntry();
        setA("Erro");
        return;
      }
      setB(formatNum(r));
      setAfterEquals(false);
      return;
    }
    const n = parseSeg(a);
    const r = fn(n);
    if (!Number.isFinite(r)) {
      resetEntry();
      setA("Erro");
      return;
    }
    setA(formatNum(r));
    setOp(null);
    setB("");
    setAfterEquals(false);
  };

  const onNegate = () => {
    if (a === "Erro") return;
    if (op !== null && b !== "") {
      setB((prev) => formatNum(-parseSeg(prev)));
      setAfterEquals(false);
      return;
    }
    if (op !== null && b === "") {
      setA((prev) => formatNum(-parseSeg(prev)));
      setAfterEquals(false);
      return;
    }
    setA((prev) => formatNum(-parseSeg(prev)));
    setOp(null);
    setB("");
    setAfterEquals(false);
  };

  const onBackspace = () => {
    if (a === "Erro") {
      resetEntry();
      return;
    }
    if (afterEquals) {
      setAfterEquals(false);
      setA((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      return;
    }
    if (op !== null && b !== "") {
      setB((prev) => {
        const next = prev.slice(0, -1);
        return next;
      });
      return;
    }
    if (op !== null && b === "") {
      setOp(null);
      return;
    }
    setA((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 24 },
        bottom: { xs: 16, sm: 24 },
        zIndex: (t) => t.zIndex.tooltip + 2,
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        gap: 1.5,
      }}
    >
      <Fab
        color="primary"
        aria-label={open ? "Fechar calculadora" : "Abrir calculadora"}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {open ? <Close /> : <Calculate />}
      </Fab>

      <Slide in={open} direction="up" timeout={280} mountOnEnter unmountOnExit>
        <Paper
          elevation={12}
          sx={{
            width: { xs: "min(100vw - 32px, 280px)", sm: 280 },
            p: 2,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 1.5 }}>
            Calculadora
          </Typography>

          {history.length > 0 ? (
            <Box
              sx={{
                mb: 1,
                maxHeight: 72,
                overflowY: "auto",
                px: 0.5,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                borderBottom: 1,
                borderColor: "divider",
                pb: 1,
              }}
            >
              {history.map((line, i) => (
                <Typography
                  key={`${line}-${i}`}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontVariantNumeric: "tabular-nums",
                    textAlign: "right",
                    lineHeight: 1.35,
                    wordBreak: "break-all",
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Box>
          ) : null}

          <Box
            sx={{
              mb: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 2,
              bgcolor: "action.hover",
              border: 1,
              borderColor: "divider",
              textAlign: "right",
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontVariantNumeric: "tabular-nums",
                wordBreak: "break-all",
                lineHeight: 1.25,
                width: "100%",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {mainPrompt}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gridTemplateRows: "repeat(6, 1fr)",
              gap: 0.75,
            }}
          >
            {/* Linha 1 — igual à calculadora padrão do Windows */}
            <CalcPadButton label="%" onClick={onPercent} color="secondary" />
            <CalcPadButton label="CE" onClick={onClearEntry} color="secondary" />
            <CalcPadButton label="C" onClick={onClear} color="secondary" />
            <CalcPadButton label="⌫" onClick={onBackspace} color="secondary" />

            <CalcPadButton
              label="1/x"
              onClick={() => applyUnary((n) => (n === 0 ? NaN : 1 / n))}
              color="secondary"
              compact
            />
            <CalcPadButton label="x²" onClick={() => applyUnary((n) => n * n)} color="secondary" compact />
            <CalcPadButton label="√" onClick={() => applyUnary((n) => (n < 0 ? NaN : Math.sqrt(n)))} color="secondary" />
            <CalcPadButton label="÷" onClick={() => onOp("÷")} color="secondary" />

            <CalcPadButton label="7" onClick={() => onDigit("7")} />
            <CalcPadButton label="8" onClick={() => onDigit("8")} />
            <CalcPadButton label="9" onClick={() => onDigit("9")} />
            <CalcPadButton label="×" onClick={() => onOp("×")} color="secondary" />

            <CalcPadButton label="4" onClick={() => onDigit("4")} />
            <CalcPadButton label="5" onClick={() => onDigit("5")} />
            <CalcPadButton label="6" onClick={() => onDigit("6")} />
            <CalcPadButton label="−" onClick={() => onOp("-")} color="secondary" />

            <CalcPadButton label="1" onClick={() => onDigit("1")} />
            <CalcPadButton label="2" onClick={() => onDigit("2")} />
            <CalcPadButton label="3" onClick={() => onDigit("3")} />
            <CalcPadButton label="+" onClick={() => onOp("+")} color="secondary" />

            <CalcPadButton label="±" onClick={onNegate} color="secondary" />
            <CalcPadButton label="0" onClick={() => onDigit("0")} />
            <CalcPadButton label="," onClick={onComma} />
            <CalcPadButton label="=" onClick={onEquals} color="primary" />
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
}
