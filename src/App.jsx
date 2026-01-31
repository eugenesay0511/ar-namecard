import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  SmartToy as RobotIcon,
  Science as AtomIcon,
  Business as LogoIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import AtomScene from "./components/AtomScene";
import RobotScene from "./components/RobotScene";
import LogoScene from "./components/LogoScene";
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
  const [currentScene, setCurrentScene] = useState("logo"); // 'logo', 'atom', or 'robot'
  const [targetFound, setTargetFound] = useState(false);

  const handleTargetFound = () => {
    console.log("App: Target Found");
    setTargetFound(true);
  };

  const handleTargetLost = () => {
    console.log("App: Target Lost");
    setTargetFound(false);
  };

  const handleSwitchScene = () => {
    setTargetFound(false);
    setCurrentScene((prev) => {
      if (prev === "atom") return "robot";
      if (prev === "robot") return "logo";
      return "atom";
    });
  };

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
        {currentScene === "atom" && (
          <AtomScene
            onTargetFound={handleTargetFound}
            onTargetLost={handleTargetLost}
          />
        )}
        {currentScene === "robot" && (
          <RobotScene
            onTargetFound={handleTargetFound}
            onTargetLost={handleTargetLost}
          />
        )}
        {currentScene === "logo" && (
          <LogoScene
            onTargetFound={handleTargetFound}
            onTargetLost={handleTargetLost}
          />
        )}

        <UIOverlay visible={targetFound} />

        {/* Improved Scene Selector Bar */}
        <Box
          sx={{
            position: "fixed",
            top: 25,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
          }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                p: 0.5,
                borderRadius: 50,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              {[
                {
                  id: "logo",
                  icon: <LogoIcon fontSize="small" />,
                  label: "Logo",
                },
                {
                  id: "atom",
                  icon: <AtomIcon fontSize="small" />,
                  label: "Atom",
                },
                {
                  id: "robot",
                  icon: <RobotIcon fontSize="small" />,
                  label: "Robot",
                },
              ].map((scene) => (
                <Tooltip key={scene.id} title={scene.label} arrow>
                  <IconButton
                    onClick={() => {
                      setTargetFound(false);
                      setCurrentScene(scene.id);
                    }}
                    sx={{
                      width: 36,
                      height: 36,
                      position: "relative",
                      color:
                        currentScene === scene.id
                          ? "#00f3ff"
                          : "rgba(255,255,255,0.7)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#00f3ff",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    {currentScene === scene.id && (
                      <motion.div
                        layoutId="active-pill"
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: "2px solid #00f3ff",
                        }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    {scene.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
