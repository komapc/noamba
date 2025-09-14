/**
 * MultiGender Hebrew Text Designer
 * A tool for creating beautiful text with MultiGender Hebrew fonts
 * Version: 1.2.0
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const CONFIG = {
    VERSION: '2.0.2',
    // Environment detection based on domain
    IS_STAGING: window.location.hostname.includes('staging-noamba') ||
                window.location.hostname.includes('staging.') ||
                window.location.hostname.includes('.staging.') ||
                window.location.hostname.includes('preview.') ||
                window.location.hostname.includes('.preview.'),
    IS_PRODUCTION: window.location.hostname.includes('noamba.komapc.workers.dev') &&
                   !window.location.hostname.includes('staging') &&
                   !window.location.hostname.includes('preview'),
    DEFAULT_FONT_SIZE: 96,
    // WhatsApp-like presets: small < normal (default) < large
    FONT_PRESETS: {
        small: 82,
        normal: 96,
        large: 110
    },
    MIN_FONT_SIZE: 8,
    MAX_FONT_SIZE: 144,
    // Fixed export dimensions policy (for WhatsApp image sharing)
    FIXED_CANVAS_WIDTH: 1200,
    MIN_CANVAS_HEIGHT: 300,
    MAX_HEIGHT_RATIO: 4.0/3,
    MULTIGENDER_CHARS: '׭׬׌׎׫׊׏׋׉׮׍׈',
    DEBOUNCE_DELAY: 150,
    // Canvas dimensions
    MOBILE_CANVAS_WIDTH: 350,
    DESKTOP_CANVAS_WIDTH: 500,
    CANVAS_PADDING: 40,
    TEXTAREA_PADDING: 40,
    // Unified styling constants for perfect sync
    LINE_HEIGHT_MULTIPLIER: 1.4,
    FONT_FAMILY: 'AlefMultiGenderHebrew, sans-serif',
    // Padding multipliers (relative to font size)
    PADDING_MULTIPLIER_MOBILE: 0.2,
    PADDING_MULTIPLIER_DESKTOP: 0.25
};

// =============================================================================
// VERSION MANAGEMENT SYSTEM
// =============================================================================
const VersionManager = {
    // Centralized version management
    getVersion() {
        return CONFIG.VERSION;
    },

    // Update version in all locations
    updateVersion(newVersion) {
        // Update JavaScript CONFIG
        CONFIG.VERSION = newVersion;

        // Update HTML footer
        const versionElement = document.querySelector('.version-small');
        if (versionElement) {
            versionElement.textContent = `v${newVersion}`;
        }

        // Log version update
        console.log(`📝 Version updated to v${newVersion}`);
    },

    // Validate version consistency
    validateVersionConsistency() {
        const jsVersion = CONFIG.VERSION;
        const htmlVersion = document.querySelector('.version-small')?.textContent?.replace('v', '');

        if (jsVersion !== htmlVersion) {
            console.warn(`⚠️ Version mismatch: JS=${jsVersion}, HTML=${htmlVersion}`);
            return false;
        }
        return true;
    },

    // Auto-sync versions on load
    syncVersions() {
        const jsVersion = CONFIG.VERSION;
        const versionElement = document.querySelector('.version-small');
        if (versionElement && !versionElement.textContent.includes(jsVersion)) {
            this.updateVersion(jsVersion);
        }
    }
};

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================
function getSelectedPreset() {
    const activeBtn = document.querySelector('#sizeButtons .size-btn.active');
    if (activeBtn) return activeBtn.getAttribute('data-size');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) return fontSizeSelect.value;
    return 'normal';
}

// Unified text styling system for perfect sync
function getUnifiedTextStyle(fontSize) {
    const isMobileNow = FontManager.isMobile();
    const isDark = document.body.classList.contains('dark');

    // Get alignment and convert to CSS text-align values
    const canvasAlignment = TextAlignmentManager.getCanvasAlignment();
    let textAlign;
    if (canvasAlignment === 'center') {
        textAlign = 'center';
    } else if (canvasAlignment === 'left') {
        textAlign = 'left';
    } else {
        textAlign = 'right';
    }

    return {
        fontFamily: CONFIG.FONT_FAMILY,
        fontSize: `${fontSize}px`,
        lineHeight: CONFIG.LINE_HEIGHT_MULTIPLIER,
        direction: 'rtl',
        textAlign: textAlign, // Properly sync with canvas alignment
        backgroundColor: isDark ? '#0f172a' : '#ffffff', // Match canvas colors
        color: isDark ? '#e5e7eb' : '#111827', // Match canvas colors
        overflow: 'hidden',
        resize: 'none',
        margin: '0 auto'
    };
}

// =============================================================================
// CONFIGURATION VALIDATION SYSTEM
// =============================================================================
const ConfigValidator = {
    // Validate all configuration values
    validateConfig() {
        const issues = [];

        // Check version consistency
        if (!VersionManager.validateVersionConsistency()) {
            issues.push('Version mismatch between JS and HTML');
        }

        // Check padding consistency
        if (CONFIG.CANVAS_PADDING !== CONFIG.TEXTAREA_PADDING) {
            issues.push(`Padding mismatch: Canvas=${CONFIG.CANVAS_PADDING}, Textarea=${CONFIG.TEXTAREA_PADDING}`);
        }

        // Check font presets
        if (!CONFIG.FONT_PRESETS.small || !CONFIG.FONT_PRESETS.normal || !CONFIG.FONT_PRESETS.large) {
            issues.push('Missing font presets');
        }

        // Check canvas dimensions
        if (CONFIG.FIXED_CANVAS_WIDTH <= 0) {
            issues.push('Invalid FIXED_CANVAS_WIDTH');
        }

        if (CONFIG.MIN_CANVAS_HEIGHT <= 0) {
            issues.push('Invalid MIN_CANVAS_HEIGHT');
        }

        // Check font family
        if (!CONFIG.FONT_FAMILY || CONFIG.FONT_FAMILY.trim() === '') {
            issues.push('Missing FONT_FAMILY');
        }

        // Log issues
        if (issues.length > 0) {
            console.error('❌ Configuration validation failed:', issues);
            return false;
        }

        console.log('✅ Configuration validation passed');
        return true;
    },

    // Auto-fix common configuration issues
    autoFixConfig() {
        let fixed = false;

        // Fix padding mismatch
        if (CONFIG.CANVAS_PADDING !== CONFIG.TEXTAREA_PADDING) {
            CONFIG.TEXTAREA_PADDING = CONFIG.CANVAS_PADDING;
            console.log('🔧 Fixed padding mismatch');
            fixed = true;
        }

        // Fix version mismatch
        if (!VersionManager.validateVersionConsistency()) {
            VersionManager.syncVersions();
            console.log('🔧 Fixed version mismatch');
            fixed = true;
        }

        return fixed;
    },

    // Run validation on startup
    runStartupValidation() {
        console.log('🔍 Running configuration validation...');

        if (!this.validateConfig()) {
            console.log('🔧 Attempting to auto-fix configuration issues...');
            if (this.autoFixConfig()) {
                console.log('✅ Configuration auto-fixed');
            } else {
                console.error('❌ Configuration issues require manual intervention');
            }
        }
    }
};

// =============================================================================
// UTILITIES
// =============================================================================
const Utils = {
    // Log application startup info
    logStartup() {
        console.log('🚀 MultiGender Hebrew Text Designer v' + CONFIG.VERSION);
    },

    // Check if text contains MultiGender Hebrew characters
    hasMultiGenderChars(text) {
        return /[׭׬׌׎׫׊׏׋׉׮׍׈]/.test(text);
    },

    // Check if text contains Hebrew characters
    hasHebrewChars(text) {
        return /[\u0590-\u05FF]/.test(text);
    },

    // Debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// =============================================================================
// FONT MANAGEMENT
// =============================================================================
const FontManager = {
    loaded: false,
    async loadMultiGenderFont() {
/*        try {
            if (this.loaded) {
                return true;
            }

            // Try multiple font loading approaches for better mobile compatibility
            const fontLoadPromises = [];

            // Approach 1: FontFace API
            try {
                const fontFace = new FontFace(
                    'AlefMultiGenderHebrew',
                    window.location.protocol === 'file:'
                        ? 'url(fonts/AlefMultiGndr-Regular.ttf)'
                        : 'url(fonts/AlefMultiGndr-Regular.woff)'
                );

                fontLoadPromises.push(fontFace.load().then(font => {
                    document.fonts.add(font);
                    return true;
                }));
            } catch (error) {
                console.warn('FontFace API not supported:', error);
            }

            // Approach 2: document.fonts.load for mobile compatibility
            try {
                fontLoadPromises.push(
                    document.fonts.load('32px AlefMultiGenderHebrew').then(() => {
                        return true;
                    })
                );
            } catch (error) {
                console.warn('document.fonts.load failed:', error);
            }

            // Wait for any font loading approach to succeed
            try {
                await Promise.race(fontLoadPromises);
            } catch (error) {
                console.warn('All font loading approaches failed, using fallback');
            }

            // Extra wait for mobile devices
            if (this.isMobile()) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Verify font loading with multiple checks
            const success = await this.verifyFontLoading();
            if (success) this.loaded = true;
            return success;
        } catch (error) {
            console.error('Font loading failed:', error);
            return false;
        }
            */
    },

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    },

    /* async verifyFontLoading() {
        try {
            // Test 1: Element measurement
            const testText = CONFIG.MULTIGENDER_CHARS;
            const testElement = document.createElement('span');
            testElement.style.fontFamily = 'AlefMultiGenderHebrew, serif';
            testElement.style.fontSize = '32px';
            testElement.textContent = testText;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            testElement.style.visibility = 'hidden';
            document.body.appendChild(testElement);

            // Wait a bit for font rendering
            await new Promise(resolve => setTimeout(resolve, 100));

            const width = testElement.getBoundingClientRect().width;
            document.body.removeChild(testElement);


            return width > 10;
        } catch (error) {
            console.error('Font verification failed:', error);
            return false;
        }
    } */
};

