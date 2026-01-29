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
} from "@mui/material";
import { LinkedIn, YouTube, Email, Close } from "@mui/icons-material";

export default function ARScene() {
  const sceneRef = useRef(null);
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    // A-Frame components often need to load after mount, but script tags handle registration.
    // We can add event listeners here if needed (e.g. targetFound, targetLost)
    const sceneEl = sceneRef.current;
    if (sceneEl) {
      const arSystem = sceneEl.systems["mindar-image-system"];
    }

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

    return () => {
      if (target) {
        target.removeEventListener("targetFound", onTargetFound);
        target.removeEventListener("targetLost", onTargetLost);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
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
            <Stack spacing={1}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ letterSpacing: 1 }}
              >
                Eugene Say
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, color: "#00ffff" }}
              >
                CREATIVE DEVELOPER
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Building immersive AR experiences with React & MindAR.
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Box>

      {/* We can define custom A-Frame components here if needed via script injection, but generic tags work for now */}
      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 10; warmupTolerance: 5;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true, physicallyCorrectLights; precision: high; antialias: true;"
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
          <a-entity position="0 0 0" scale="0.6 0.6 0.6">
            {/* Central Singularity (Nucleus) - Pulsing Tech Core */}
            <a-entity position="0 0 0.5">
              {/* Inner Core: Solid Dark Purple */}
              <a-sphere
                radius="0.35"
                color="#1a0033"
                material="roughness: 0; metalness: 1"
              >
                <a-light
                  type="point"
                  intensity="1"
                  distance="1"
                  color="#00f3ff"
                ></a-light>
              </a-sphere>

              {/* Energy Layer: Electric Blue Pulse */}
              <a-sphere
                radius="0.4"
                color="#00f3ff"
                opacity="0.4"
                material="transparent: true; emissive: #00f3ff; emissiveIntensity: 2"
                animation="property: scale; to: 1.15 1.15 1.15; dir: alternate; loop: true; dur: 800; easing: easeInOutQuad"
              ></a-sphere>

              {/* Outer Grid: Neon Magenta */}
              <a-sphere
                radius="0.45"
                color="#ff00ff"
                opacity="0.7"
                wireframe="true"
                material="emissive: #ff00ff; emissiveIntensity: 1"
                animation="property: rotation; to: -360 360 0; loop: true; dur: 15000; easing: linear"
              ></a-sphere>
            </a-entity>

            {/* ATOM STRUCTURE: Cyber Electrons & Orbits */}

            {/* Shell 1 - Neon Blue */}
            <a-entity
              rotation="0 0 0"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear"
            >
              <a-torus
                radius="1.2"
                radius-tubular="0.003"
                color="#00f3ff"
                opacity="0.4"
              ></a-torus>
              <a-sphere
                position="1.2 0 0"
                radius="0.05"
                color="#fff"
                material="emissive: #00f3ff; emissiveIntensity: 5"
              ></a-sphere>
            </a-entity>

            {/* Shell 2 - Electric Magenta */}
            <a-entity
              rotation="90 0 0"
              animation="property: rotation; to: 90 360 0; loop: true; dur: 4500; easing: linear"
            >
              <a-torus
                radius="1.4"
                radius-tubular="0.003"
                color="#ff00ff"
                opacity="0.4"
              ></a-torus>
              <a-sphere
                position="1.4 0 0"
                radius="0.05"
                color="#fff"
                material="emissive: #ff00ff; emissiveIntensity: 5"
              ></a-sphere>
            </a-entity>

            {/* Shell 3 - Cyan Flare */}
            <a-entity
              rotation="45 45 0"
              animation="property: rotation; to: 45 405 0; loop: true; dur: 5500; easing: linear"
            >
              <a-torus
                radius="1.1"
                radius-tubular="0.003"
                color="#00f3ff"
                opacity="0.4"
              ></a-torus>
              <a-sphere
                position="1.1 0 0"
                radius="0.05"
                color="#fff"
                material="emissive: #00f3ff; emissiveIntensity: 5"
              ></a-sphere>
            </a-entity>

            {/* Shell 4 - Deep Space Violet */}
            <a-entity
              rotation="-45 45 0"
              animation="property: rotation; to: -45 405 0; loop: true; dur: 4000; easing: linear"
            >
              <a-torus
                radius="1.3"
                radius-tubular="0.003"
                color="#7a00ff"
                opacity="0.4"
              ></a-torus>
              <a-sphere
                position="1.3 0 0"
                radius="0.05"
                color="#fff"
                material="emissive: #7a00ff; emissiveIntensity: 5"
              ></a-sphere>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}
