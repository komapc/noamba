## MultiGender Hebrew Text Designer

A client-side text-to-image generator focused on MultiGender Hebrew typography. Features a special character keyboard for unique MultiGender symbols, dynamic canvas sizing, and theme support.

                               
 _____     _____       _       
|   | |___|  _  |_____| |_ ___ 
| | | | . |     |     | . | .'|
|_|___|___|__|__|_|_|_|___|__,|

### Features
- **Client-side rendering**: Pure Canvas-based text-to-image generation
- **MultiGender Hebrew support**: Default font with special character keyboard
- **Dynamic sizing**: Canvas automatically adjusts to fit text content
- **RTL-friendly**: Proper Hebrew text direction and alignment
- **Theme support**: Light/dark mode with theme-aware colors
- **Special characters**: 12 unique MultiGender Hebrew symbols (׭ ׬ ׌ ׎ ׫ ׊ ׏ ׋ ׉ ׮ ׍ ׈)
- **Share/Export**: Web Share API with download fallback
- **Responsive design**: Mobile-optimized with touch-friendly controls

### Project structure
```
render-text/
  package.json
  src/
    index.html              # Main demo with special character keyboard
    styles.css              # All styling with CSS variables and responsive design
    script.js               # Modular JavaScript (CanvasRenderer, ThemeManager, etc.)
    fonts/
      AlefMultiGndr-Regular.ttf
      AlefMultiGndr-Regular.woff
      Alef-MultiGndr-MultiGenderHebrew-license.txt
```

### Usage
Simply open `src/index.html` in a web browser. No server required!

### Features in detail
- **Special Character Keyboard**: Click any of the 12 MultiGender Hebrew symbols to insert them into your text
- **Dynamic Canvas**: Automatically resizes to fit your text content perfectly
- **Font Selection**: Choose from various Hebrew fonts including the default MultiGender font
- **Size Control**: Adjust font size from 8px to 144px
- **Theme Toggle**: Switch between light and dark modes
- **Share**: Export your design via WhatsApp or download as PNG

### Technical Details
- **Canvas Rendering**: Uses HTML5 Canvas with 2D context for text rendering
- **Font Loading**: Waits for fonts to load before rendering for consistent results
- **OpenType Features**: Enables kerning, ligatures, and contextual alternates
- **RTL Support**: Proper right-to-left text direction for Hebrew
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach

### Browser support
- Modern browsers with Canvas 2D support
- Web Share API with file support (falls back to download on unsupported browsers)
- CSS Grid and Flexbox support for responsive layout

### Fonts and licensing
- `AlefMultiGndr-Regular.ttf/.woff` are included with license in `src/fonts/Alef-MultiGndr-MultiGenderHebrew-license.txt` (SIL Open Font License + creator's terms). Review before redistribution.
- Google Fonts are loaded per their respective licenses.

### Troubleshooting
- **Font size not changing**: Ensure the font is properly loaded and try refreshing the page
- **Special characters not displaying**: Make sure the MultiGender font is loaded correctly
- **Canvas not updating**: Check browser console for JavaScript errors
- **Mobile layout issues**: Ensure viewport meta tag is present and CSS is loading


### Deploying (free static hosting)

The app is purely client-side and can be hosted anywhere that serves static files.

- **Cloudflare Pages**: Connect repo, set output directory to `src`, build command to `echo no build`
- **Netlify**: Upload `src/` folder or connect repo with `src` as publish directory
- **GitHub Pages**: Copy `src/` contents to `docs/` folder and enable Pages
- **Vercel**: Connect repo, set root directory to `src`

All static hosts work since the app requires no server-side processing.


