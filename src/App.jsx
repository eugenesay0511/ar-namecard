import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ARScene from "./components/ARScene";
import UIOverlay from "./components/UIOverlay";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
    },
    background: {
      default: "#000000",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Auto-launching AR immediately
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <ARScene />
      </Box>
    </ThemeProvider>
  );
}

export default App;