// =============================================================================
// TEXT SYNCHRONIZATION SYSTEM
// =============================================================================
const TextSyncManager = {
    // Ensure textarea and canvas are perfectly synchronized
    syncTextareaAndCanvas() {
        const textarea = document.getElementById('textInput');
        const canvas = document.getElementById('canvas');

        if (!textarea || !canvas) {
            console.error('❌ Textarea or canvas not found for synchronization');
            return false;
        }

        // Get current text content
        const textContent = textarea.value;

        // Validate text content consistency
        if (!this.validateTextContent(textContent)) {
            console.warn('⚠️ Text content validation failed');
            return false;
        }

        // Apply unified styling
        this.applyUnifiedStyling();

        // Regenerate canvas
        CanvasRenderer.generate();

        return true;
    },

    // Validate text content for consistency
    validateTextContent(text) {
        // Check for invalid characters or encoding issues
        if (text.includes('\u200F')) {
            console.warn('⚠️ RLM character detected in text content');
            return false;
        }

        // Check for excessive length
        if (text.length > 10000) {
            console.warn('⚠️ Text content too long');
            return false;
        }

        return true;
    },

    // Apply unified styling to both textarea and canvas
    applyUnifiedStyling() {
        const preset = getSelectedPreset();
        const canvasFontSize = CONFIG.FONT_PRESETS[preset] || CONFIG.DEFAULT_FONT_SIZE;
        const isMobileNow = FontManager.isMobile();
        const previewWidth = isMobileNow ? CONFIG.MOBILE_CANVAS_WIDTH : CONFIG.DESKTOP_CANVAS_WIDTH;
        const displayScale = previewWidth / CONFIG.FIXED_CANVAS_WIDTH;
        const textAreaFontSize = Math.max(16, Math.round(canvasFontSize * displayScale));

        // Calculate dynamic padding that matches canvas system
        const canvasPadding = isMobileNow ?
            Math.round(canvasFontSize * CONFIG.PADDING_MULTIPLIER_MOBILE) :
            Math.round(canvasFontSize * CONFIG.PADDING_MULTIPLIER_DESKTOP);
        const textareaPadding = Math.round(canvasPadding * displayScale);

        // Apply to textarea
        const textarea = document.getElementById('textInput');
        if (textarea) {
            const unifiedStyle = getUnifiedTextStyle(textAreaFontSize);
            Object.assign(textarea.style, unifiedStyle);
            // Horizontal padding mirrors canvas padding; vertical uses line-height multiplier
            textarea.style.padding = `${textareaPadding}px`;
            // With content-box sizing, width must equal exact scaled wrap width
            const scaledWrapWidth = (CONFIG.FIXED_CANVAS_WIDTH - (CONFIG.CANVAS_PADDING * 2)) * displayScale;
            textarea.style.width = `${Math.round(scaledWrapWidth)}px`;
        }
    },

    // Monitor for synchronization issues
    startSyncMonitoring() {
        setInterval(() => {
            if (!this.validateTextContent(document.getElementById('textInput')?.value || '')) {
                console.warn('⚠️ Text synchronization issue detected');
            }
        }, 5000);
    }
};

