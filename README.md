## MultiGender Hebrew Text Designer

A client-side text-to-image generator focused on MultiGender Hebrew typography. Features an intuitive interface with hover hints, keyboard shortcuts, dynamic canvas sizing, and comprehensive theme support.

                               
 _____     _____       _       
|   | |___|  _  |_____| |_ ___ 
| | | | . |     |     | . | .'|
|_|___|___|__|__|_|_|_|___|__,|

### Features
- **Client-side rendering**: Pure Canvas-based text-to-image generation
- **MultiGender Hebrew support**: Default AlefMultiGenderHebrew font with special character support
- **Smart UI controls**: Horizontal range slider for font size with real-time display
- **Keyboard shortcuts**: Shift+letter combinations for quick MultiGender character input
- **Interactive hints**: Hover over characters to see usage information and shortcuts
- **Dynamic sizing**: Canvas automatically adjusts to fit text content with proper alignment
- **RTL-friendly**: Proper Hebrew text direction with mobile-optimized positioning
- **Theme support**: Light/dark mode with consistent canvas and UI colors
- **Special characters**: 12 unique MultiGender Hebrew symbols with detailed usage guidance
- **Share/Export**: Web Share API with WhatsApp integration and download fallback
- **Responsive design**: Mobile-first design with touch-optimized controls
- **About modal**: Educational popup with project information

### Key MultiGender Characters & Shortcuts

| Character | Name | Usage | Keyboard Shortcut |
|-----------|------|-------|------------------|
| ׍ | תָּה | Most common - לומד׍, אומר׍ (ת/masculine alternation) | Shift+ט |
| ׏ | יָת | Future tense ׏למד & -ית endings אזרח׏ (ת/י alternation) | Shift+ע or Shift+ב |
| ׫ | הָת | Construct state מור׫ הכיתה (ת/ה alternation) | Shift+ס |
| ׮ | נָת | Pairs ש׮יים & special ב׮אדם (ת/נ alternation) | Shift+ז |

### Project structure
```
render-text/
  .cursorrules                # Development guidelines and version management
  package.json
  README.md
  src/
    index.html              # Main interface with special character keyboard
    styles.css              # Complete styling with CSS variables and responsive design
    script.js               # Modular JavaScript architecture
    fonts/
      AlefMultiGndr-Regular.ttf
      AlefMultiGndr-Regular.woff
      Alef-MultiGndr-MultiGenderHebrew-license.txt
```

### Usage
Simply open `src/index.html` in a web browser. No server required!

**Input Methods:**
- Type directly in the text area
- Click special character buttons for MultiGender symbols
- Use keyboard shortcuts (Shift+letter) for quick input
- Hover over character buttons for usage hints

**Controls:**
- Drag the font size slider or use the keyboard shortcuts
- Toggle light/dark theme with the 🌓 button
- Click "about" for project information and character guide

### Technical Architecture

**Modular JavaScript Design:**
- `CONFIG`: Application constants and settings
- `Utils`: Helper functions and debugging tools
- `FontManager`: Font loading with mobile optimizations
- `TextProcessor`: Hebrew text wrapping and line processing
- `CanvasRenderer`: High-DPI canvas rendering with theme support
- `ThemeManager`: Light/dark mode persistence
- `CharKeyboard`: Special character input with keyboard shortcuts
- `ShareManager`: Web Share API integration
- `AboutModal`: Educational popup functionality

**Canvas Features:**
- High-DPI scaling with mobile optimization (max 2x DPR)
- Dynamic sizing based on text content and line count
- Proper Hebrew RTL text handling with mobile-specific adjustments
- Theme-aware background and text colors
- Smooth font rendering with kerning and ligatures

**Responsive Design:**
- Mobile-first CSS with flexible layouts
- Touch-optimized controls and button sizing
- Viewport-aware canvas positioning
- Orientation change handling

### Browser Support
- Modern browsers with Canvas 2D support
- Web Share API with file support (graceful degradation)
- CSS Grid and Flexbox for responsive layouts
- Font loading APIs for optimal typography

### Development

**Version Management:**
- Follows semantic versioning (major.minor.patch)
- Automatic version increment on commits
- Version displayed in footer with commit tracking

**Code Standards:**
- Modular ES6+ JavaScript architecture
- Mobile-first responsive CSS design
- Comprehensive error handling and fallbacks
- Debug logging for troubleshooting

### Deploying (Free Static Hosting)

The app is purely client-side and works on any static file host:

**Recommended Platforms:**
- **Cloudflare Pages**: Connect repo, output directory `src`, build command `echo "no build"`
- **Netlify**: Upload `src/` folder or connect repo with `src` as publish directory
- **GitHub Pages**: Copy `src/` contents to `docs/` and enable Pages
- **Vercel**: Connect repo, set root directory to `src`

**Configuration Files:**
- `wrangler.jsonc` provided for Cloudflare Pages
- `package.json` configured for static deployment
- No build process required

### Fonts and Licensing
- `AlefMultiGndr-Regular.ttf/.woff` included with license in `src/fonts/`
- SIL Open Font License with creator's additional terms
- Review `Alef-MultiGndr-MultiGenderHebrew-license.txt` before redistribution

### Troubleshooting

**Common Issues:**
- **Text alignment off on mobile**: Clear browser cache and reload
- **Keyboard shortcuts not working**: Ensure text area has focus
- **Special characters display as squares**: Font loading issue - check network tab
- **Canvas sizing problems**: Check console for dimension calculation errors
- **Theme not persisting**: localStorage may be disabled or cleared

**Debug Mode:**
- Add `?debug` to URL for mobile debugging borders and metrics
- Check browser console for detailed logging
- Verify font loading status in Network tab

### Contributing

This project follows specific development guidelines:
- Read `.cursorrules` for coding standards and version management
- Maintain mobile-first responsive design principles
- Test MultiGender Hebrew character rendering thoroughly
- Ensure theme compatibility for all new features
- Follow semantic versioning for all changes

Created by **Kobi** and **Mark** to support inclusive Hebrew writing.

Learn more about MultiGender Hebrew at [multigenderhebrew.com](https://multigenderhebrew.com/)