import React from "react";
import {
  Box,
  Paper,
  Typography,
  Fade,
  IconButton,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

export default function UIOverlay({ visible }) {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 100,
        left: 0,
        width: "100%",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Fade in={visible}>
        <Paper
          elevation={10}
          sx={{
            padding: 2,
            borderRadius: 4,
            width: "90%",
            maxWidth: 400,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            pointerEvents: "auto",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#00f3ff",
                boxShadow: "0 0 15px rgba(0, 243, 255, 0.5)",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              ES
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ letterSpacing: 0.5 }}
              >
                Eugene Say
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#00f3ff", opacity: 0.8, fontWeight: 600 }}
              >
                Frontend Developer
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#e4b60fff",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                Apecia
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack direction="row" spacing={2} justifyContent="space-around">
            <IconButton
              size="small"
              sx={{ color: "white", "&:hover": { color: "#00f3ff" } }}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "white", "&:hover": { color: "#00f3ff" } }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "white", "&:hover": { color: "#00f3ff" } }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
}
