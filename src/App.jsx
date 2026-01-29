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
  const [started, setStarted] = useState(false);

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
        {!started ? (
          <Container
            maxWidth="sm"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              zIndex: 20,
              position: "relative",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                background:
                  "-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AR Namecard
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "#aaa" }}>
              Experience the future of business cards. Scan the marker to unlock
              interactive content.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setStarted(true)}
              sx={{
                borderRadius: 50,
                paddingX: 4,
                paddingY: 1.5,
                fontSize: "1.2rem",
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              }}
            >
              Launch AR
            </Button>
          </Container>
        ) : (
          <>
            <ARScene />
            {/* <UIOverlay /> */}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => window.location.reload()}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1000,
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              Stop
            </Button>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
