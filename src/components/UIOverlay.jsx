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
  Button,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { fullName, downloadVCard } from "../people";

export default function UIOverlay({ visible, person }) {
  const initials = `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}`;

  const contactLinks = [
    { key: "email", href: person.email && `mailto:${person.email}`, icon: <EmailIcon fontSize="small" />, label: "Email" },
    { key: "phone", href: person.phone && `tel:${person.phone}`, icon: <PhoneIcon fontSize="small" />, label: "Call" },
    { key: "linkedin", href: person.linkedin, icon: <LinkedInIcon fontSize="small" />, label: "LinkedIn" },
    { key: "website", href: person.website, icon: <WebsiteIcon fontSize="small" />, label: "Website" },
  ].filter((link) => link.href);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "calc(48px + env(safe-area-inset-bottom))",
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
            pointerEvents: visible ? "auto" : "none",
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
              {initials}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{ letterSpacing: 0.5 }}
              >
                {fullName(person)}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#00f3ff", opacity: 0.8, fontWeight: 600 }}
              >
                {person.position}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#e4b60fff",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                {person.company}
              </Typography>
            </Box>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => downloadVCard(person)}
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 3,
              bgcolor: "#00f3ff",
              color: "#121212",
              fontWeight: "bold",
              boxShadow: "0 0 20px rgba(0, 243, 255, 0.5)",
              "&:hover": { bgcolor: "#00c3cc" },
            }}
          >
            Save Contact
          </Button>

          {contactLinks.length > 0 && (
            <>
              <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />

              <Stack direction="row" spacing={2} justifyContent="space-around">
                {contactLinks.map((link) => (
                  <IconButton
                    key={link.key}
                    component="a"
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    size="small"
                    sx={{ color: "white", "&:hover": { color: "#00f3ff" } }}
                  >
                    {link.icon}
                  </IconButton>
                ))}
              </Stack>
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}
