/**
 * MultiGender Hebrew Text Designer
 * A tool for creating beautiful text with MultiGender Hebrew fonts
 * Version: 1.2.0
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const CONFIG = {
    VERSION: '1.2.0',
    BUILD_TIME: new Date().toISOString(),
    DEFAULT_FONT_SIZE: 32,
    MULTIGENDER_CHARS: '׭׬׌׎׫׊׏׋׉׮׍׈',
    DEBOUNCE_DELAY: 150
};

// =============================================================================
// UTILITIES
// =============================================================================
const Utils = {
    // Log application startup info
    logStartup() {
        console.log('🚀 MultiGender Hebrew Text Designer');
        console.log('📦 Version:', CONFIG.VERSION);
        console.log('🕒 Build Time:', CONFIG.BUILD_TIME);
        console.log('🌐 Protocol:', window.location.protocol);
        console.log('📍 URL:', window.location.href);
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
    async loadMultiGenderFont() {
        try {
            console.log('Loading font for protocol:', window.location.protocol);
            console.log('User agent:', navigator.userAgent);
            console.log('Is mobile:', this.isMobile());
            
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
                    console.log('FontFace API: Font loaded successfully');
                    return true;
                }));
            } catch (error) {
                console.warn('FontFace API not supported:', error);
            }
            
            // Approach 2: document.fonts.load for mobile compatibility
            try {
                fontLoadPromises.push(
                    document.fonts.load('32px AlefMultiGenderHebrew').then(() => {
                        console.log('document.fonts.load: Font loaded successfully');
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
                console.log('Mobile device detected, adding extra wait time');
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Verify font loading with multiple checks
            const success = await this.verifyFontLoading();
            
            console.log('Font verification result:', success);
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

            console.log('Font verification details:', {
                font: '32px AlefMultiGenderHebrew',
                width,
                protocol: window.location.protocol,
                isMobile: this.isMobile(),
                success: width > 10
            });

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
    async generate() {
        console.log('Starting canvas rendering...');
        
        // Get elements and values
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const text = document.getElementById('textInput').value;
        const font = 'AlefMultiGenderHebrew'; // Always use MultiGender Hebrew font
        const sizeVal = parseInt(document.getElementById('sizeSlider').value, 10);
        const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : CONFIG.DEFAULT_FONT_SIZE;

        // Ensure font is loaded
        await FontManager.loadMultiGenderFont();

        // Setup canvas
        this.setupCanvas(ctx, font, size);

        // Process text into lines
        const lines = this.processText(text, ctx);
        console.log('Wrapped lines:', lines);

        // Calculate dimensions and resize canvas
        const dimensions = this.calculateDimensions(lines, size, ctx);
        this.resizeCanvas(canvas, dimensions);
        console.log('Canvas dimensions:', dimensions);

        // Re-setup canvas after resize (context is reset)
        this.setupCanvas(ctx, font, size);

        // Draw the text
        this.drawText(ctx, lines, size, dimensions);
        console.log('Canvas rendering completed');
    },

    setupCanvas(ctx, font, size) {
        // Always use MultiGender Hebrew font with fallbacks
        ctx.font = `${size}px AlefMultiGenderHebrew, sans-serif`;

        // Set basic text properties (alignment will be set in drawText)
        ctx.textBaseline = 'alphabetic';
        ctx.textRendering = 'optimizeLegibility';
        ctx.fontKerning = 'normal';
        
        console.log('Canvas text properties set:', {
            font: ctx.font,
            textBaseline: ctx.textBaseline
        });
    },

    processText(text, ctx) {
        const lines = text.split('\n');
        const wrappedLines = [];
        const maxLineWidth = 300;

        for (const line of lines) {
            if (line.trim()) {
                const wrapped = TextProcessor.wrapText(line, maxLineWidth, ctx);
                wrappedLines.push(...wrapped);
            } else {
                wrappedLines.push('');
            }
        }

        return wrappedLines;
    },

    calculateDimensions(lines, size, ctx) {
        const isMobile = FontManager.isMobile();
        const lineHeight = Math.round(size * 1.4);
        
        // Mobile-optimized padding (much less padding on mobile)
        const padding = isMobile ? Math.round(size * 0.3) : Math.round(size * 0.6);
        
        // Calculate width
        let maxWidth = 0;
        for (const line of lines) {
            if (line.trim()) {
                const metrics = ctx.measureText(line);
                maxWidth = Math.max(maxWidth, metrics.width);
            }
        }

        const hasSpecialChars = lines.some(line => Utils.hasMultiGenderChars(line));
        const extraWidth = hasSpecialChars ? 16 : 0;
        const minWidth = isMobile ? 150 : 200;
        const maxWidthLimit = isMobile ? 400 : 600;
        const calculatedWidth = Math.max(minWidth, Math.min(maxWidthLimit, maxWidth + extraWidth + padding * 2));

        // Mobile-optimized height calculation - much more compact on mobile
        const minHeight = isMobile ? Math.max(60, size + 20) : 120;
        const textHeight = lines.length * lineHeight;
        const extraPadding = isMobile ? Math.max(8, size * 0.15) : Math.max(20, size * 0.5);
        
        // On mobile, make canvas height much tighter to actual content
        let calculatedHeight;
        if (isMobile) {
            calculatedHeight = Math.max(minHeight, textHeight + padding * 2 + extraPadding);
            // Extra mobile optimization: if single line, make it even more compact
            if (lines.length === 1) {
                calculatedHeight = Math.max(size + 30, textHeight + padding * 1.5);
            }
        } else {
            calculatedHeight = Math.max(minHeight, textHeight + padding * 2 + extraPadding);
        }

        console.log('Dimension calculation details:', {
            isMobile,
            size,
            lineHeight,
            padding,
            textHeight,
            extraPadding,
            calculatedWidth,
            calculatedHeight,
            lines: lines.length
        });

        return {
            width: calculatedWidth,
            height: calculatedHeight,
            lineHeight,
            padding
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
        
        // Set actual size in memory (scaled for pixel density)
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        
        // Scale canvas back down using CSS
        canvas.style.width = dimensions.width + 'px';
        canvas.style.height = dimensions.height + 'px';
        
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
        
        // Clear canvas with theme-aware background (matching control colors)
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
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
        
        // Set consistent center alignment for all platforms
        ctx.textAlign = 'center';
        ctx.direction = 'ltr'; // Use LTR for consistent centering behavior
        
        // Use logical dimensions for text positioning (not scaled canvas dimensions)
        const centerX = dimensions.width / 2;
        
        // Draw each line centered
        for (const line of lines) {
            if (line && line.trim()) {
                console.log('Drawing centered line:', line, 'at center x:', centerX, 'y:', y);
                ctx.fillText(line, centerX, y);
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
        document.body.classList.toggle('dark', theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
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
        document.getElementById('textInput').value = ', ברוכ׊׉ הבא׊׉!  הללו וורלד';
        
        // Initial render with extra delay for mobile
        if (isMobile) {
            setTimeout(() => CanvasRenderer.generate(), 300);
        } else {
            CanvasRenderer.generate();
        }

        // Create debounced canvas generator with longer delay for mobile
        const debounceDelay = isMobile ? CONFIG.DEBOUNCE_DELAY * 2 : CONFIG.DEBOUNCE_DELAY;
        const debouncedGenerate = Utils.debounce(() => CanvasRenderer.generate(), debounceDelay);

        // Event listeners
        document.getElementById('textInput').addEventListener('input', debouncedGenerate);
        
        // Size slider with display update
        const sizeSlider = document.getElementById('sizeSlider');
        const sizeDisplay = document.getElementById('sizeDisplay');
        
        sizeSlider.addEventListener('input', (e) => {
            sizeDisplay.textContent = e.target.value;
            debouncedGenerate();
        });
        document.getElementById('themeToggle').addEventListener('click', () => ThemeManager.toggle());
        document.getElementById('shareWhatsApp').addEventListener('click', () => ShareManager.share());
        
        // Initialize character keyboard
        CharKeyboard.init();
        
        // Initialize about modal
        AboutModal.init();
        
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
            document.getElementById('textInput').value = ', ברוכ׊׉ הבא׊׉!  הללו וורלד';
            CanvasRenderer.generate();
            CharKeyboard.init();
            AboutModal.init();
            console.log('✅ Fallback initialization successful');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization also failed:', fallbackError);
        }
    }
});