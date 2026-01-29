import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Box,
  Paper,
  Typography,
  Fade,
  IconButton,
  Stack,
  Link,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";

export default function ARScene() {
  const sceneRef = useRef(null);
  const [targetFound, setTargetFound] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;

    const onARError = (event) => {
      console.error("AR Error:", event);
      setCameraError(true);
    };

    const onTargetFound = () => {
      console.log("Target Found");
      setTargetFound(true);
    };
    const onTargetLost = () => {
      console.log("Target Lost");
      setTargetFound(false);
    };

    const target = document.querySelector("#target-entity");
    if (target) {
      target.addEventListener("targetFound", onTargetFound);
      target.addEventListener("targetLost", onTargetLost);
    }

    if (sceneEl) {
      sceneEl.addEventListener("arError", onARError);
    }

    return () => {
      if (target) {
        target.removeEventListener("targetFound", onTargetFound);
        target.removeEventListener("targetLost", onTargetLost);
      }
      if (sceneEl) {
        sceneEl.removeEventListener("arError", onARError);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Camera Error / Permission Overlay */}
      {cameraError && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            padding: 3,
          }}
        >
          <Paper
            elevation={24}
            sx={{
              padding: 4,
              borderRadius: 4,
              textAlign: "center",
              background: "rgba(30, 30, 30, 0.95)",
              color: "white",
              border: "1px solid rgba(255, 243, 0, 0.4)",
              maxWidth: 400,
            }}
          >
            <VideocamOffIcon sx={{ fontSize: 60, color: "#e4b60f", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Camera Required
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
              To view Eugene Say's AR Namecard, please allow camera access.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: "#00f3ff",
                color: "#121212",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00c3cc" },
              }}
            >
              Enable Camera
            </Button>
          </Paper>
        </Box>
      )}
      {/* MUI NICE INFO CARD OVERLAY */}
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
        <Fade in={targetFound}>
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

      {/* We can define custom A-Frame components here if needed via script injection, but generic tags work for now */}
      <a-scene
        ref={sceneRef}
        // mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 10; warmupTolerance: 5;"
        mindar-image="imageTargetSrc: ./targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 10; warmupTolerance: 5;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true; physicallyCorrectLights: true; precision: high; antialias: true; logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <a-assets>
          <img
            id="planetTexture"
            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.png"
          />{" "}
          {/* Using an available image for texture contrast, or a solid color if preferred */}
          <img
            id="avatarImg"
            src="https://ui-avatars.com/api/?name=Eugene+Say&background=0D8ABC&color=fff&size=256"
          />
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Global Lights - Crucial for seeing colors */}
        <a-light type="ambient" color="#333" intensity="0.4"></a-light>
        <a-light
          type="directional"
          color="#00ffff"
          intensity="0.8"
          position="-1 1 1"
        ></a-light>
        <a-light
          type="point"
          color="#ff00ff"
          intensity="1.2"
          position="0 2 2"
        ></a-light>

        <a-entity id="target-entity" mindar-image-target="targetIndex: 0">
          <a-entity position="0 0 0" scale="0.8 0.8 0.8">
            {/* 1. VIBRANT NEON PARTICLES */}
            <a-entity position="0 0 0">
              {[...Array(40)].map((_, i) => {
                const colors = [
                  "#00f3ff",
                  "#ff00ff",
                  "#ffff00",
                  "#ff0044",
                  "#ffffff",
                ];
                return (
                  <a-sphere
                    key={i}
                    position={`${(Math.random() - 0.5) * 4} ${(Math.random() - 0.5) * 4} ${(Math.random() - 0.5) * 3}`}
                    radius={0.005 + Math.random() * 0.012}
                    color={colors[i % colors.length]}
                    material="shader: flat; opacity: 0.8; transparent: true"
                    animation={`property: position; to: ${(Math.random() - 0.5) * 4.5} ${(Math.random() - 0.5) * 4.5} ${(Math.random() - 0.5) * 3.5}; dur: ${6000 + Math.random() * 8000}; dir: alternate; loop: true; easing: easeInOutSine`}
                  ></a-sphere>
                );
              })}
            </a-entity>

            {/* 2. GLOWING NUCLEUS CLUSTER */}
            <a-entity
              position="0 0 0.5"
              animation="property: rotation; to: 0 360 360; loop: true; dur: 30000; easing: linear"
            >
              <a-sphere
                radius="0.15"
                color="#fff"
                material="emissive: #fff; emissiveIntensity: 10;"
              >
                <a-light
                  type="point"
                  intensity="3"
                  distance="2"
                  color="#00f3ff"
                ></a-light>
              </a-sphere>

              <a-entity>
                <a-sphere
                  position="0.12 0.12 0"
                  radius="0.14"
                  color="#ff0044"
                  material="roughness: 0.2; metalness: 0.9; emissive: #ff0044; emissiveIntensity: 2;"
                ></a-sphere>
                <a-sphere
                  position="-0.12 -0.12 0.05"
                  radius="0.14"
                  color="#ff0044"
                  material="roughness: 0.2; metalness: 0.9; emissive: #ff0044; emissiveIntensity: 2;"
                ></a-sphere>
                <a-sphere
                  position="-0.12 0.12 -0.05"
                  radius="0.14"
                  color="#0077ff"
                  material="roughness: 0.2; metalness: 0.9; emissive: #0077ff; emissiveIntensity: 2;"
                ></a-sphere>
                <a-sphere
                  position="0.12 -0.12 -0.05"
                  radius="0.14"
                  color="#0077ff"
                  material="roughness: 0.2; metalness: 0.9; emissive: #0077ff; emissiveIntensity: 2;"
                ></a-sphere>
              </a-entity>

              {/* Glass Outer Containment Field */}
              <a-sphere
                radius="0.45"
                color="#fff"
                opacity="0.15"
                material="roughness: 0; metalness: 1; transparent: true; side: double; envMap: #planetTexture;"
                animation="property: scale; to: 1.05 1.05 1.05; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine"
              ></a-sphere>
            </a-entity>

            {/* 3. PHYSICAL ELECTRON SHELLS */}

            {/* Shell 1 - Refractive Glass Orbit */}
            <a-entity
              rotation="0 0 0"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear"
            >
              <a-torus
                radius="1.2"
                radius-tubular="0.006"
                color="#00f3ff"
                opacity="0.25"
                material="roughness: 0; metalness: 1; transparent: true"
              ></a-torus>
              <a-sphere
                position="1.2 0 0"
                radius="0.06"
                color="#fff"
                material="emissive: #00f3ff; emissiveIntensity: 12; metalness: 1; roughness: 0"
              ></a-sphere>
              {/* Motion Blur Trail */}
              <a-sphere
                position="1.1 -0.1 0"
                radius="0.03"
                color="#00f3ff"
                opacity="0.2"
                material="shader: flat"
              ></a-sphere>
            </a-entity>

            {/* Shell 2 */}
            <a-entity
              rotation="90 0 0"
              animation="property: rotation; to: 90 360 0; loop: true; dur: 6000; easing: linear"
            >
              <a-torus
                radius="1.4"
                radius-tubular="0.006"
                color="#ff00ff"
                opacity="0.25"
                material="roughness: 0; metalness: 1; transparent: true"
              ></a-torus>
              <a-sphere
                position="1.4 0 0"
                radius="0.06"
                color="#fff"
                material="emissive: #ff00ff; emissiveIntensity: 12; metalness: 1; roughness: 0"
              ></a-sphere>
            </a-entity>

            {/* Shell 3 */}
            <a-entity
              rotation="45 45 0"
              animation="property: rotation; to: 45 405 0; loop: true; dur: 8000; easing: linear"
            >
              <a-torus
                radius="1.1"
                radius-tubular="0.006"
                color="#00ffff"
                opacity="0.25"
                material="roughness: 0; metalness: 1; transparent: true"
              ></a-torus>
              <a-sphere
                position="1.1 0 0"
                radius="0.06"
                color="#fff"
                material="emissive: #00ffff; emissiveIntensity: 12; metalness: 1; roughness: 0"
              ></a-sphere>
            </a-entity>

            {/* Shell 4 */}
            <a-entity
              rotation="-45 45 0"
              animation="property: rotation; to: -45 405 0; loop: true; dur: 5500; easing: linear"
            >
              <a-torus
                radius="1.3"
                radius-tubular="0.006"
                color="#7a00ff"
                opacity="0.25"
                material="roughness: 0; metalness: 1; transparent: true"
              ></a-torus>
              <a-sphere
                position="1.3 0 0"
                radius="0.06"
                color="#fff"
                material="emissive: #7a00ff; emissiveIntensity: 12; metalness: 1; roughness: 0"
              ></a-sphere>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}
