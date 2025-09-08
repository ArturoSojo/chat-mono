"use client";
import { ReactNode} from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "./index.css";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
                {/* TODO: toggle para cambiar mode */}
            {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
