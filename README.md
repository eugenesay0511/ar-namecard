# AR Namecard

This is a WebAR Namecard application built with **React**, **Vite**, **MUI**, and **MindAR** (A-Frame).

## Features

- **WebAR**: Uses MindAR for image tracking.
- **Interactive UI**: MUI overlay with animations (Framer Motion).
- **Glassmorphism**: Premium design aesthetics.

## How to Run

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

3. **Open on Mobile**:
   - Ensure your phone and computer are on the same Wi-Fi.
   - Run `npm run dev -- --host` (or update `vite.config.js`).
   - Open the displayed local IP address (e.g., `http://192.168.1.x:5173`) on your mobile browser.
   - **Note**: Camera access requires HTTPS or localhost. If testing on mobile via IP, you might need to enable "Insecure origins treated as secure" in Chrome flags (`chrome://flags/#unsafely-treat-insecure-origin-as-secure`) or use a tunneling service like [ngrok](https://ngrok.com/).

## How to Use

1. Open the app.
2. Click "Launch AR".
3. Point your camera at the **MindAR Example Card** image.
   - You can find the target image here: [card.png](https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.png)
   - Or display it on your computer screen and scan it with your phone.

## Customizing the Marker

To use your own Namecard/QR Code:

1. Go to [MindAR Image Targets Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
2. Upload your image (Namecard or QR Code).
3. Download the `targets.mind` file.
4. Place it in `public/`.
5. Update `ARScene.jsx`: change `imageTargetSrc` to your new file (e.g., `/targets.mind`).