// =============================================================================
// TEXT PROCESSING
// =============================================================================
const TextProcessor = {
    wrapText(text, maxWidth, ctx) {
        const isHebrew = Utils.hasHebrewChars(text);

        if (isHebrew) {
            // Character-based wrapping for Hebrew - improved logic
            const chars = text.split('');
            const lines = [];
            let currentLine = '';

            for (const char of chars) {
                const testLine = currentLine + char;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth) {
                    // If currentLine is empty, the character itself is too wide
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = char;
                    } else {
                        // Single character is too wide, add it anyway
                        lines.push(char);
                        currentLine = '';
                    }
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }

            return lines;
        } else {
            // For non-Hebrew text, use character-based wrapping to avoid word boundary issues
            const chars = text.split('');
            const lines = [];
            let currentLine = '';

            for (const char of chars) {
                const testLine = currentLine + char;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth) {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = char;
                    } else {
                        // Single character is too wide, add it anyway
                        lines.push(char);
                        currentLine = '';
                    }
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }

            return lines;
        }
    }
};

// =============================================================================
// CANVAS RENDERER
// =============================================================================
const CanvasRenderer = {
    _rafId: null,
    async generate() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this._rafId = requestAnimationFrame(() => this._render());
    },
    async _render() {

        // Get elements and values with null checks
        const canvas = document.getElementById('canvas');
        const textInput = document.getElementById('textInput');

        if (!canvas) {
            console.error('❌ Canvas element not found');
            return;
        }
        if (!textInput) {
            console.error('❌ Text input element not found');
            return;
        }
        // font size will be derived from active size button or fallback to normal

        const ctx = canvas.getContext('2d');
        const text = textInput.value;
//        const font = 'AlefMultiGenderHebrew'; // Always use MultiGender Hebrew font
        const activeBtn = document.querySelector('#sizeButtons .size-btn.active');
        const selectedPreset = (activeBtn && activeBtn.getAttribute('data-size')) || 'normal';
        const size = CONFIG.FONT_PRESETS[selectedPreset] || CONFIG.DEFAULT_FONT_SIZE;

        // Ensure font is loaded
//        await FontManager.loadMultiGenderFont();

        // Setup canvas
        this.setupCanvas(ctx, size);

        // Process text into lines using FIXED export width and current size
        const lines = this.processText(text, ctx, size);

        // Calculate dimensions and resize canvas
        const dimensions = this.calculateDimensions(lines, size, ctx);
        this.resizeCanvas(canvas, dimensions);

        // Re-setup canvas after resize (context is reset)
        this.setupCanvas(ctx, size);

        // Draw the text
        this.drawText(ctx, lines, size, dimensions);
    },

    setupCanvas(ctx, size) {
        // Always use MultiGender Hebrew font with fallbacks
        //ctx.font = `${size}px ${CONFIG.FONT_FAMILY}`;

        // Set basic text properties (alignment will be set in drawText)
        ctx.textBaseline = 'alphabetic';
        ctx.textRendering = 'optimizeLegibility';
        ctx.fontKerning = 'normal';

    },

    processText(text, ctx, fontSizePx) {
        const lines = text.split('\n');
        const wrappedLines = [];

        // Use FIXED export width for consistent wrapping in the final image
        const fixedWidth = CONFIG.FIXED_CANVAS_WIDTH;
        const maxLineWidth = fixedWidth - (CONFIG.CANVAS_PADDING * 2);

        for (const line of lines) {
            if (line.trim()) {
                const wrapped = TextProcessor.wrapText(line, maxLineWidth, ctx);
                wrappedLines.push(...wrapped);
            } else {
                wrappedLines.push('');
            }
        }

        // Cap lines to prevent exceeding max height (3/4 ratio) with a min of 200px
        const lineHeight = Math.round(fontSizePx * CONFIG.LINE_HEIGHT_MULTIPLIER);
        const maxHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, Math.floor(CONFIG.FIXED_CANVAS_WIDTH * CONFIG.MAX_HEIGHT_RATIO));
        const verticalPadding = Math.round(fontSizePx * (FontManager.isMobile() ? CONFIG.PADDING_MULTIPLIER_MOBILE : CONFIG.PADDING_MULTIPLIER_DESKTOP));
        const availableHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, maxHeight) - verticalPadding * 2;
        const maxLines = Math.max(1, Math.floor(availableHeight / lineHeight));

        return wrappedLines.slice(0, maxLines);
    },

    calculateDimensions(lines, size, ctx) {
        const isMobile = FontManager.isMobile();
        const lineHeight = Math.round(size * CONFIG.LINE_HEIGHT_MULTIPLIER);

        // Always export at FIXED width
        const fixedWidth = CONFIG.FIXED_CANVAS_WIDTH;

        // Small vertical margins - keep minimal padding
        const verticalPadding = isMobile ? Math.round(size * CONFIG.PADDING_MULTIPLIER_MOBILE) : Math.round(size * CONFIG.PADDING_MULTIPLIER_DESKTOP);

        // Height constraints
        const minHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, lineHeight + verticalPadding * 2);
        const maxHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, Math.floor(CONFIG.FIXED_CANVAS_WIDTH * CONFIG.MAX_HEIGHT_RATIO));

        // Calculate height with constraints
        const textHeight = lines.length * lineHeight;
        const unclampedHeight = textHeight + verticalPadding * 2;
        const calculatedHeight = Math.max(minHeight, Math.min(maxHeight, unclampedHeight));

        // Dimension calculation complete

        return {
            width: fixedWidth,
            height: calculatedHeight,
            lineHeight,
            padding: verticalPadding
        };
    },

    resizeCanvas(canvas, dimensions) {
        // Get device pixel ratio with mobile-specific handling
        let dpr = window.devicePixelRatio || 1;
        const isMobile = FontManager.isMobile();

        // Limit DPR on mobile to prevent memory issues and rendering problems
        if (isMobile && dpr > 2) {
            console.log('Mobile device with high DPR detected, limiting to 2x');
            dpr = 2;
        }

        // Set actual export size in memory (scaled for pixel density)
        canvas.width = dimensions.width * dpr; // always 1200 * dpr
        canvas.height = dimensions.height * dpr; // clamped between 200..(0.75*1200)

        // Display size (responsive preview): fixed preview widths for consistent wrapping
        const displayWidth = isMobile ? CONFIG.MOBILE_CANVAS_WIDTH : CONFIG.DESKTOP_CANVAS_WIDTH;
        const displayScale = displayWidth / dimensions.width; // maintain aspect ratio
        canvas.style.width = Math.round(dimensions.width * displayScale) + 'px';
        canvas.style.height = Math.round(dimensions.height * displayScale) + 'px';

        // Scale drawing context
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Mobile-specific canvas optimizations
        if (isMobile) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }

        // Canvas scaled for sharp rendering
    },

    drawText(ctx, lines, size, dimensions) {
        const isDark = document.body.classList.contains('dark');
        const isMobile = FontManager.isMobile();

        // Clear canvas with theme-aware background matching textarea
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff'; // Match control-bg-dark and control-bg-light
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Set text color matching textarea
        ctx.fillStyle = isDark ? '#e5e7eb' : '#111827'; // Match text-dark and text-light

        // Mobile-optimized text positioning using unified constants
        const totalTextHeight = lines.length * dimensions.lineHeight;

        // Different positioning strategy for mobile vs desktop
        let startY;
        if (isMobile) {
            // On mobile: much tighter positioning, start closer to top
            const topMargin = Math.max(dimensions.padding, size * 0.5);
            startY = topMargin + dimensions.lineHeight * 0.7; // Reduced from 0.8 to 0.7
        } else {
            // Desktop: traditional center positioning
            const textBlockTop = Math.round((ctx.canvas.height - totalTextHeight) / 2);
            startY = textBlockTop + dimensions.lineHeight * 0.8;
        }

        let y = startY;


        // Set text alignment based on user preference
        const alignment = TextAlignmentManager.getCanvasAlignment();
        let drawX;

        if (alignment === 'center') {
            ctx.textAlign = 'center';
            ctx.direction = 'rtl';
            drawX = dimensions.width / 2;
        } else if (alignment === 'left') {
            ctx.textAlign = 'left';
            ctx.direction = 'rtl';
            drawX = dimensions.padding;
        } else { // right
            ctx.textAlign = 'right';
            ctx.direction = 'rtl';
            drawX = dimensions.width - dimensions.padding;
        }

        // Force RTL text rendering
        ctx.textBaseline = 'alphabetic';

        // Draw each line with selected alignment
        for (const line of lines) {
            if (line && line.trim()) {
                // Use proper RTL text rendering without RLM modification
                ctx.fillText(line, drawX, y);
            }
            y += dimensions.lineHeight;
        }

        // Mobile debugging: draw canvas bounds
        if (isMobile && window.location.search.includes('debug')) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(dimensions.padding, dimensions.padding,
                         ctx.canvas.width - dimensions.padding * 2,
                         ctx.canvas.height - dimensions.padding * 2);
        }
    }
};

