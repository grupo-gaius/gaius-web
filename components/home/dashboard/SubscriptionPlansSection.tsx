"use client";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SubscriptionPlan } from "@/utils/mock-dashboard-data";

type SubscriptionPlansSectionProps = {
  plans: SubscriptionPlan[];
};

export function SubscriptionPlansSection({ plans }: SubscriptionPlansSectionProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 0 },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip label="Planos" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
        <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
          Escolha como acompanhar o mercado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 520, mx: "auto" }}>
          Visualização estática dos tiers — botões sem ação até integração com pagamentos.
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => (
          <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={plan.emphasized ? 8 : 2}
              sx={{
                height: "100%",
                borderRadius: 3,
                position: "relative",
                border: 2,
                borderColor: plan.emphasized ? "primary.main" : "divider",
                transform: plan.emphasized ? { md: "scale(1.03)" } : undefined,
                transition: "box-shadow 0.2s, transform 0.2s",
                bgcolor: "background.paper",
              }}
            >
              {plan.emphasized ? (
                <Chip
                  label="Mais popular"
                  color="primary"
                  size="small"
                  sx={{ position: "absolute", top: 16, right: 16, fontWeight: 800 }}
                />
              ) : null}
              <CardContent sx={{ p: 3, pt: plan.emphasized ? 4 : 3 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                  {plan.name}
                </Typography>
                <Typography variant="h4" fontWeight={900} color="primary.dark" sx={{ my: 1 }}>
                  {plan.priceLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {plan.description}
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {plan.features.map((f) => (
                    <Stack direction="row" spacing={1} key={f} alignItems="flex-start">
                      <CheckCircleOutline color="primary" fontSize="small" sx={{ mt: 0.25 }} />
                      <Typography variant="body2">{f}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant={plan.emphasized ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  disableElevation
                  sx={{ borderRadius: 2, fontWeight: 800, py: 1.25 }}
                  onClick={(e) => e.preventDefault()}
                >
                  {plan.emphasized ? "Começar agora" : "Saiba mais"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
