## MultiGender Hebrew Text Designer

A modern, client-side text-to-image generator specifically designed for MultiGender Hebrew typography. Features real-time WYSIWYG editing, comprehensive character support, and professional-grade canvas rendering with perfect mobile responsiveness.

**Version:** 0.2.17 | **Live Demo:** [staging-amba.pages.dev](https://staging-amba.pages.dev)

                               
 _____     _____       _       
|   | |___|  _  |_____| |_ ___ 
| | | | . |     |     | . | .'|
|_|___|___|__|__|_|_|_|___|__,|

### ✨ Features

**🎨 Advanced Text Rendering**
- **WYSIWYG Editing**: Real-time text editing with instant canvas generation
- **High-DPI Canvas**: 3x DPI scaling for crisp, professional-quality output
- **Smart Height Limiting**: 1600px height limit with intelligent text truncation
- **WhatsApp Export**: Fixed 1200px width, optimized for social sharing

**🔤 MultiGender Hebrew Excellence**
- **Native Font Support**: AlefMultiGenderHebrew with 12 special characters
- **Interactive Character Keyboard**: Click buttons or use keyboard shortcuts
- **Contextual Tooltips**: Hover hints with usage examples and typing instructions

**🎛️ User Experience**
- **Theme Toggle**: Dark/light mode with persistent preferences
- **Smart Input Prevention**: Typing blocked when height limit exceeded
- **Desktop Copy/Clipboard**: Copy to clipboard on desktop, share on mobile
- **WhatsApp Sharing**: Direct share to WhatsApp or download as PNG
- **Debug Mode**: Press Ctrl+D to show/hide canvas for debugging
- **RTL Optimization**: Perfect Hebrew text direction on all devices

**⌨️ Keyboard Shortcuts**
- **Ctrl+T**: Toggle dark/light theme
- **Ctrl+D**: Toggle debug mode (show/hide canvas)
- **Character buttons**: Click to insert special Hebrew characters

**⚡ Modern Interface**
- **Instant Font Size Control**: Three presets — קטן (20px), רגיל (24px), גדול (28px)
- **Unified Font Sizing**: 22px on both desktop and mobile for consistency
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
  .gitignore                 # Git ignore rules (protects API tokens)
  wrangler.toml              # Cloudflare Pages staging configuration
  wrangler.staging.toml      # Cloudflare Pages staging configuration
  wrangler.production.toml   # Cloudflare Pages production configuration
  package.json               # Project dependencies and scripts
  package-lock.json          # Dependency lock file
  README.md                  # This file
  src/
    index.html              # Main interface with special character keyboard
    styles.css              # Complete styling with CSS variables and responsive design
    script.js               # Modular JavaScript architecture with environment detection
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
- **Font Size**: Select קטן / רגיל / גדול (WhatsApp-like presets)
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
- **Fixed Export Width**: 1200px export with responsive on-screen preview scaling
- **Height Constraints**: Min 200px, max 1600px; auto-expanding with content
- **Perfect Text Positioning**: Hebrew RTL with mobile-optimized vertical alignment
- **Theme Integration**: Real-time background/text color synchronization
- **Font Excellence**: OpenType features, kerning, and ligature support
- **WYSIWYG Accuracy**: Pixel-perfect matching with text area preview
- **Canvas Signature**: "עבמה-{version}" watermark on exported images

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
- Current version: v0.2.17

**Code Standards:**
- Modular ES6+ JavaScript architecture
- Mobile-first responsive CSS design
- Comprehensive error handling and fallbacks
- Debug logging for troubleshooting

### Textarea Behavior Specification

- **Initial height**: 200px (including 10px padding)
- **Auto-expansion**: Grows with content up to 1600px maximum
- **No scrollbar**: Vertical scrollbar never appears; height expands instead
- **Typing limit**: Typing disabled when height reaches 1600px
- **Canvas sync**: Canvas dimensions always match textarea exactly
- **Font sizes**: Desktop 22px, Mobile 22px (unified sizing)
- **Canvas signature**: "עבמה-{version}" added to exported images

**Optimized Testing:**
- Cypress E2E tests run in ~49 seconds (68% faster than before)
- Tests verify 200px min-height on both desktop and mobile
- Automated CI/CD pipeline with GitHub Actions

Run tests locally:
```
npm ci
npm run test:e2e
```

### Deploying (Automatic CI/CD)

The app uses **Cloudflare Pages** with automatic deployment via GitHub Actions:

**🚀 Automatic Deployment:**
- **Staging**: Pushes to `staging` branch → `staging-amba.pages.dev`
- **Production**: Pushes to `master` branch → `noamba.pages.dev`
- **Preview**: Pull requests → staging preview environment

**⚙️ Setup Required:**
1. Add GitHub Secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
2. Push to `staging` or `master` branch
3. GitHub Actions handles the rest automatically

**📁 Configuration Files:**
- `wrangler.toml` - Default configuration
- `wrangler.staging.toml` - Staging environment
- `wrangler.production.toml` - Production environment
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `DEPLOYMENT.md` - Complete deployment guide

**🔧 Manual Deployment:**
```bash
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
```

**Alternative Platforms:**
- **Netlify**: Upload `src/` folder or connect repo with `src` as publish directory
- **GitHub Pages**: Copy `src/` contents to `docs/` and enable Pages
- **Vercel**: Connect repo, set root directory to `src`

### Staging Environment

**🌐 Domain-Based Environments:**
- **Production**: `noamba.pages.dev` (master branch)
- **Staging**: `staging-amba.pages.dev` (staging branch)

**🔍 Environment Detection:**
- Automatically detects staging vs production based on domain
- Staging shows orange `[STAGING]` badge in header
- Console logging shows current environment
- Visual indicators help distinguish environments

**🚀 Automatic Deployment:**
- **Staging Branch** → `staging-amba.pages.dev` (automatic on push)
- **Master Branch** → `noamba.pages.dev` (automatic on push)
- **Pull Requests** → Preview environment (automatic)
- Environment variables and visual indicators automatically configured

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