// =============================================================================
// FAVICON MANAGER
// =============================================================================
const FaviconManager = {
    init() {
        // Create a better favicon with proper encoding
        this.createFavicon();
        console.log('🎯 Favicon initialized');
    },

    createFavicon() {
        // Remove existing favicons
        document.querySelectorAll('link[rel*="icon"]').forEach(link => link.remove());

        // Create SVG favicon with proper encoding
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#1f2937"/>
            <text x="16" y="24" font-family="serif" font-size="18" fill="#10b981" text-anchor="middle" font-weight="bold">׋</text>
        </svg>`;

        const encodedSvg = encodeURIComponent(svgContent).replace(/'/g, '%27').replace(/"/g, '%22');
        const faviconUrl = `data:image/svg+xml,${encodedSvg}`;

        // Add standard favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);

        // Add apple-touch-icon for mobile
        const appleFavicon = document.createElement('link');
        appleFavicon.rel = 'apple-touch-icon';
        appleFavicon.href = faviconUrl;
        document.head.appendChild(appleFavicon);

        // Add alternative PNG favicon for better compatibility
        this.createPngFavicon();
    },

    createPngFavicon() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 32;
            canvas.height = 32;

            // Background
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, 0, 32, 32);

            // MultiGender Hebrew character
            ctx.fillStyle = '#10b981';
            //ctx.font = 'bold 18px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('׋', 16, 16);

            // Convert to data URL and set as backup favicon
            const pngUrl = canvas.toDataURL('image/png');

            const pngFavicon = document.createElement('link');
            pngFavicon.rel = 'icon';
            pngFavicon.type = 'image/png';
            pngFavicon.href = pngUrl;
            document.head.appendChild(pngFavicon);

        } catch (error) {
            console.warn('PNG favicon creation failed:', error);
        }
    }
};

// =============================================================================
// THEME MANAGER
// =============================================================================
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(theme);
        console.log('🎨 Theme initialized:', theme);
    },

    toggle() {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);

        // Regenerate canvas with new theme
        setTimeout(() => CanvasRenderer.generate(), 50);
    },

    setTheme(theme) {
        // Force remove both classes first to fix Chrome light mode issue
        document.body.classList.remove('dark', 'light');

        // Add the correct class
        if (theme === 'dark') {
            document.body.classList.add('dark');
        }

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        console.log('🎨 Theme set to:', theme, 'Body classes:', document.body.className);
    }
};

// =============================================================================
// CANVAS TOGGLE MANAGER
// =============================================================================
const CanvasToggleManager = {
    init() {
        const canvasToggle = document.getElementById('canvasToggle');
        const canvasContainer = document.querySelector('.canvas-container');

        if (canvasToggle && canvasContainer) {
            canvasToggle.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        const canvasContainer = document.querySelector('.canvas-container');
        const canvasToggle = document.getElementById('canvasToggle');

        if (canvasContainer.classList.contains('hidden')) {
            canvasContainer.classList.remove('hidden');
            canvasToggle.textContent = '👁️';
            canvasToggle.title = 'Hide canvas';
        } else {
            canvasContainer.classList.add('hidden');
            canvasToggle.textContent = '🙈';
            canvasToggle.title = 'Show canvas';
        }
    }
};

// =============================================================================
// TEXT ALIGNMENT MANAGER
// =============================================================================
const TextAlignmentManager = {
    currentAlignment: 'center',

    init() {
        const alignSelect = document.getElementById('textAlignSelect');
        if (alignSelect) {
            alignSelect.addEventListener('change', (e) => this.setAlignment(e.target.value));
        }

        // Handle new visual alignment buttons
        const alignmentButtons = document.getElementById('alignmentButtons');
        if (alignmentButtons) {
            alignmentButtons.addEventListener('click', (e) => {
                const btn = e.target.closest('.align-btn');
                if (!btn) return;
                const alignment = btn.getAttribute('data-align');
                this.setAlignment(alignment);
            });
        }
    },

    setAlignment(alignment) {
        this.currentAlignment = alignment;
        const textInput = document.getElementById('textInput');

        if (!textInput) {
            console.error('❌ Text input element not found in setAlignment');
            return;
        }

        // Update visual button states
        const alignmentButtons = document.getElementById('alignmentButtons');
        if (alignmentButtons) {
            alignmentButtons.querySelectorAll('.align-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeBtn = alignmentButtons.querySelector(`[data-align="${alignment}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }

        // Update text area alignment using unified styling
        const preset = getSelectedPreset();
        const canvasFontSize = CONFIG.FONT_PRESETS[preset] || CONFIG.DEFAULT_FONT_SIZE;
        const isMobileNow = FontManager.isMobile();
        const previewWidth = isMobileNow ? CONFIG.MOBILE_CANVAS_WIDTH : CONFIG.DESKTOP_CANVAS_WIDTH;
        const displayScale = previewWidth / CONFIG.FIXED_CANVAS_WIDTH;
        const textAreaFontSize = Math.max(16, Math.round(canvasFontSize * displayScale));

        const unifiedStyle = getUnifiedTextStyle(textAreaFontSize);
        Object.assign(textInput.style, unifiedStyle);

        // Regenerate canvas with new alignment
        CanvasRenderer.generate();
    },

    getCanvasAlignment() {
        return this.currentAlignment;
    }
};

// =============================================================================
// SHARE MANAGER
// =============================================================================
const ShareManager = {
    async share() {
        try {
            const canvas = document.getElementById('canvas');

            canvas.toBlob(async (blob) => {
                const text = document.getElementById('textInput').value;
                const truncatedText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                const message = `Check out this MultiGender Hebrew text: "${truncatedText}"`;

                // Try Web Share API first (mobile)
                if (navigator.share && navigator.canShare) {
                    try {
                        const file = new File([blob], 'multigender-hebrew-text.png', { type: 'image/png' });
                        await navigator.share({
                            title: 'MultiGender Hebrew Text',
                            text: message,
                            files: [file]
                        });
                        return;
                    } catch (shareError) {
                        console.log('Web Share failed, falling back to WhatsApp');
                    }
                }

                // Fallback to WhatsApp Web
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');

                // Download image as fallback
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'multigender-hebrew-text.png';
                a.click();
                URL.revokeObjectURL(url);

            }, 'image/png');
        } catch (error) {
            console.error('Share failed:', error);
        }
    }
};

// =============================================================================
// CHARACTER KEYBOARD
// =============================================================================
const CharKeyboard = {
    init() {
        const buttons = document.querySelectorAll('.char-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const char = button.getAttribute('data-char');
                this.insertCharacter(char);
            });
        });

        // Add keyboard shortcuts
        this.initKeyboardShortcuts();
        console.log('⌨️ Character keyboard initialized');
    },

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if Shift is pressed
            if (!e.shiftKey) return;

            let charToInsert = null;

            switch (e.code) {
                case 'KeyY': // ט key (Hebrew)
                    charToInsert = '׍'; // תָּה
                    break;
                case 'KeyG': // ע key (Hebrew)
                    charToInsert = '׏'; // יָת
                    break;
                case 'KeyX': // ב key (Hebrew)
                    charToInsert = '׏'; // יָת (alternative)
                    break;
                case 'KeyD': // ס key (Hebrew)
                    charToInsert = '׫'; // הָת
                    break;
                case 'KeyA': // ז key (Hebrew)
                    charToInsert = '׮'; // נָת
                    break;
                case 'KeyP': // ק key (Hebrew)
                    charToInsert = '׭';
                    break;
                case 'KeyR': // ר key (Hebrew)
                    charToInsert = '׬';
                    break;
                case 'KeyS': // א key (Hebrew)
                    charToInsert = '׌';
                    break;
                case 'KeyT': // ת key (Hebrew)
                    charToInsert = '׎';
                    break;
                case 'KeyM': // צ key (Hebrew)
                    charToInsert = '׊';
                    break;
                case 'KeyU': // י key (Hebrew)
                    charToInsert = '׋';
                    break;
                case 'KeyH': // ח key (Hebrew)
                    charToInsert = '׉';
                    break;
                case 'KeyK': // ל key (Hebrew)
                    charToInsert = '׈';
                    break;
            }

            if (charToInsert) {
                e.preventDefault();
                this.insertCharacter(charToInsert);
                console.log(`⌨️ Keyboard shortcut: Shift+${e.key} → ${charToInsert}`);
            }
        });
    },

    insertCharacter(char) {
        const textInput = document.getElementById('textInput');
        const cursorPos = textInput.selectionStart;
        const text = textInput.value;

        // Insert character at cursor position
        const newText = text.slice(0, cursorPos) + char + text.slice(cursorPos);
        textInput.value = newText;

        // Set cursor position after inserted character
        const newCursorPos = cursorPos + char.length;
        textInput.setSelectionRange(newCursorPos, newCursorPos);
        textInput.focus();

        // Trigger canvas update
        CanvasRenderer.generate();
    }
};

