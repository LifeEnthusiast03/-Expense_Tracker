import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme(); 

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  </React.StrictMode>
);
