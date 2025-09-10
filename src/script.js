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
            
            const fontFace = new FontFace(
                'AlefMultiGenderHebrew',
                window.location.protocol === 'file:' 
                    ? 'url(fonts/AlefMultiGndr-Regular.ttf)'
                    : 'url(fonts/AlefMultiGndr-Regular.woff)'
            );
            
            const loadedFont = await fontFace.load();
            document.fonts.add(loadedFont);
            console.log('Loaded WOFF font successfully');

            // Verify font loading
            const testText = CONFIG.MULTIGENDER_CHARS;
            const testElement = document.createElement('span');
            testElement.style.fontFamily = 'AlefMultiGenderHebrew';
            testElement.style.fontSize = '32px';
            testElement.textContent = testText;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            document.body.appendChild(testElement);

            const width = testElement.getBoundingClientRect().width;
            document.body.removeChild(testElement);

            const success = width > 10;
            console.log('Font verification:', {
                font: '32px AlefMultiGenderHebrew',
                width,
                protocol: window.location.protocol,
                success
            });

            return success;
        } catch (error) {
            console.error('Font loading failed:', error);
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
        const font = document.getElementById('fontSelect').value;
        const sizeVal = parseInt(document.getElementById('sizeInput').value, 10);
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
        // Set font
        const hasSpecialChars = Utils.hasMultiGenderChars(document.getElementById('textInput').value);
        if (hasSpecialChars) {
            ctx.font = `${size}px AlefMultiGenderHebrew, sans-serif`;
        } else {
            const fontMap = {
                'AlefMultiGenderHebrew': 'AlefMultiGenderHebrew',
                'Arial': 'Arial',
                'Times New Roman': 'Times New Roman',
                'Georgia': 'Georgia',
                'Verdana': 'Verdana',
                'Tahoma': 'Tahoma',
                'Courier New': 'Courier New',
                'serif': 'serif',
                'sans-serif': 'sans-serif'
            };
            const actualFont = fontMap[font] || font;
            ctx.font = `${size}px "${actualFont}", "AlefMultiGenderHebrew", sans-serif`;
        }

        // Set text properties
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.direction = 'rtl';
        ctx.textRendering = 'optimizeLegibility';
        ctx.fontKerning = 'normal';
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
        const lineHeight = Math.round(size * 1.4);
        const padding = Math.round(size * 0.8);
        
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
        const minWidth = 200;
        const maxWidthLimit = 600;
        const calculatedWidth = Math.max(minWidth, Math.min(maxWidthLimit, maxWidth + extraWidth + padding * 2));

        // Calculate height
        const minHeight = 120;
        const textHeight = lines.length * lineHeight;
        const extraPadding = Math.max(20, size * 0.5);
        const calculatedHeight = Math.max(minHeight, textHeight + padding * 2 + extraPadding);

        return {
            width: calculatedWidth,
            height: calculatedHeight,
            lineHeight,
            padding
        };
    },

    resizeCanvas(canvas, dimensions) {
        // Get device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // Set actual size in memory (scaled for pixel density)
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        
        // Scale canvas back down using CSS
        canvas.style.width = dimensions.width + 'px';
        canvas.style.height = dimensions.height + 'px';
        
        // Scale drawing context
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        console.log('Canvas scaled for sharp rendering:', {
            logicalSize: `${dimensions.width}x${dimensions.height}`,
            actualSize: `${canvas.width}x${canvas.height}`,
            devicePixelRatio: dpr
        });
    },

    drawText(ctx, lines, size, dimensions) {
        const isDark = document.body.classList.contains('dark');
        
        // Clear canvas with theme-aware background
        ctx.fillStyle = isDark ? '#0b0f14' : 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Set text color
        ctx.fillStyle = isDark ? '#e5e7eb' : '#111827';
        
        // Calculate text positioning
        const totalTextHeight = lines.length * dimensions.lineHeight;
        const textBlockTop = Math.round((ctx.canvas.height - totalTextHeight) / 2);
        const startY = textBlockTop + dimensions.lineHeight * 0.8;
        let y = startY;
        
        console.log('Text positioning details:', {
            canvasHeight: ctx.canvas.height,
            totalTextHeight,
            textBlockTop,
            startY,
            lineHeight: dimensions.lineHeight,
            lines: lines.length
        });
        
        // Draw each line
        for (const line of lines) {
            if (line && line.trim()) {
                // Manual center calculation for consistent positioning
                const lineWidth = ctx.measureText(line).width;
                const centerX = (ctx.canvas.width - lineWidth) / 2;
                
                console.log('Drawing line:', line, 'at x:', centerX, 'y:', y);
                
                // Use left alignment with calculated center position
                ctx.textAlign = 'left';
                ctx.fillText(line, centerX, y);
            }
            y += dimensions.lineHeight;
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
            });
        });
        console.log('⌨️ Character keyboard initialized');
    }
};

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Log startup information
    Utils.logStartup();
    
    // Initialize managers
    FaviconManager.init();
    ThemeManager.init();
    
    // Set initial text and generate canvas
    document.getElementById('textInput').value = ', ברוכ׊׉ הבא׊׉!  הללו וורלד';
    CanvasRenderer.generate();

    // Create debounced canvas generator
    const debouncedGenerate = Utils.debounce(() => CanvasRenderer.generate(), CONFIG.DEBOUNCE_DELAY);

    // Event listeners
    document.getElementById('textInput').addEventListener('input', debouncedGenerate);
    document.getElementById('fontSelect').addEventListener('change', () => CanvasRenderer.generate());
    document.getElementById('sizeInput').addEventListener('input', debouncedGenerate);
    document.getElementById('themeToggle').addEventListener('click', () => ThemeManager.toggle());
    document.getElementById('shareWhatsApp').addEventListener('click', () => ShareManager.share());
    
    // Initialize character keyboard
    CharKeyboard.init();
    
    console.log('✅ Application initialized successfully');
});