// =============================================================================
// ABOUT MODAL
// =============================================================================
const AboutModal = {
    init() {
        const aboutLink = document.getElementById('aboutLink');
        const modal = document.getElementById('aboutModal');
        const closeButton = document.getElementById('closeModal');

        if (!aboutLink || !modal || !closeButton) {
            console.warn('⚠️ About modal elements not found, skipping initialization');
            return;
        }

        // Show modal when about link is clicked
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.show();
        });

        // Close modal when X button is clicked
        closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hide();
            }
        });
    },

    show() {
        const modal = document.getElementById('aboutModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    },

    hide() {
        const modal = document.getElementById('aboutModal');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
};

// =============================================================================
// CHEAT SHEET MODAL
// =============================================================================
const CheatSheetModal = {
    init() {
        const cheatSheetLink = document.getElementById('cheatSheetLink');
        const modal = document.getElementById('cheatSheetModal');
        const closeButton = document.getElementById('closeCheatSheet');

        if (!cheatSheetLink || !modal || !closeButton) {
            console.warn('⚠️ Cheat sheet modal elements not found, skipping initialization');
            return;
        }

        // Show modal when cheat sheet link is clicked
        cheatSheetLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.show();
        });

        // Close modal when X button is clicked
        closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hide();
            }
        });
    },

    show() {
        const modal = document.getElementById('cheatSheetModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    },

    hide() {
        const modal = document.getElementById('cheatSheetModal');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
};

// =============================================================================
// ENVIRONMENT MANAGER
// =============================================================================
const EnvironmentManager = {
    init() {
        // Show staging indicator if in staging environment
        if (CONFIG.IS_STAGING) {
            const indicator = document.getElementById('environmentIndicator');
            if (indicator) {
                indicator.style.display = 'inline-block';
                indicator.textContent = '[STAGING]';
            }
            console.log('🔧 Running in STAGING environment');
        } else if (CONFIG.IS_PRODUCTION) {
            console.log('🚀 Running in PRODUCTION environment');
        } else {
            console.log('💻 Running in LOCAL/DEVELOPMENT environment');
        }

        // Add environment info to console
        console.log('Environment details:', {
            hostname: window.location.hostname,
            isStaging: CONFIG.IS_STAGING,
            isProduction: CONFIG.IS_PRODUCTION,
            version: CONFIG.VERSION
        });
    }
};

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Log startup information
        Utils.logStartup();

        // Initialize environment detection and UI
        EnvironmentManager.init();

        // Run configuration validation first
        ConfigValidator.runStartupValidation();

        // Set footer version text
        VersionManager.syncVersions();

        // Mobile-specific initialization
        const isMobile = FontManager.isMobile();
        if (isMobile) {
            console.log('📱 Mobile device detected, applying mobile optimizations');

            // Prevent zoom on input focus (additional safety)
            document.addEventListener('touchstart', function() {}, {passive: true});

            // Add mobile body class for additional styling
            document.body.classList.add('mobile');
        }

        // Initialize managers
        FaviconManager.init();
        ThemeManager.init();

        // Preload font before initial render (important for mobile)
        //console.log('🔤 Preloading fonts...');
        //await FontManager.loadMultiGenderFont();

        // Initial render with extra delay for mobile
        if (isMobile) {
            setTimeout(() => CanvasRenderer.generate(), 300);
        } else {
            CanvasRenderer.generate();
        }

        // Create debounced canvas generator with longer delay for mobile
        const debounceDelay = isMobile ? CONFIG.DEBOUNCE_DELAY * 2 : CONFIG.DEBOUNCE_DELAY;
        const debouncedGenerate = Utils.debounce(() => CanvasRenderer.generate(), debounceDelay);

        // Event listeners with null checks
        const textInput = document.getElementById('textInput');
        const fontSizeSelect = document.getElementById('fontSizeSelect');

        if (!textInput) {
            console.error('❌ Text input element not found during initialization');
            return;
        }
        // Size can come from select or new buttons (sizeButtons)

        // Hard height limit enforcement
        function enforceHeightLimit() {
            const maxHeight = parseInt(textInput.dataset.maxHeight) || 200;
            const currentHeight = textInput.scrollHeight;
            const isDark = document.body.classList.contains('dark');

            if (currentHeight > maxHeight) {
                // Revert to previous valid content
                textInput.value = textInput.dataset.lastValidValue || '';
                textInput.style.height = maxHeight + 'px';

                // Visual feedback for limit reached
                textInput.style.borderColor = '#ef4444';
                textInput.style.backgroundColor = isDark ? '#1f1f2e' : '#fef2f2';
                setTimeout(() => {
                    textInput.style.borderColor = '';
                    textInput.style.backgroundColor = isDark ? '#0b1220' : '#f8fafc';
                }, 1000);

                return false; // Input rejected
            }

            // Store valid content and allow growth up to max height
            textInput.dataset.lastValidValue = textInput.value;
            textInput.style.height = 'auto';
            const newHeight = Math.min(maxHeight, textInput.scrollHeight);
            textInput.style.height = newHeight + 'px';
            return true; // Input accepted
        }

        textInput.addEventListener('input', (e) => {
            if (enforceHeightLimit()) {
                wrapTextareaToCanvasWidth(textInput);
                debouncedGenerate();
            }
        });

        // Prevent paste if it would exceed limit
        textInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const testValue = textInput.value + paste;
            const testHeight = measureTextHeight(testValue, textInput);
            const maxHeight = parseInt(textInput.dataset.maxHeight) || 200;
            const isDark = document.body.classList.contains('dark');

            if (testHeight <= maxHeight) {
                textInput.value = testValue;
                textInput.dataset.lastValidValue = testValue;
                textInput.style.height = testHeight + 'px';
                debouncedGenerate();
            } else {
                // Visual feedback for paste rejection
                textInput.style.borderColor = '#ef4444';
                textInput.style.backgroundColor = isDark ? '#1f1f2e' : '#fef2f2';
                setTimeout(() => {
                    textInput.style.borderColor = '';
                    textInput.style.backgroundColor = isDark ? '#0b1220' : '#f8fafc';
                }, 1000);
            }
        });

        function measureTextHeight(text, element) {
            const testElement = element.cloneNode();
            testElement.style.position = 'absolute';
            testElement.style.visibility = 'hidden';
            testElement.style.height = 'auto';
            testElement.style.width = element.style.width;
            testElement.style.fontSize = element.style.fontSize;
            testElement.style.lineHeight = element.style.lineHeight;
            testElement.style.padding = element.style.padding;
            testElement.value = text;
            document.body.appendChild(testElement);
            const height = testElement.scrollHeight;
            document.body.removeChild(testElement);
            return height;
        }



        function applySelectedFontSize(triggerCanvasUpdate = true) {
            const preset = getSelectedPreset();
            const canvasFontSize = CONFIG.FONT_PRESETS[preset] || CONFIG.DEFAULT_FONT_SIZE;
            const isMobileNow = FontManager.isMobile();

            // Match textarea scale to canvas display scale for identical wrapping
            const previewWidth = isMobileNow ? CONFIG.MOBILE_CANVAS_WIDTH : CONFIG.DESKTOP_CANVAS_WIDTH;
            const displayScale = previewWidth / CONFIG.FIXED_CANVAS_WIDTH;
            const textAreaFontSize = Math.max(16, Math.round(canvasFontSize * displayScale));

            // Calculate dynamic padding that matches canvas system
            const canvasPadding = isMobileNow ?
                Math.round(canvasFontSize * CONFIG.PADDING_MULTIPLIER_MOBILE) :
                Math.round(canvasFontSize * CONFIG.PADDING_MULTIPLIER_DESKTOP);
            const textareaPadding = Math.round(canvasPadding * displayScale);

            // Apply unified styling
            const unifiedStyle = getUnifiedTextStyle(textAreaFontSize);

            // Set CSS custom property for other elements
            document.documentElement.style.setProperty('--current-font-size', `${textAreaFontSize}px`);

            // Apply all styles to textarea
            Object.assign(textInput.style, unifiedStyle);

            // Apply dynamic padding
            textInput.style.padding = `${textareaPadding}px`;

            // Force style recalc to ensure visual update
            textInput.offsetHeight;

            // Set width equal to scaled wrap width (content-box)
            const scaledWrapWidth2 = (CONFIG.FIXED_CANVAS_WIDTH - (CONFIG.CANVAS_PADDING * 2)) * displayScale;
            textInput.style.width = `${Math.round(scaledWrapWidth2)}px`;

            // Process textarea content to match canvas wrapping exactly
            if (textInput.value) {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
//                tempCtx.font = `${textAreaFontSize}px ${CONFIG.FONT_FAMILY}`;

                // Use the same text processing as canvas for identical wrapping
                const lines = textInput.value.split('\n');
                const wrappedLines = [];
                // Match canvas wrapping width but scaled to preview CSS pixels
                const scaledMaxLineWidth = (CONFIG.FIXED_CANVAS_WIDTH - (CONFIG.CANVAS_PADDING * 2)) * displayScale;

                for (const line of lines) {
                    if (line.trim()) {
                        const wrapped = TextProcessor.wrapText(line, scaledMaxLineWidth, tempCtx);
                        wrappedLines.push(...wrapped);
                    } else {
                        wrappedLines.push('');
                    }
                }

                // Update textarea with processed text to match canvas exactly
                textInput.value = wrappedLines.join('\n');
            }

            // Dynamic textarea height - no scrollbars, hard cap by viewport
            textInput.style.height = 'auto';
            const maxViewportHeight = Math.max(200, window.innerHeight * (4/3)); // Max 4/3 of viewport
            const currentContentHeight = textInput.scrollHeight;
            const finalHeight = Math.min(maxViewportHeight, currentContentHeight);
            textInput.style.height = finalHeight + 'px';

            // Store max height for input validation (this is the limit, not current height)
            textInput.dataset.maxHeight = maxViewportHeight;

            if (triggerCanvasUpdate) {
                CanvasRenderer.generate();
            }
        }

        // React to preset changes
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', () => applySelectedFontSize(true));
        }
        const sizeButtons = document.getElementById('sizeButtons');
        if (sizeButtons) {
            sizeButtons.addEventListener('click', (e) => {
                const btn = e.target.closest('.size-btn');
                if (!btn) return;
                sizeButtons.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applySelectedFontSize(true);
            });
        }

        // Initialize with default preset
        if (fontSizeSelect) fontSizeSelect.value = 'normal';
        applySelectedFontSize(false);

        // Initialize height limit
        textInput.dataset.lastValidValue = textInput.value;

        // Update layout on orientation change or window resize
        window.addEventListener('orientationchange', () => {
            setTimeout(() => applySelectedFontSize(true), 100);
        });

        window.addEventListener('resize', () => {
            setTimeout(() => applySelectedFontSize(true), 100);
        });

        // Force character buttons to use correct font after DOM load
        setTimeout(() => {
            const charButtons = document.querySelectorAll('.char-button');
            charButtons.forEach(button => {
//                button.style.fontFamily = CONFIG.FONT_FAMILY;
 //               button.style.fontFeatureSettings = '"liga" 1, "kern" 1';
            });
            const sizeLetterButtons = document.querySelectorAll('#sizeButtons .size-btn');
            sizeLetterButtons.forEach(btn => {
                //btn.style.fontFamily = CONFIG.FONT_FAMILY;
//                btn.style.fontFeatureSettings = '"liga" 1, "kern" 1';
 //               btn.style.lineHeight = '1';
                // Visually encode sizes so users can understand at a glance
                const kind = btn.getAttribute('data-size');
                if (kind === 'small') {
                    btn.style.fontSize = '18px';
                } else if (kind === 'large') {
                    btn.style.fontSize = '26px';
                } else {
                    btn.style.fontSize = '22px';
                }
            });
        }, 100);
        // Initialize buttons with null checks
        const themeToggle = document.getElementById('themeToggle');
        const shareButton = document.getElementById('shareWhatsApp');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
        } else {
            console.warn('⚠️ Theme toggle button not found');
        }

        if (shareButton) {
            shareButton.addEventListener('click', () => ShareManager.share());
        } else {
            console.warn('⚠️ Share button not found');
        }

        // Initialize new managers
        CanvasToggleManager.init();
        TextAlignmentManager.init();

        // Initialize character keyboard
        CharKeyboard.init();

        // Initialize synchronization systems
        TextSyncManager.startSyncMonitoring();

        // Initialize about modal
        AboutModal.init();

        // Initialize cheat sheet modal
        CheatSheetModal.init();

        // Mobile-specific event listeners
        if (isMobile) {
            // Handle orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    console.log('📱 Orientation changed, re-rendering canvas');
                    CanvasRenderer.generate();
                }, 500);
            });

            // Handle page visibility changes (background/foreground)
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    console.log('📱 Page became visible, checking canvas');
                    setTimeout(() => CanvasRenderer.generate(), 200);
                }
            });
        }

        console.log('✅ Application initialized successfully', isMobile ? '(Mobile Mode)' : '(Desktop Mode)');

    } catch (error) {
        console.error('❌ Application initialization failed:', error);

        // Fallback initialization without font loading
        console.log('🔄 Attempting fallback initialization...');
        try {
            FaviconManager.init();
            ThemeManager.init();
            document.getElementById('textInput').value = ', ברוכ׊׉ הבא׊׉!';
            CanvasRenderer.generate();
            CharKeyboard.init();
            AboutModal.init();
            CheatSheetModal.init();
            console.log('✅ Fallback initialization successful');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization also failed:', fallbackError);
        }
    }
});

