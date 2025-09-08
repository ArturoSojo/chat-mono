"use client";
import { createTheme } from "@mui/material/styles";
export const getTheme = (mode: "light" | "dark") =>
  createTheme({ palette: { mode, primary: { main: "#7f00b2" } } });
