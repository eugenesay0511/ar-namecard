import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Fade,
  IconButton,
  Stack,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";

export default function RobotScene({ onTargetFound, onTargetLost }) {
  const sceneRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;

    const cleanupGhosts = () => {
      const ghostVideos = document.querySelectorAll("video");
      ghostVideos.forEach((v) => {
        if (v.srcObject) {
          v.srcObject.getTracks().forEach((t) => t.stop());
        }
        v.remove();
      });
      const ghostOverlays = document.querySelectorAll(".mindar-ui-overlay");
      ghostOverlays.forEach((el) => el.remove());
    };
    cleanupGhosts();

    const onARError = (event) => {
      console.error("AR Error:", event);
      setCameraError(true);
    };

    const handleTargetFound = () => {
      console.log("Target Found");
      if (onTargetFound) onTargetFound();
    };
    const handleTargetLost = () => {
      console.log("Target Lost");
      if (onTargetLost) onTargetLost();
    };

    const target = document.querySelector("#robot-target");
    if (target) {
      target.addEventListener("targetFound", handleTargetFound);
      target.addEventListener("targetLost", handleTargetLost);
    }

    if (sceneEl) {
      sceneEl.addEventListener("arError", onARError);
    }

    const stopCamera = () => {
      if (
        sceneEl &&
        sceneEl.systems &&
        sceneEl.systems["mindar-image-system"]
      ) {
        try {
          sceneEl.systems["mindar-image-system"].stop();
        } catch (e) {
          console.warn("MindAR system stop error:", e);
        }
      }

      if (sceneEl) {
        try {
          sceneEl.pause();
          if (sceneEl.renderer) {
            sceneEl.renderer.dispose();
          }
        } catch (e) {
          console.warn("Scene dispose error:", e);
        }
      }

      const videos = document.querySelectorAll("video");
      videos.forEach((v) => {
        try {
          if (v.srcObject) {
            v.srcObject.getTracks().forEach((track) => track.stop());
            v.srcObject = null;
          }
          v.remove();
        } catch (e) {
          console.warn("Video cleanup error:", e);
        }
      });

      const overlays = document.querySelectorAll(".mindar-ui-overlay");
      overlays.forEach((el) => el.remove());
    };

    window.addEventListener("beforeunload", stopCamera);
    window.addEventListener("pagehide", stopCamera);

    return () => {
      window.removeEventListener("beforeunload", stopCamera);
      window.removeEventListener("pagehide", stopCamera);

      if (target) {
        target.removeEventListener("targetFound", handleTargetFound);
        target.removeEventListener("targetLost", handleTargetLost);
      }
      if (sceneEl) {
        sceneEl.removeEventListener("arError", onARError);
      }
      stopCamera();
    };
  }, []);

  // Blinking Logic
  useEffect(() => {
    let blinkTimeout;

    const blink = () => {
      const eyes = document.querySelectorAll(".robot-eye");
      if (eyes.length > 0) {
        eyes.forEach((eye) => eye.emit("blink"));
      }

      // Random interval between 2s and 5s
      const nextBlink = Math.random() * 3000 + 2000;
      blinkTimeout = setTimeout(blink, nextBlink);
    };

    // Start blinking loop
    blinkTimeout = setTimeout(blink, 3000);

    return () => {
      clearTimeout(blinkTimeout);
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
              To view the Robot Scene, please allow camera access.
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

      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: ./targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 10; warmupTolerance: 5;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true; physicallyCorrectLights: true; precision: high; antialias: true; logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <a-assets>
          {/* No external textures needed for this simple robot, using colors */}
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Lights */}
        <a-light type="ambient" color="#FFF" intensity="0.5"></a-light>
        <a-light
          type="directional"
          color="#FFF"
          intensity="1"
          position="-1 2 1"
        ></a-light>

        <a-entity id="robot-target" mindar-image-target="targetIndex: 0">
          {/* Rotated container to make objects stand ON the marker */}
          <a-entity rotation="90 0 0">
            {/* ROBOT MODEL - RETRO FUTURE DESIGN */}
            <a-entity position="0 0 0" scale="0.5 0.5 0.5">
              {/* 0. HOVER PLATFORM (Visual grounding) */}
              <a-cylinder
                position="0 0 0"
                radius="0.6"
                height="0.05"
                color="#222"
                material="metalness: 0.8; roughness: 0.2"
                animation="property: scale; dir: alternate; dur: 2000; to: 1.1 1 1.1; loop: true; easing: easeInOutSine"
              >
                <a-ring
                  position="0 0.03 0"
                  rotation="-90 0 0"
                  radius-inner="0.4"
                  radius-outer="0.45"
                  color="#00f3ff"
                  material="emissive: #00f3ff; emissiveIntensity: 2"
                ></a-ring>
              </a-cylinder>

              {/* TEXT BUBBLE - Floating higher */}
              <a-entity
                position="0 2.5 0"
                scale="0.6 0.6 0.6"
                animation="property: position; to: 0 2.6 0; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine"
              >
                {/* Geometry-based text "HELLO!" for 100% visibility */}
                <a-entity position="-0.15 0.1 0.1" scale="0.1 0.1 0.1">
                  {/* H */}
                  <a-box
                    position="-2.5 0 0"
                    width="0.4"
                    height="2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="-1.5 0 0"
                    width="0.4"
                    height="2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="-2 0 0"
                    width="1"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>

                  {/* E */}
                  <a-box
                    position="-0.5 0 0"
                    width="0.4"
                    height="2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="0 0.8 0"
                    width="1"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="0 0 0"
                    width="0.8"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="0 -0.8 0"
                    width="1"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>

                  {/* L */}
                  <a-box
                    position="1 0 0"
                    width="0.4"
                    height="2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="1.5 -0.8 0"
                    width="1"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>

                  {/* L */}
                  <a-box
                    position="2.5 0 0"
                    width="0.4"
                    height="2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="3.0 -0.8 0"
                    width="1"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>

                  {/* O */}
                  <a-box
                    position="4.2 0.8 0"
                    width="1"
                    height="0.2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="4.2 -0.8 0"
                    width="1"
                    height="0.2"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="3.7 0 0"
                    width="0.2"
                    height="1.6"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="4.7 0 0"
                    width="0.2"
                    height="1.6"
                    depth="0.1"
                    color="white"
                  ></a-box>

                  {/* ! */}
                  <a-box
                    position="5.5 0.3 0"
                    width="0.4"
                    height="1.4"
                    depth="0.1"
                    color="white"
                  ></a-box>
                  <a-box
                    position="5.5 -0.8 0"
                    width="0.4"
                    height="0.4"
                    depth="0.1"
                    color="white"
                  ></a-box>
                </a-entity>
                <a-plane
                  color="#212121"
                  width="1.2"
                  height="0.5"
                  opacity="1"
                  position="0 0.1 0"
                  material="shader: flat"
                ></a-plane>
                {/* Bubble triangle tail */}
                <a-triangle
                  vertex-a="-0.1 -0.15 0"
                  vertex-b="0 -0.4 0"
                  vertex-c="0.1 -0.15 0"
                  color="#212121"
                  opacity="1"
                  material="shader: flat"
                ></a-triangle>
              </a-entity>

              {/* MAIN BODY GROUP - Floating animation */}
              <a-entity animation="property: position; to: 0 0.1 0; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine">
                {/* TORSO */}
                <a-box
                  position="0 1.1 0"
                  width="0.7"
                  height="0.9"
                  depth="0.4"
                  color="#ffffff"
                  material="roughness: 0.1; metalness: 0.5"
                >
                  {/* Chest Arc Reactor */}
                  <a-cylinder
                    position="0 0.2 0.21"
                    rotation="90 0 0"
                    radius="0.15"
                    height="0.02"
                    color="#222"
                  >
                    <a-ring
                      position="0 0.01 0"
                      radius-inner="0.08"
                      radius-outer="0.12"
                      color="#00f3ff"
                      material="emissive: #00f3ff; emissiveIntensity: 3"
                    ></a-ring>
                    <a-circle
                      position="0 0.01 0"
                      radius="0.05"
                      color="#fff"
                      material="emissive: #fff; emissiveIntensity: 1"
                    ></a-circle>
                  </a-cylinder>

                  {/* Sidelines */}
                  <a-plane
                    position="-0.36 0 0"
                    rotation="0 -90 0"
                    width="0.4"
                    height="0.8"
                    color="#333"
                  ></a-plane>
                  <a-plane
                    position="0.36 0 0"
                    rotation="0 90 0"
                    width="0.4"
                    height="0.8"
                    color="#333"
                  ></a-plane>
                </a-box>

                {/* NECK */}
                <a-cylinder
                  position="0 1.6 0"
                  height="0.2"
                  radius="0.15"
                  color="#333"
                ></a-cylinder>

                {/* HEAD */}
                <a-entity position="0 1.9 0">
                  {/* Main Helmet */}
                  <a-sphere
                    radius="0.35"
                    color="#ffffff"
                    material="roughness: 0.1; metalness: 0.5"
                  ></a-sphere>

                  {/* Visor Area */}
                  <a-entity position="0 0 0.25" rotation="-45 0 0">
                    <a-sphere
                      radius="0.28"
                      scale="1 0.6 0.3"
                      color="#111"
                      material="roughness: 0; metalness: 1"
                    ></a-sphere>

                    {/* Digital Eyes - Round */}
                    <a-circle
                      class="robot-eye"
                      position="-0.15 0.05 0.25"
                      radius="0.07"
                      color="#00f3ff"
                      material="shader: flat; transparent: true; opacity: 0.8"
                      animation="property: scale; from: 1 1 1; to: 1 0.1 1; dur: 50; dir: alternate; loop: 2; easing: easeInOutSine; startEvents: blink"
                    ></a-circle>
                    <a-circle
                      class="robot-eye"
                      position="0.15 0.05 0.25"
                      radius="0.07"
                      color="#00f3ff"
                      material="shader: flat; transparent: true; opacity: 0.8"
                      animation="property: scale; from: 1 1 1; to: 1 0.1 1; dur: 50; dir: alternate; loop: 2; easing: easeInOutSine; startEvents: blink"
                    ></a-circle>
                  </a-entity>

                  {/* Antenna */}
                  <a-cylinder
                    position="0.25 0.3 0"
                    height="0.3"
                    radius="0.02"
                    color="#aaa"
                  ></a-cylinder>
                  <a-sphere
                    position="0.25 0.45 0"
                    radius="0.04"
                    color="#ff0044"
                    material="emissive: #ff0044; emissiveIntensity: 2"
                    animation="property: material.emissiveIntensity; from: 2; to: 0.5; dir: alternate; dur: 500; loop: true"
                  ></a-sphere>
                </a-entity>

                {/* LEFT ARM (Waving) */}
                <a-entity position="-0.45 1.4 0">
                  <a-sphere radius="0.15" color="#333"></a-sphere>{" "}
                  {/* Shoulder */}
                  {/* Upper Arm - Mirrored */}
                  <a-cylinder
                    position="-0.2 0.2 0"
                    rotation="0 0 50"
                    height="0.6"
                    radius="0.08"
                    color="#ffffff"
                  ></a-cylinder>
                  {/* Forearm container for pivot - Mirrored */}
                  <a-entity
                    position="-0.45 0.45 0"
                    rotation="0 0 20"
                    animation="property: rotation; from: 0 0 20; to: 0 0 -40; dir: alternate; loop: true; dur: 600; easing: easeInOutSine"
                  >
                    <a-sphere radius="0.1" color="#333"></a-sphere>{" "}
                    {/* Elbow */}
                    <a-cylinder
                      position="0 0.35 0"
                      height="0.6"
                      radius="0.07"
                      color="#ffffff"
                    ></a-cylinder>
                    {/* Hand */}
                    <a-entity position="0 0.7 0">
                      <a-box
                        width="0.15"
                        height="0.18"
                        depth="0.05"
                        color="#111"
                      ></a-box>
                      {/* Fingers mirrored (Thumb on right/inner side vs pinky on left/outer) */}
                      <a-cylinder
                        position="0.06 0.12 0"
                        height="0.1"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="0.02 0.14 0"
                        height="0.12"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="-0.02 0.14 0"
                        height="0.12"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="-0.06 0.12 0"
                        height="0.1"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                    </a-entity>
                  </a-entity>
                </a-entity>

                {/* RIGHT ARM (Waving) */}
                <a-entity position="0.45 1.4 0">
                  <a-sphere radius="0.15" color="#333"></a-sphere>{" "}
                  {/* Shoulder */}
                  {/* Upper Arm */}
                  <a-cylinder
                    position="0.2 0.2 0"
                    rotation="0 0 -50"
                    height="0.6"
                    radius="0.08"
                    color="#ffffff"
                  ></a-cylinder>
                  {/* Forearm container for pivot */}
                  <a-entity
                    position="0.45 0.45 0"
                    rotation="0 0 -20"
                    animation="property: rotation; from: 0 0 -20; to: 0 0 40; dir: alternate; loop: true; dur: 600; easing: easeInOutSine"
                  >
                    <a-sphere radius="0.1" color="#333"></a-sphere>{" "}
                    {/* Elbow */}
                    <a-cylinder
                      position="0 0.35 0"
                      height="0.6"
                      radius="0.07"
                      color="#ffffff"
                    ></a-cylinder>
                    {/* Hand */}
                    <a-entity position="0 0.7 0">
                      <a-box
                        width="0.15"
                        height="0.18"
                        depth="0.05"
                        color="#111"
                      ></a-box>
                      {/* Fingers */}
                      <a-cylinder
                        position="-0.06 0.12 0"
                        height="0.1"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="-0.02 0.14 0"
                        height="0.12"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="0.02 0.14 0"
                        height="0.12"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                      <a-cylinder
                        position="0.06 0.12 0"
                        height="0.1"
                        radius="0.02"
                        color="#111"
                      ></a-cylinder>
                    </a-entity>
                  </a-entity>
                </a-entity>

                {/* LEGS (Hover thrusters) */}
                <a-entity position="-0.2 0.6 0">
                  <a-cylinder
                    position="0 -0.4 0"
                    height="0.8"
                    radius="0.12"
                    color="#fff"
                    material="metalness: 0.5"
                  ></a-cylinder>
                  {/* Thruster glow */}
                  <a-cone
                    position="0 -0.9 0"
                    radius-bottom="0.0"
                    radius-top="0.1"
                    height="0.4"
                    color="#00f3ff"
                    opacity="0.6"
                  ></a-cone>
                </a-entity>
                <a-entity position="0.2 0.6 0">
                  <a-cylinder
                    position="0 -0.4 0"
                    height="0.8"
                    radius="0.12"
                    color="#fff"
                    material="metalness: 0.5"
                  ></a-cylinder>
                  {/* Thruster glow */}
                  <a-cone
                    position="0 -0.9 0"
                    radius-bottom="0.0"
                    radius-top="0.1"
                    height="0.4"
                    color="#00f3ff"
                    opacity="0.6"
                  ></a-cone>
                </a-entity>
              </a-entity>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}
