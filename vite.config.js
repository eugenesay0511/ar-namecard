import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// GitHub Pages has no SPA fallback; it serves 404.html for unknown paths
// like /ar-namecard/eugenesay, so 404.html must be the app itself.
const githubPagesSpaFallback = () => ({
  name: "github-pages-spa-fallback",
  apply: "build",
  closeBundle() {
    const dist = (file) => fileURLToPath(new URL(`./dist/${file}`, import.meta.url));
    copyFileSync(dist("index.html"), dist("404.html"));
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), githubPagesSpaFallback()],
  base: "/ar-namecard/",
  server: {
    allowedHosts: ["jerlene-uncoaxed-trebly.ngrok-free.dev"],
    https: true,
  },
});
