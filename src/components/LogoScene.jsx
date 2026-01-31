import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { VideocamOff as VideocamOffIcon } from "@mui/icons-material";
import apeciaLogo from "../assets/apecia.svg";

export default function LogoScene({ onTargetFound, onTargetLost }) {
  const sceneRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const onARError = (event) => {
      console.error("AR Error:", event);
      setCameraError(true);
    };
    const handleTargetFound = () => {
      if (onTargetFound) onTargetFound();
    };
    const handleTargetLost = () => {
      if (onTargetLost) onTargetLost();
    };
    const target = document.querySelector("#logo-target");
    if (target) {
      target.addEventListener("targetFound", handleTargetFound);
      target.addEventListener("targetLost", handleTargetLost);
    }
    if (sceneEl) sceneEl.addEventListener("arError", onARError);

    return () => {
      if (target) {
        target.removeEventListener("targetFound", handleTargetFound);
        target.removeEventListener("targetLost", handleTargetLost);
      }
      if (sceneEl) {
        sceneEl.removeEventListener("arError", onARError);
        try {
          if (sceneEl.systems?.["mindar-image-system"])
            sceneEl.systems["mindar-image-system"].stop();
        } catch (e) {}
        try {
          sceneEl.pause();
          sceneEl.renderer?.dispose();
        } catch (e) {}
      }
      document.querySelectorAll("video").forEach((v) => {
        v.srcObject?.getTracks().forEach((t) => t.stop());
        v.remove();
      });
      document
        .querySelectorAll(".mindar-ui-overlay")
        .forEach((el) => el.remove());
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
            <Typography variant="h5" fontWeight="bold">
              Camera Required
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 3, bgcolor: "#00f3ff", color: "#121212" }}
            >
              Enable Camera
            </Button>
          </Paper>
        </Box>
      )}

      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: ./targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.01; missTolerance: 10; warmupTolerance: 5;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <a-assets>
          <img id="logoSvg" src={apeciaLogo} />
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-light type="ambient" color="white" intensity="1"></a-light>
        <a-light
          type="point"
          color="white"
          intensity="1.5"
          position="0 2 1"
        ></a-light>

        <a-entity id="logo-target" mindar-image-target="targetIndex: 0">
          {/* STABLE BASE */}
          <a-cylinder
            position="0 -0.6 0"
            radius="0.3"
            height="0.1"
            color="#222"
            material="metalness: 0.9; roughness: 0.1"
          >
            <a-ring
              position="0 0.051 0"
              rotation="-90 0 0"
              radius-inner="0.2"
              radius-outer="0.25"
              color="#00f3ff"
              material="emissive: #00f3ff; emissiveIntensity: 5"
            ></a-ring>
          </a-cylinder>

          {/* SPINNING LOGO - SOLID & STABLE */}
          <a-entity
            position="0 0.2 0"
            animation="property: rotation; to: 0 360 0; dur: 6000; loop: true; easing: linear"
          >
            {/* Front Side */}
            <a-plane
              position="0 0 0.01"
              width="1.2"
              height="1.2"
              src="#logoSvg"
              material="transparent: true; opacity: 0.9; shader: flat; side: front"
            ></a-plane>
            {/* Back Side */}
            <a-plane
              position="0 0 -0.01"
              rotation="0 180 0"
              width="1.2"
              height="1.2"
              src="#logoSvg"
              material="transparent: true; opacity: 0.9; shader: flat; side: front"
            ></a-plane>
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}
