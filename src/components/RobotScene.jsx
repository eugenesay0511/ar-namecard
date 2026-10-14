import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { VideocamOff as VideocamOffIcon } from "@mui/icons-material";

if (window.AFRAME && !window.AFRAME.components["robot-skin"]) {
  window.AFRAME.registerComponent("robot-skin", {
    init() {
      this.onModelLoaded = () => {
        this.el.getObject3D("mesh").traverse((node) => {
          if (!node.material) return;
          const mat = node.material;
          if (mat.name === "Main") {
            mat.color.set("#e4b60f");
            mat.metalness = 0.35;
            mat.roughness = 0.35;
          } else if (mat.name === "Grey") {
            mat.color.set("#e8eef2");
            mat.metalness = 0.4;
            mat.roughness = 0.3;
          }
          mat.needsUpdate = true;
        });
      };

      this.el.addEventListener("model-loaded", this.onModelLoaded);
    },

    remove() {
      this.el.removeEventListener("model-loaded", this.onModelLoaded);
    },
  });
}

export default function RobotScene({
  targetIndex = 0,
  onTargetFound,
  onTargetLost,
}) {
  const sceneRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;

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

    const getMindAR = () => sceneEl?.systems?.["mindar-image-system"];
    let cameraOn = true; // mindar-image autoStart turns it on

    // MindAR's own stop() throws before stopping the tracks if the AR
    // controller isn't ready yet, which leaves the camera running.
    const releaseCamera = () => {
      cameraOn = false;
      const mindar = getMindAR();
      try {
        mindar?.controller?.stopProcessVideo();
        mindar?.controller?.dispose();
      } catch (e) {
        console.warn("MindAR controller stop error:", e);
      }
      document.querySelectorAll("video").forEach((v) => {
        v.srcObject?.getTracks().forEach((track) => track.stop());
        v.srcObject = null;
        v.remove();
      });
    };

    const resumeCamera = () => {
      if (cameraOn || document.hidden) return;
      cameraOn = true;
      setCameraError(false);
      getMindAR()?.start();
    };

    // A camera request still in flight when the page is hidden resolves later,
    // after releaseCamera() has run, so stop that stream as soon as it arrives.
    const mediaDevices = navigator.mediaDevices;
    const originalGetUserMedia = mediaDevices?.getUserMedia;
    if (originalGetUserMedia) {
      mediaDevices.getUserMedia = async (constraints) => {
        const stream = await originalGetUserMedia.call(mediaDevices, constraints);
        if (!cameraOn) stream.getTracks().forEach((track) => track.stop());
        return stream;
      };
    }

    const onARReady = () => {
      if (!cameraOn) releaseCamera();
    };

    const onVisibilityChange = () => {
      if (document.hidden) releaseCamera();
      else resumeCamera();
    };

    const onPageShow = (event) => {
      if (event.persisted) resumeCamera();
    };

    if (sceneEl) {
      sceneEl.addEventListener("arError", onARError);
      sceneEl.addEventListener("arReady", onARReady);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", releaseCamera);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", releaseCamera);
      window.removeEventListener("pageshow", onPageShow);

      if (target) {
        target.removeEventListener("targetFound", handleTargetFound);
        target.removeEventListener("targetLost", handleTargetLost);
      }
      if (sceneEl) {
        sceneEl.removeEventListener("arError", onARError);
        sceneEl.removeEventListener("arReady", onARReady);
      }

      releaseCamera();
      if (originalGetUserMedia) mediaDevices.getUserMedia = originalGetUserMedia;
      try {
        sceneEl?.pause();
        sceneEl?.renderer?.dispose();
      } catch (e) {
        console.warn("Scene dispose error:", e);
      }
      document
        .querySelectorAll(".mindar-ui-overlay")
        .forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
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
        mindar-image={`imageTargetSrc: ${import.meta.env.BASE_URL}targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 10; warmupTolerance: 5;`}
        color-space="sRGB"
        embedded
        renderer="colorManagement: true; physicallyCorrectLights: true; precision: high; antialias: true; logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Lights */}
        <a-light
          type="hemisphere"
          color="#FFF"
          ground-color="#445"
          intensity="2"
        ></a-light>
        <a-light
          type="directional"
          color="#FFF"
          intensity="2.5"
          position="1 3 3"
        ></a-light>
        <a-light
          type="directional"
          color="#00f3ff"
          intensity="2"
          position="-2 2 -3"
        ></a-light>

        <a-entity
          id="robot-target"
          mindar-image-target={`targetIndex: ${targetIndex}`}
        >
          {/* Rotated container to make objects stand ON the marker */}
          <a-entity rotation="90 0 0">
            <a-entity position="0 0 0" scale="0.5 0.5 0.5">
              {/* HOVER PLATFORM (Visual grounding) */}
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

              {/* TEXT BUBBLE - Floating above the head */}
              <a-entity
                position="0 3 0"
                scale="0.6 0.6 0.6"
                animation="property: position; to: 0 3.1 0; dir: alternate; dur: 2000; loop: true; easing: easeInOutSine"
              >
                {/* Geometry-based text "HELLO!" for 100% visibility */}
                <a-entity position="-0.15 0.1 0.1" scale="0.1 0.1 0.1">
                  {/* H */}
                  <a-box position="-2.5 0 0" width="0.4" height="2" depth="0.1" color="white"></a-box>
                  <a-box position="-1.5 0 0" width="0.4" height="2" depth="0.1" color="white"></a-box>
                  <a-box position="-2 0 0" width="1" height="0.4" depth="0.1" color="white"></a-box>

                  {/* E */}
                  <a-box position="-0.5 0 0" width="0.4" height="2" depth="0.1" color="white"></a-box>
                  <a-box position="0 0.8 0" width="1" height="0.4" depth="0.1" color="white"></a-box>
                  <a-box position="0 0 0" width="0.8" height="0.4" depth="0.1" color="white"></a-box>
                  <a-box position="0 -0.8 0" width="1" height="0.4" depth="0.1" color="white"></a-box>

                  {/* L */}
                  <a-box position="1 0 0" width="0.4" height="2" depth="0.1" color="white"></a-box>
                  <a-box position="1.5 -0.8 0" width="1" height="0.4" depth="0.1" color="white"></a-box>

                  {/* L */}
                  <a-box position="2.5 0 0" width="0.4" height="2" depth="0.1" color="white"></a-box>
                  <a-box position="3.0 -0.8 0" width="1" height="0.4" depth="0.1" color="white"></a-box>

                  {/* O */}
                  <a-box position="4.2 0.8 0" width="1" height="0.2" depth="0.1" color="white"></a-box>
                  <a-box position="4.2 -0.8 0" width="1" height="0.2" depth="0.1" color="white"></a-box>
                  <a-box position="3.7 0 0" width="0.2" height="1.6" depth="0.1" color="white"></a-box>
                  <a-box position="4.7 0 0" width="0.2" height="1.6" depth="0.1" color="white"></a-box>

                  {/* ! */}
                  <a-box position="5.5 0.3 0" width="0.4" height="1.4" depth="0.1" color="white"></a-box>
                  <a-box position="5.5 -0.8 0" width="0.4" height="0.4" depth="0.1" color="white"></a-box>
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

              {/* ROBOT (RobotExpressive by Tomás Laulhé, CC0) */}
              <a-entity
                position="0 0.03 0"
                scale="0.5 0.5 0.5"
                gltf-model={`url(${import.meta.env.BASE_URL}models/RobotExpressive.glb)`}
                animation-mixer="clip: Wave; loop: repeat"
                robot-skin
              ></a-entity>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}
