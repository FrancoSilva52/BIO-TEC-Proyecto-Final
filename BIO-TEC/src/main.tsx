import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BIO_TEC_THEME } from './const/colorPalette.const';
import App from "./App";
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={BIO_TEC_THEME}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