// Helper: wrap textarea content to match canvas wrapping exactly
function wrapTextareaToCanvasWidth(textInput) {
    if (!textInput) return;
    const preset = getSelectedPreset();
    const canvasFontSize = CONFIG.FONT_PRESETS[preset] || CONFIG.DEFAULT_FONT_SIZE;
    const isMobileNow = FontManager.isMobile();
    const previewWidth = isMobileNow ? CONFIG.MOBILE_CANVAS_WIDTH : CONFIG.DESKTOP_CANVAS_WIDTH;
    const displayScale = previewWidth / CONFIG.FIXED_CANVAS_WIDTH;
    const textAreaFontSize = Math.max(16, Math.round(canvasFontSize * displayScale));

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
//    tempCtx.font = `${textAreaFontSize}px ${CONFIG.FONT_FAMILY}`;

    const lines = textInput.value.split('\n');
    const wrappedLines = [];
    const scaledMaxLineWidth = (CONFIG.FIXED_CANVAS_WIDTH - (CONFIG.CANVAS_PADDING * 2)) * displayScale;

    for (const line of lines) {
        if (line.trim()) {
            const wrapped = TextProcessor.wrapText(line, scaledMaxLineWidth, tempCtx);
            wrappedLines.push(...wrapped);
        } else {
            wrappedLines.push('');
        }
    }

    const newValue = wrappedLines.join('\n');
    if (newValue !== textInput.value) {
        const cursorAtEnd = textInput.selectionStart === textInput.value.length && textInput.selectionEnd === textInput.value.length;
        textInput.value = newValue;
        if (cursorAtEnd) {
            const len = textInput.value.length;
            textInput.selectionStart = len;
            textInput.selectionEnd = len;
        }
    }
}