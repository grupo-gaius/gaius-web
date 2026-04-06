"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FOOTER_COLUMNS, SOCIAL_LABELS } from "@/utils/mock-dashboard-data";

export function DashboardFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "grey.900",
        color: "grey.100",
        pt: { xs: 4, md: 6 },
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {FOOTER_COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle2" fontWeight={800} color="primary.light" gutterBottom>
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.links.map((text) => (
                  <Link
                    key={text}
                    href="#"
                    underline="hover"
                    color="grey.300"
                    onClick={(e) => e.preventDefault()}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {text}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "grey.800" }}
        >
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} Gaius. Mockup visual — dados ilustrativos.
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {SOCIAL_LABELS.map((label) => (
              <IconButton
                key={label}
                size="small"
                aria-label={label}
                sx={{ color: "grey.400", "&:hover": { color: "primary.light" } }}
                onClick={(e) => e.preventDefault()}
              >
                <Typography variant="caption" fontWeight={700}>
                  {label.slice(0, 2)}
                </Typography>
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
