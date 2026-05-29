"use client";

import Search from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import type { Asset } from "@/types/assets";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type AssetSearchFieldProps = {
  barOnDark?: boolean;
  /** Largura mínima do campo (útil na faixa mobile da AppBar). */
  minWidth?: number | string;
};

export function AssetSearchField({ barOnDark = false, minWidth = 200 }: AssetSearchFieldProps) {
  const router = useRouter();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading } = useAssetSearch(query);

  const trimmed = query.trim();
  const showDropdown = open && trimmed.length > 0;
  const fieldColor = barOnDark ? "rgba(255,255,255,0.88)" : undefined;
  const fieldBorder = barOnDark ? "rgba(255,255,255,0.22)" : undefined;

  function handleSelect(asset: Asset) {
    setQuery(asset.symbol);
    setOpen(false);
    router.push(`/home/ativo/${encodeURIComponent(asset.symbol)}`);
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ position: "relative", minWidth, flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Buscar ativo…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Buscar ativos"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 20, color: "primary.main" }} aria-hidden />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={16} color="inherit" aria-label="Buscando" />
              </InputAdornment>
            ) : undefined,
            sx: {
              borderRadius: 2,
              fontSize: "0.875rem",
              color: fieldColor,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorder,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: barOnDark ? "rgba(255,255,255,0.4)" : undefined,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-input::placeholder": {
              color: barOnDark ? "rgba(255,255,255,0.5)" : undefined,
              opacity: 1,
            },
          }}
        />

        <Popper
          open={showDropdown}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: (t) => t.zIndex.modal + 1, width: anchorRef.current?.offsetWidth ?? minWidth }}
        >
          <Paper
            elevation={6}
            sx={{
              mt: 0.5,
              borderRadius: 2,
              overflow: "hidden",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {results.length === 0 && !loading ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
                Nenhum ativo encontrado para &quot;{trimmed}&quot;
              </Typography>
            ) : (
              <List dense disablePadding role="listbox" aria-label="Resultados da busca">
                {results.map((asset) => (
                  <ListItemButton key={asset.id} onClick={() => handleSelect(asset)} role="option">
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                          <Typography component="span" variant="body2" fontWeight={800}>
                            {asset.symbol}
                          </Typography>
                          {asset.price > 0 ? (
                            <Typography component="span" variant="caption" color="text.secondary">
                              {BRL.format(asset.price)}
                            </Typography>
                          ) : null}
                        </Box>
                      }
                      secondary={asset.name}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
