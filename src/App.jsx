import React, { useEffect, useState } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
} from "@mui/material";
import RobotScene from "./components/RobotScene";
import UIOverlay from "./components/UIOverlay";
import { findPerson, fullName, getSlugFromUrl } from "./people";

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

const person = findPerson(getSlugFromUrl());

function CardNotFound() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Namecard not found
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        Please scan the QR code on the namecard again.
      </Typography>
    </Box>
  );
}

function App() {
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    if (person) document.title = `${fullName(person)} | AR Namecard`;
  }, []);

  const handleTargetFound = () => {
    console.log("App: Target Found");
    setHasScanned(true);
  };

  const handleTargetLost = () => {
    console.log("App: Target Lost");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {person ? (
        <Box
          sx={{
            width: "100vw",
            height: "100dvh",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <RobotScene
            targetIndex={person.targetIndex}
            onTargetFound={handleTargetFound}
            onTargetLost={handleTargetLost}
          />

          <UIOverlay visible={hasScanned} person={person} />
        </Box>
      ) : (
        <CardNotFound />
      )}
    </ThemeProvider>
  );
}

export default App;
