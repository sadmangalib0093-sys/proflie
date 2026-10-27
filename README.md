# SADMAN GALIB — Link in Bio

## Files
- `index.html` — page structure
- `style.css` — design, responsive layout, glassmorphism and animations
- `script.js` — modals, copy/share, QR code, theme switch and particles

## Run locally
1. Keep all three files in the same folder.
2. Open `index.html` in a browser.
3. An internet connection is needed for the QR-code library, Google Fonts and remote cartoon avatar.

## Important QR note
The QR code encodes the current page URL. When opening the site as a local `file://` page, it will encode that local address, which other people cannot access. After publishing on GitHub Pages or another public host, open the public URL and then generate/share the QR code.

## Publish with GitHub Pages
1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the Pages deployment and open the public URL. The QR code and Share Profile button will then use that public URL.

Replace the avatar image URL in `index.html` with your own image URL if you prefer a different cartoon avatar.
