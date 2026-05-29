import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppMuiProvider } from "@/components/providers/AppMuiProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaius — Investimentos",
  description: "Dashboard de investimentos e mercado",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body className={plusJakarta.className}>
        <AppMuiProvider>{children}</AppMuiProvider>
      </body>
    </html>
  );
}
