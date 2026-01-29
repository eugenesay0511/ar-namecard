import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Stack,
} from "@mui/material";
import { LinkedIn, YouTube, Email, Web } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionButton = motion(Button);

export default function UIOverlay() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Allow clicks to pass through to AR scene except for buttons
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 3,
        zIndex: 10,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)", // Fade for text readability
      }}
    >
      <Container maxWidth="sm" sx={{ pointerEvents: "auto" }}>
        <MotionCard
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            color: "#fff",
            mb: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              John Doe
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 2 }}>
              Creative Developer & AR Specialist
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <MotionButton
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                color="primary"
                startIcon={<LinkedIn />}
                href="https://linkedin.com"
                target="_blank"
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  background: "rgba(0,119,181,0.8)",
                }}
              >
                LinkedIn
              </MotionButton>
              <MotionButton
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                color="error"
                startIcon={<YouTube />}
                href="https://youtube.com"
                target="_blank"
                sx={{
                  borderRadius: 20,
                  textTransform: "none",
                  background: "rgba(255,0,0,0.8)",
                }}
              >
                Video
              </MotionButton>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
              <IconButton sx={{ color: "white" }}>
                <Email />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Web />
              </IconButton>
            </Stack>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
}
