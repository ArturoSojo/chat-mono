"use client";
import { ReactNode, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getTheme } from "@/lib/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light"|"dark">("light");
  const theme = useMemo(()=>getTheme(mode),[mode]);
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* TODO: toggle para cambiar mode */}
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
