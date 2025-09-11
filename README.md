## MultiGender Hebrew Text Designer

A modern, client-side text-to-image generator specifically designed for MultiGender Hebrew typography. Features real-time WYSIWYG editing, comprehensive character support, and professional-grade canvas rendering with perfect mobile responsiveness.

                               
 _____     _____       _       
|   | |___|  _  |_____| |_ ___ 
| | | | . |     |     | . | .'|
|_|___|___|__|__|_|_|_|___|__,|

### ✨ Features

**🎨 Advanced Text Rendering**
- **WYSIWYG Editing**: Real-time synchronization between text area and canvas
- **Professional Canvas**: High-DPI rendering with perfect font smoothing
- **Smart Line Breaking**: Intelligent Hebrew text wrapping with consistent behavior
- **Dynamic Sizing**: Canvas automatically adjusts height to fit content

**🔤 MultiGender Hebrew Excellence**
- **Native Font Support**: AlefMultiGenderHebrew with 12 special characters
- **Interactive Character Keyboard**: Click buttons or use keyboard shortcuts
- **Contextual Tooltips**: Hover hints with usage examples and typing instructions
- **RTL Optimization**: Perfect Hebrew text direction on all devices

**⚡ Modern Interface**
- **Instant Font Size Control**: Arrow buttons + numeric input with immediate updates
- **Theme System**: Light/dark mode with localStorage persistence
- **Canvas Visibility Toggle**: Show/hide preview for distraction-free editing
- **Text Alignment Control**: Right/center/left alignment options

**📱 Mobile Excellence**
- **Touch-Optimized**: Large buttons and responsive layouts
- **iOS Zoom Prevention**: Smart font sizing to prevent input zoom
- **Orientation Handling**: Automatic layout updates on device rotation
- **High-DPI Support**: Crystal clear rendering on all screen densities

**🚀 Developer Experience**
- **Zero Build**: Pure client-side - no compilation required
- **Modular Architecture**: Clean, maintainable ES6+ JavaScript
- **Error Recovery**: Robust initialization with graceful fallbacks
- **Debug Mode**: Add `?debug` to URL for development insights

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
- **Font Size**: Use ▲▼ arrow buttons or type directly (8-144px range)
- **Theme Toggle**: 🌓 button for light/dark mode switching  
- **Canvas Toggle**: 👁️ button to show/hide canvas preview
- **Text Alignment**: Dropdown for right/center/left alignment
- **About**: אודות link for project information
- **Shortcuts**: קיצורי דרך link for keyboard shortcut reference

### Technical Architecture

**🏗️ Modular JavaScript Architecture:**
- `CONFIG`: Centralized constants and configuration
- `Utils`: Core utilities and mobile detection
- `FontManager`: Advanced font loading with fallback strategies
- `TextProcessor`: Intelligent Hebrew text wrapping and line processing
- `CanvasRenderer`: High-DPI canvas rendering with theme synchronization
- `ThemeManager`: Persistent light/dark mode with smooth transitions
- `CanvasToggleManager`: Show/hide canvas functionality
- `TextAlignmentManager`: Dynamic text alignment control
- `CharKeyboard`: Interactive character input with shortcuts
- `ShareManager`: Web Share API with WhatsApp integration
- `AboutModal` & `CheatSheetModal`: Educational popups with Hebrew content

**🎨 Canvas Rendering Engine:**
- **High-DPI Scaling**: Automatic devicePixelRatio detection with mobile limits
- **Dynamic Dimensions**: Content-aware canvas sizing with minimal margins
- **Perfect Text Positioning**: Hebrew RTL with mobile-optimized vertical alignment
- **Theme Integration**: Real-time background/text color synchronization
- **Font Excellence**: OpenType features, kerning, and ligature support
- **WYSIWYG Accuracy**: Pixel-perfect matching with text area preview

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