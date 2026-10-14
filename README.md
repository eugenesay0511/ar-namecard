# AR Namecard

A WebAR namecard built with **React**, **Vite**, **MUI** and **MindAR** (A-Frame).

A guest scans the QR code on a printed namecard, the website opens, and when the camera points at the card an animated robot appears on it. An info card shows the person's details with a **Save Contact** button (downloads a `.vcf` contact) and links to email, LinkedIn and website.

Live site: https://ar-namecard-five.vercel.app

Each person has their own link:

| Person    | Link                                           |
| --------- | ---------------------------------------------- |
| Eugene    | https://ar-namecard-five.vercel.app/eugenesay  |
| Yung Sin  | https://ar-namecard-five.vercel.app/yungsin    |

The root link (https://ar-namecard-five.vercel.app/) opens `DEFAULT_PERSON` (see below). An unknown link shows "Namecard not found".

## How it works

Two separate things make each card work:

1. **The QR code** contains the person's link, so scanning it opens their page.
2. **The AR tracking** does not read the QR code as a QR code. MindAR recognises the printed card as a _picture_, using `public/targets.mind`, which is compiled from the exact card images. Each person's page only looks for their own picture (`targetIndex`).

Because of this, the image you print must be exactly the image you compiled into `targets.mind`.

## Project files you will edit

| File                                | What it is                                                   |
| ----------------------------------- | ------------------------------------------------------------ |
| `src/people.js`                     | Everyone's details, their link, and their `targetIndex`      |
| `public/targets.mind`               | Compiled AR tracking images for all cards (one file for all) |
| `src/components/RobotScene.jsx`     | The 3D robot scene (size, position, animation, lighting)     |
| `src/components/UIOverlay.jsx`      | The info card with Save Contact and contact icons            |
| `public/models/RobotExpressive.glb` | The robot model (CC0, by Tomás Laulhé)                       |

## Procedure: add a new person

Example: adding `johndoe` as the 3rd person.

1. **Add their details** in `src/people.js`, inside `people`:

   ```js
   johndoe: {
     targetIndex: 2, // next number after the last person
     firstName: "John",
     lastName: "Doe",
     position: "Designer",
     company: "Apecia",
     email: "john_doe@apecia.com",
     phone: "",
     linkedin: "https://www.linkedin.com/in/johndoe",
     website: "https://apecia.com",
   },
   ```

   - The **key** (`johndoe`) becomes their link: `https://ar-namecard-five.vercel.app/johndoe`.
   - Keys must be **lowercase** letters, numbers or dashes (use quotes for dashes: `"john-doe": { ... }`).
   - Empty or missing fields are hidden from the card and left out of the saved contact.

2. **Generate their QR code** with any QR generator, using their link. Download it as a high-resolution PNG. Scan it with your phone to check it opens the right page.

3. **Recompile `targets.mind` with ALL cards, in `targetIndex` order:**
   - Open the [MindAR Image Targets Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/).
   - Add the images in this order: index 0 (Eugene), index 1 (Yung Sin), index 2 (John), and so on.
   - Click **Start**, then **Download**. The file must be named `targets.mind` (not `.md`; turn on _File name extensions_ in Windows Explorer to check).
   - Replace `public/targets.mind` with it.

   > Keep every person's original QR image file (e.g. in a `cards/` folder) so you can recompile later. If the order changes, people will get each other's robot.

4. **Commit and push** to `main`. Vercel redeploys automatically in about a minute.

5. **Test before printing:** open their link on your phone, point it at the QR image (on screen or printed). The robot should appear and the info card should show their details.

6. **Print** the card with exactly the QR image you compiled (no cropping, recolouring or redrawing).

## Procedure: edit someone's details

Change their entry in `src/people.js` (name, position, company, email, phone, LinkedIn, website), then commit and push. No recompiling or reprinting needed.

## Procedure: remove a person

1. Delete their entry from `src/people.js`.
2. Leave `targets.mind` as it is (an unused image does no harm), or recompile without them — but then **renumber every `targetIndex`** to match the new order.
3. Commit and push. Their link will show "Namecard not found".

## Other settings

- **Root link person**: `DEFAULT_PERSON` in `src/people.js` (set to `null` to show "Namecard not found" instead).
- **Don't rename a key** after the card is printed; the printed QR code would point to a link that no longer exists.
- **Robot size**: `scale` on the robot entity in `src/components/RobotScene.jsx`.
- **Robot animation**: `animation-mixer="clip: Wave; loop: repeat"` in `RobotScene.jsx`. Available clips: `Idle`, `Wave`, `ThumbsUp`, `Yes`, `No`, `Dance`, `Jump`, `Walking`, `Running`, `Punch`, `Sitting`, `Standing`, `Death`, `WalkJump`.
- **Robot colours**: the `robot-skin` component at the top of `RobotScene.jsx`.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server (runs over HTTPS and is reachable on your Wi-Fi):

   ```bash
   npm run dev
   ```

3. Open on your phone (same Wi-Fi) using the **Network** address printed in the terminal, plus a person's key, e.g.
   `https://192.168.x.x:5173/ar-namecard/eugenesay`
   Accept the self-signed certificate warning. Locally the site lives under `/ar-namecard/`; on Vercel it is at the root.

## Deployment

- **Vercel** (main): connected to the GitHub repo; every push to `main` deploys. `vercel.json` sends every link (e.g. `/yungsin`) to the app.
- **GitHub Pages** (old): `.github/workflows/deploy.yml` still deploys to `https://eugenesay0511.github.io/ar-namecard/` for older printed cards. Delete that workflow once no printed card uses the GitHub Pages link.
