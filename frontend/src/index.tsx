import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme.ts";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();