/**
 * MultiGender Hebrew Text Designer
 * A tool for creating beautiful text with MultiGender Hebrew fonts
 * Version: 1.2.0
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const CONFIG = {
    VERSION: '1.12.2',
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
    FIXED_CANVAS_WIDTH: 1600,
    MIN_CANVAS_HEIGHT: 300,
    MAX_HEIGHT_RATIO: 0.75,
    MULTIGENDER_CHARS: '׭׬׌׎׫׊׏׋׉׮׍׈',
    DEBOUNCE_DELAY: 150,
    // Canvas dimensions
    MOBILE_CANVAS_WIDTH: 350,
    DESKTOP_CANVAS_WIDTH: 500,
    CANVAS_PADDING: 20,
    TEXTAREA_PADDING: 24
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
        try {
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
    },

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    },

    async verifyFontLoading() {
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
    }
};

// =============================================================================
// TEXT PROCESSING
// =============================================================================
const TextProcessor = {
    wrapText(text, maxWidth, ctx) {
        const isHebrew = Utils.hasHebrewChars(text);
        
        if (isHebrew) {
            // Character-based wrapping for Hebrew
            const chars = text.split('');
            const lines = [];
            let currentLine = '';
            
            for (const char of chars) {
                const testLine = currentLine + char;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }
            
            return lines;
        } else {
            // Word-based wrapping for English
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
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
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        
        if (!canvas) {
            console.error('❌ Canvas element not found');
            return;
        }
        if (!textInput) {
            console.error('❌ Text input element not found');
            return;
        }
        if (!fontSizeSelect) {
            console.error('❌ Font size select element not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const text = textInput.value;
        const font = 'AlefMultiGenderHebrew'; // Always use MultiGender Hebrew font
        const selectedPreset = fontSizeSelect.value || 'normal';
        const size = CONFIG.FONT_PRESETS[selectedPreset] || CONFIG.DEFAULT_FONT_SIZE;

        // Ensure font is loaded
        await FontManager.loadMultiGenderFont();

        // Setup canvas
        this.setupCanvas(ctx, font, size);

        // Process text into lines using FIXED export width and current size
        const lines = this.processText(text, ctx, size);

        // Calculate dimensions and resize canvas
        const dimensions = this.calculateDimensions(lines, size, ctx);
        this.resizeCanvas(canvas, dimensions);

        // Re-setup canvas after resize (context is reset)
        this.setupCanvas(ctx, font, size);

        // Draw the text
        this.drawText(ctx, lines, size, dimensions);
    },

    setupCanvas(ctx, font, size) {
        // Always use MultiGender Hebrew font with fallbacks
        ctx.font = `${size}px AlefMultiGenderHebrew, sans-serif`;

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
        const lineHeight = Math.round(fontSizePx * 1.4);
        const maxHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, Math.floor(CONFIG.FIXED_CANVAS_WIDTH * CONFIG.MAX_HEIGHT_RATIO));
        const verticalPadding = Math.round(fontSizePx * (FontManager.isMobile() ? 0.2 : 0.25));
        const availableHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, maxHeight) - verticalPadding * 2;
        const maxLines = Math.max(1, Math.floor(availableHeight / lineHeight));

        return wrappedLines.slice(0, maxLines);
    },

    calculateDimensions(lines, size, ctx) {
        const isMobile = FontManager.isMobile();
        const lineHeight = Math.round(size * 1.4);
        
        // Always export at FIXED width
        const fixedWidth = CONFIG.FIXED_CANVAS_WIDTH;
        
        // Small vertical margins - keep minimal padding
        const verticalPadding = isMobile ? Math.round(size * 0.2) : Math.round(size * 0.25);
        
        // Height constraints
        const minHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, lineHeight + verticalPadding * 2);
        const maxHeight = Math.max(CONFIG.MIN_CANVAS_HEIGHT, Math.floor(CONFIG.FIXED_CANVAS_WIDTH * CONFIG.MAX_HEIGHT_RATIO));
        
        // Calculate height with constraints
        const textHeight = lines.length * lineHeight;
        const unclampedHeight = textHeight + verticalPadding * 2;
        const calculatedHeight = Math.max(minHeight, Math.min(maxHeight, unclampedHeight));

        console.log('Dimension calculation details:', {
            isMobile,
            size,
            lineHeight,
            verticalPadding,
            textHeight,
            fixedWidth,
            calculatedHeight,
            lines: lines.length
        });

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
        
        // Display size (responsive preview): scale down for on-screen viewing
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
        
        console.log('Canvas scaled for sharp rendering:', {
            logicalSize: `${dimensions.width}x${dimensions.height}`,
            actualSize: `${canvas.width}x${canvas.height}`,
            devicePixelRatio: window.devicePixelRatio,
            usedDPR: dpr,
            isMobile,
            memoryUsage: `${Math.round(canvas.width * canvas.height * 4 / 1024)}KB`
        });
    },

    drawText(ctx, lines, size, dimensions) {
        const isDark = document.body.classList.contains('dark');
        const isMobile = FontManager.isMobile();
        
        // Clear canvas with theme-aware background (darker in dark mode)
        ctx.fillStyle = isDark ? '#020617' : '#ffffff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Set text color
        ctx.fillStyle = isDark ? '#e5e7eb' : '#111827';
        
        // Mobile-optimized text positioning
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
        
        console.log('Mobile-optimized text positioning:', {
            canvasHeight: ctx.canvas.height,
            totalTextHeight,
            startY,
            lineHeight: dimensions.lineHeight,
            lines: lines.length,
            isMobile,
            padding: dimensions.padding,
            topMargin: isMobile ? Math.max(dimensions.padding, size * 0.5) : 'N/A'
        });
        
        // Set text alignment based on user preference
        const alignment = TextAlignmentManager.getCanvasAlignment();
        let drawX;
        
        if (alignment === 'center') {
            ctx.textAlign = 'center';
            ctx.direction = 'ltr';
            drawX = dimensions.width / 2;
        } else if (alignment === 'left') {
            ctx.textAlign = 'left';
            ctx.direction = 'ltr';
            drawX = dimensions.padding;
        } else { // right
            ctx.textAlign = 'right';
            ctx.direction = 'rtl';
            drawX = dimensions.width - dimensions.padding;
        }
        
        // Draw each line with selected alignment
        for (const line of lines) {
            if (line && line.trim()) {
                console.log('Drawing line with', alignment, 'alignment:', line, 'at x:', drawX, 'y:', y);
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
            ctx.font = 'bold 18px serif';
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
    currentAlignment: 'right',
    
    init() {
        const alignSelect = document.getElementById('textAlignSelect');
        if (alignSelect) {
            alignSelect.addEventListener('change', (e) => this.setAlignment(e.target.value));
        }
    },
    
    setAlignment(alignment) {
        this.currentAlignment = alignment;
        const textInput = document.getElementById('textInput');
        
        if (!textInput) {
            console.error('❌ Text input element not found in setAlignment');
            return;
        }
        
        // Update text area alignment
        textInput.style.textAlign = alignment;
        if (alignment === 'right') {
            textInput.style.direction = 'rtl';
        } else if (alignment === 'left') {
            textInput.style.direction = 'ltr';
        } else { // center
            textInput.style.direction = 'ltr';
        }
        
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
// APPLICATION INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Log startup information
        Utils.logStartup();
        
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
        console.log('🔤 Preloading fonts...');
        await FontManager.loadMultiGenderFont();
        
        // Set initial text and generate canvas
        document.getElementById('textInput').value = 'ברוכ׊׉ הבא׊׉!';
        
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
        if (!fontSizeSelect) {
            console.error('❌ Font size select element not found during initialization');
            return;
        }
        
        textInput.addEventListener('input', debouncedGenerate);
        
        function applySelectedFontSize(triggerCanvasUpdate = true) {
            const preset = fontSizeSelect.value || 'normal';
            const canvasFontSize = CONFIG.FONT_PRESETS[preset] || CONFIG.DEFAULT_FONT_SIZE;
            const isMobileNow = FontManager.isMobile();
            const isDark = document.body.classList.contains('dark');
            
            // Scale textarea font to on-screen preview width to avoid oversized input
            const basePreviewWidth = isMobileNow ? CONFIG.MOBILE_CANVAS_WIDTH : Math.min(window.innerWidth - 40, CONFIG.FIXED_CANVAS_WIDTH);
            const previewWidth = Math.min(basePreviewWidth, CONFIG.FIXED_CANVAS_WIDTH);
            const displayScale = previewWidth / CONFIG.FIXED_CANVAS_WIDTH;
            const textAreaFontSize = Math.max(16, Math.round(canvasFontSize * displayScale));

            document.documentElement.style.setProperty('--current-font-size', `${textAreaFontSize}px`);
            
            textInput.style.fontSize = `${textAreaFontSize}px`;
            textInput.style.lineHeight = '1.4';
            
            // Match canvas background and text colors
            textInput.style.backgroundColor = isDark ? '#020617' : '#ffffff';
            textInput.style.color = isDark ? '#e5e7eb' : '#111827';
            
            // Remove scrollbars and make resizable
            textInput.style.overflow = 'hidden';
            textInput.style.resize = 'none';
            
            // Force style recalc to ensure visual update
            textInput.offsetHeight;
            
            textInput.style.width = `${previewWidth - CONFIG.TEXTAREA_PADDING}px`;
            // Dynamic textarea height - no scrollbars
            textInput.style.height = 'auto';
            textInput.style.height = Math.min(2000, textInput.scrollHeight) + 'px';
            
            textInput.style.direction = 'rtl';
            textInput.style.textAlign = 'right';
            textInput.style.margin = '0 auto';
            
            if (triggerCanvasUpdate) {
                CanvasRenderer.generate();
            }
        }
        
        // React to preset changes
        fontSizeSelect.addEventListener('change', () => applySelectedFontSize(true));
        
        // Initialize with default preset
        fontSizeSelect.value = 'normal';
        applySelectedFontSize(false);
        
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
                button.style.fontFamily = "'AlefMultiGenderHebrew', 'AlefMultiGndr', system-ui, sans-serif";
                button.style.fontFeatureSettings = '"liga" 1, "kern" 1';
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