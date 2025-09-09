## Render Text → Image

Generate images from text using either a small Node.js server (SVG → PNG via Sharp) or pure client-side Canvas. Includes examples for Hebrew/RTL text, selectable fonts (including a Multi‑Gender Hebrew font), and a WhatsApp share flow.

                               
 _____     _____       _       
|   | |___|  _  |_____| |_ ___ 
| | | | . |     |     | . | .'|
|_|___|___|__|__|_|_|_|___|__,|

### Features
- **Server rendering**: `/render` endpoint converts text to a PNG using SVG + Sharp (supports multiline text)
- **Client rendering**: client-side Canvas demo with live preview (multiline rendering)
- **RTL-friendly**: sets `direction="rtl"` for Hebrew text
- **Font handling**:
  - Server downloads and caches Google Fonts (currently Caveat) for consistent output
  - Client demos load several Google fonts, and a local Alef Multi‑Gender Hebrew font
- **Share/Export**: client demos support Web Share API with a download fallback

### Project structure
```
render-text/
  package.json
  src/
    render.js               # Express server + /render endpoint
    index.html              # Simple UI that calls the server to get a PNG (auto updates)
    noamba.html             # Client-side Canvas demo with Alef Multi‑Gender font
    fonts/
      AlefMultiGndr-Regular.ttf
      AlefMultiGndr-Regular.woff
      Alef-MultiGndr-MultiGenderHebrew-license.txt
```

### Prerequisites
- Node.js 18+ recommended
- npm

### Install
```bash
npm install
```

### Run the server
```bash
npm start
# Server runs at http://localhost:3000
```

The server statically serves files from `src/`, so you can open:
- `http://localhost:3000/index.html` (server-rendered PNG)
- `http://localhost:3000/noamba.html` (client-side with Alef Multi‑Gender font)

### API
#### GET /render
Renders the given text to a PNG using SVG + Sharp. Fonts are embedded with `@font-face` (Caveat is downloaded and cached on first use). The requested font name is applied to the `<text>` element; if missing on the server, the embedded Caveat provides a consistent fallback.

Query parameters:
- `text` (string) – text content; supports Hebrew/RTL
- `font` (string, optional) – font-family name; defaults to `Caveat`
- `size` (number, optional) – font size in px; default `24`
- `width` (number, optional) – output width in px; default `800`
- `height` (number, optional) – output height in px; default `200`

Response:
- `image/png` with `Content-Disposition: attachment; filename="rendered-text.png"`

Examples:
```bash
# Basic
curl "http://localhost:3000/render?text=%D7%94%D7%9C%D7%9C%D7%95%20%D7%95%D7%95%D7%A8%D7%9C%D7%93"

# With size and custom canvas
curl "http://localhost:3000/render?text=Hello&size=64&width=1200&height=400"

# Request a font-family (falls back to Caveat if unavailable server-side)
curl "http://localhost:3000/render?text=Hello&font=Caveat&size=48"
```

Notes:
- The server sanitizes `text` and `font` for SVG safety.
- The server currently downloads and embeds Caveat (bold) via Google Fonts for reliability. Using other fonts requires adding similar `@font-face` handling or ensuring the font is installed/available to Sharp.

### Client demos
All demos set a default Hebrew text and support live preview.

1) `index.html` – calls `/render` and displays the returned PNG
   - Inputs: multiline text, font (a set of Google fonts), size
   - Auto-updates image on any input change; multiline is centered and rendered line-by-line

2) `noamba.html` – client-side `<canvas>` with a local `AlefMultiGndr` font
   - Provides an option named "Multi Gender" implemented via `@font-face` pointing to `src/fonts/AlefMultiGndr-Regular.woff`
   - Helpful for testing typographic features for multi‑gender Hebrew glyphs
   - Multiline text is split by line breaks and drawn centered line-by-line

### Adding more server fonts
The server embeds a known-good font via `@font-face` in the SVG before rasterizing. To add another font:
1. Place the font file under `src/fonts/` (e.g., `my-font.woff2`).
2. Update `src/render.js` to download/cache it (mirroring the existing `downloadFont` call) or reference the local file directly in the generated SVG `@font-face`.
3. Include the new font-family in the `<text>` element’s `font-family` list.

### Development notes
- `src/render.js` serves static assets from `src/` and exposes `/render`.
- The build script in `package.json` references TypeScript but there are no `.ts` files; you can ignore `npm run build` unless you add TS.
- For high-DPI output, increase `width`/`height` and `size` proportionally.

### Browser support
- Client demos require modern browsers. The Web Share API with file support is not available on all desktop browsers; the demos fall back to downloading the PNG.

### Fonts and licensing
- `AlefMultiGndr-Regular.ttf/.woff` are included with license in `src/fonts/Alef-MultiGndr-MultiGenderHebrew-license.txt` (SIL Open Font License + creator’s terms). Review before redistribution.
- Client demos load Google Fonts per their respective licenses.

### Troubleshooting
- PNG looks different between server/client: ensure the same font is available both places. The server embeds Caveat; if you choose a different font in `index.html`, the rasterized result may fall back to Caveat on the server while your browser preview shows the requested Google font.
- Hebrew shaping/ligatures: Canvas-level OpenType feature support varies across browsers; `noamba.html` includes extra flags and may behave differently by browser.
- Download errors for fonts on server: check network access for Google Fonts; the server caches to `src/fonts/` once downloaded.


### Deploying the static demo (free)

You can host the client-only demo (`noamba.html`) anywhere that serves static files.

- Cloudflare Pages (with Deploy command)
  - Repo contains `wrangler.jsonc` configured to publish the `src/` folder as static assets.
  - In Pages settings:
    - Build command: `echo no build`
    - Output directory: `src`
    - Deploy command: `npx wrangler deploy`
  - Note: `noamba.html` uses a relative font path (`fonts/AlefMultiGndr-Regular.woff`) so it works under any base path.

- Netlify (Drop or connect repo)
  - Drop: Zip and upload the `src/` folder.
  - Connected repo: Set publish directory to `src` and leave build command empty.

- GitHub Pages
  - Copy the contents of `src/` to a `docs/` folder and set Pages to deploy from `/docs` on `master`, or deploy from root and move the files accordingly.

Server page note: `index.html` calls the `/render` API and requires the Node server (`src/render.js`). Deploy that separately to a server host (Render, Railway, Fly.io) if you want `index.html` live.


