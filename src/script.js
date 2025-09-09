// Version information
const APP_VERSION = '1.2.0';
const BUILD_TIME = new Date().toISOString();

// Log version information
console.log('🚀 MultiGender Hebrew Text Designer');
console.log('📦 Version:', APP_VERSION);
console.log('🕒 Build Time:', BUILD_TIME);
console.log('🌐 Protocol:', window.location.protocol);
console.log('📍 URL:', window.location.href);

// Canvas renderer module
const CanvasRenderer = {
    generate() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const text = document.getElementById('textInput').value;
        const font = document.getElementById('fontSelect').value;
        const sizeVal = parseInt(document.getElementById('sizeInput').value, 10);
        const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 32;

        // Unified font loading for both protocols
        const loadFontUnified = async () => {
            try {
                console.log('Loading font for protocol:', window.location.protocol);
                
                // Try WOFF first (works for both protocols)
                try {
                    const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.woff)');
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    console.log('Loaded WOFF font successfully');
                } catch (woffError) {
                    console.log('WOFF failed, trying TTF:', woffError.message);
                    // Fallback to TTF
                    const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.ttf)');
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    console.log('Loaded TTF font successfully');
                }
                
                // Verify font is working
                const testCanvas = document.createElement('canvas');
                const testCtx = testCanvas.getContext('2d');
                testCtx.font = '32px "AlefMultiGenderHebrew"';
                const testText = '׭׬׌׎׫׊׏׋׉׮׍׈';
                const metrics = testCtx.measureText(testText);
                
                console.log('Font verification:', {
                    font: testCtx.font,
                    width: metrics.width,
                    protocol: window.location.protocol,
                    success: metrics.width > 10
                });
                
                return metrics.width > 10;
            } catch (e) {
                console.error('Unified font loading failed:', e);
                return false;
            }
        };

        // Load fonts and render
        loadFontUnified().then((fontLoaded) => {
            console.log('Font loading result:', fontLoaded);
            console.log('Starting canvas rendering...');
            
            this.setupCanvas(ctx, font, size);
            const initialLines = this.prepareText(text);
            console.log('Initial lines:', initialLines);
            
            // Apply line wrapping to each line
            const maxLineWidth = 300; // Reduced for better text wrapping
            const wrappedLines = [];
            initialLines.forEach(line => {
                const wrapped = this.wrapText(line, maxLineWidth, ctx);
                wrappedLines.push(...wrapped);
            });
            
            console.log('Wrapped lines:', wrappedLines);
            const dimensions = this.calculateDimensions(ctx, wrappedLines, size);
            console.log('Canvas dimensions:', dimensions);
            this.resizeCanvas(canvas, dimensions);
            this.drawText(ctx, wrappedLines, size, dimensions);
            console.log('Canvas rendering completed');
        });
    },

    setupCanvas(ctx, font, size) {
        // Always use MultiGender font for special characters, fallback to selected font for regular text
        const hasSpecialChars = /[׭׬׌׎׫׊׏׋׉׮׍׈]/.test(document.getElementById('textInput').value);
        
        if (hasSpecialChars) {
            // Try multiple font approaches
            console.log('Attempting multiple font loading approaches...');
            
            // Approach 1: Direct font setting
            ctx.font = `${size}px "AlefMultiGenderHebrew"`;
            console.log('Approach 1 - Canvas font:', ctx.font);
            
            // Approach 2: Try with fallback
            ctx.font = `${size}px "AlefMultiGenderHebrew", "AlefMultiGndr", sans-serif`;
            console.log('Approach 2 - Canvas font with fallback:', ctx.font);
            
            // Approach 3: Force reload and retry
            const testText = '׭׬׌׎׫׊׏׋׉׮׍׈';
            
            // Test each approach
            const approaches = [
                `${size}px "AlefMultiGenderHebrew"`,
                `${size}px "AlefMultiGndr"`,
                `${size}px "AlefMultiGenderHebrew", "AlefMultiGndr", sans-serif`,
                `${size}px "AlefMultiGenderHebrew", "AlefMultiGndr", "Arial Unicode MS", sans-serif`
            ];
            
            let workingApproach = 0;
            for (let i = 0; i < approaches.length; i++) {
                ctx.font = approaches[i];
                const metrics = ctx.measureText(testText);
                console.log(`Approach ${i + 1} (${approaches[i]}): width=${metrics.width}`);
                
                if (metrics.width > 10) {
                    console.log(`Using approach ${i + 1} - font working!`);
                    workingApproach = i;
                    break;
                }
            }
            
            // Force the working approach
            ctx.font = approaches[workingApproach];
            console.log('Final working font:', ctx.font);
            
            // Final test
            const finalMetrics = ctx.measureText(testText);
            console.log('Final canvas font metrics:', finalMetrics);
            
            // Compare with HTML element
            const testElement = document.createElement('div');
            testElement.style.fontFamily = 'AlefMultiGenderHebrew';
            testElement.style.fontSize = `${size}px`;
            testElement.textContent = testText;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            console.log('HTML element font family:', computedStyle.fontFamily);
            console.log('HTML element font size:', computedStyle.fontSize);
            
            // Remove test element
            document.body.removeChild(testElement);
            
        } else {
            // Use selected font with MultiGender as fallback
            const fontMap = {
                'AlefMultiGenderHebrew': 'AlefMultiGenderHebrew',
                'Amatic SC': 'Amatic SC',
                'Caveat': 'Caveat',
                'Noto Rashi Hebrew': 'Noto Rashi Hebrew',
                'Rubik Scribble': 'Rubik Scribble',
                'Satisfy': 'Satisfy',
                'Varela Round': 'Varela Round',
                'Dana Yad': 'Dana Yad'
            };
            const actualFont = fontMap[font] || font;
            ctx.font = `${size}px "${actualFont}", "AlefMultiGenderHebrew", sans-serif`;
        }
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.direction = 'rtl';
        ctx.textRendering = 'optimizeLegibility';
        ctx.fontKerning = 'normal';
        
        // Enable OpenType features
        try {
            const features = {
                'kern': 'normal', 'liga': 'normal', 'hlig': 'normal',
                'calt': 'normal', 'dlig': 'normal', 'ccmp': 'normal',
                'rlig': 'normal', 'locl': 'normal', 'mark': 'normal', 'mkmk': 'normal'
            };
            
            const featureString = Object.entries(features)
                .map(([feature, value]) => `"${feature}" ${value}`)
                .join(', ');
            
            if (ctx.fontFeatureSettings !== undefined) {
                ctx.fontFeatureSettings = featureString;
            }
        } catch (e) {
            console.log('OpenType features not fully supported:', e);
        }
    },

    prepareText(text) {
        // First split by explicit line breaks
        const explicitLines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        return explicitLines.length === 0 ? [''] : explicitLines;
    },

    wrapText(text, maxWidth, ctx) {
        // For Hebrew text, split by characters rather than words for better wrapping
        const isHebrew = /[\u0590-\u05FF]/.test(text);
        
        if (isHebrew) {
            // For Hebrew, split by characters and wrap more conservatively
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
            // For English, use word-based wrapping
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
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
    },

    calculateDimensions(ctx, lines, size) {
        const lineHeight = Math.round(size * 1.4); // Slightly more line height
        const padding = Math.round(size * 0.8); // More padding for better spacing
        
        let maxWidth = 0;
        lines.forEach(line => {
            const metrics = ctx.measureText(line);
            maxWidth = Math.max(maxWidth, metrics.width);
        });
        
        // Add extra width for special characters
        const hasSpecialChars = lines.some(line => /[׭׬׌׎׫׊׏׋׉׮׍׈]/.test(line));
        const extraWidth = hasSpecialChars ? size * 0.5 : 0;
        
        // More intelligent width calculation
        const minWidth = 200;
        const maxWidthLimit = 600; // Reduced max width for better proportions
        const calculatedWidth = Math.max(minWidth, Math.min(maxWidthLimit, maxWidth + extraWidth + padding * 2));
        
        console.log('Width calculation details:', {
            maxWidth,
            extraWidth,
            padding,
            calculatedWidth,
            maxWidthLimit
        });
        
        // Better height calculation - add extra space for text positioning
        const minHeight = 120;
        const textHeight = lines.length * lineHeight;
        const calculatedHeight = Math.max(minHeight, textHeight + padding * 2 + size); // Add font size for better spacing
        
        console.log('Canvas sizing details:', {
            maxWidth,
            extraWidth,
            hasSpecialChars,
            lines: lines.length,
            lineHeight,
            padding,
            calculatedWidth,
            calculatedHeight
        });
        
        return {
            width: calculatedWidth,
            height: calculatedHeight,
            lineHeight,
            padding
        };
    },

    resizeCanvas(canvas, dimensions) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
    },

    drawText(ctx, lines, size, dimensions) {
        const isDark = document.body.classList.contains('dark');
        
        // Clear canvas with theme-aware background
        ctx.fillStyle = isDark ? '#0b0f14' : 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Set text color based on theme
        ctx.fillStyle = isDark ? '#e5e7eb' : '#111827';
        
        // Ensure we're using the correct font for special characters
        const textInput = document.getElementById('textInput').value;
        const hasSpecialChars = /[׭׬׌׎׫׊׏׋׉׮׍׈]/.test(textInput);
        console.log('Text input:', textInput);
        console.log('Has special chars:', hasSpecialChars);
        
        if (hasSpecialChars) {
            // Use the same font approach that worked in setupCanvas
            const approaches = [
                `${size}px "AlefMultiGenderHebrew"`,
                `${size}px "AlefMultiGndr"`,
                `${size}px "AlefMultiGenderHebrew", "AlefMultiGndr", sans-serif`,
                `${size}px "AlefMultiGenderHebrew", "AlefMultiGndr", "Arial Unicode MS", sans-serif`
            ];
            
            // Test which approach works
            let workingFont = approaches[0];
            for (let i = 0; i < approaches.length; i++) {
                ctx.font = approaches[i];
                const testText = '׭׬׌׎׫׊׏׋׉׮׍׈';
                const metrics = ctx.measureText(testText);
                if (metrics.width > 10) {
                    workingFont = approaches[i];
                    break;
                }
            }
            
            ctx.font = workingFont;
            console.log('Drawing with font:', ctx.font);
            
            // Test individual special characters
            const specialChars = '׭׬׌׎׫׊׏׋׉׮׍׈';
            for (let i = 0; i < specialChars.length; i++) {
                const char = specialChars[i];
                const charCode = char.charCodeAt(0);
                const metrics = ctx.measureText(char);
                console.log(`Char ${char} (U+${charCode.toString(16).toUpperCase()}): width=${metrics.width}`);
            }
        }
        
        // Draw multi-line text centered with proper positioning
        const totalTextHeight = lines.length * dimensions.lineHeight;
        const startY = Math.round((ctx.canvas.height - totalTextHeight) / 2) + dimensions.lineHeight;
        let y = startY;
        
        console.log('Text positioning details:', {
            canvasHeight: ctx.canvas.height,
            totalTextHeight,
            startY,
            lineHeight: dimensions.lineHeight,
            lines: lines.length
        });
        
        for (const line of lines) {
            console.log('Drawing line:', line, 'at y:', y, 'with font:', ctx.font);
            
            // Debug: Test special character rendering (only in development)
            if (hasSpecialChars && lines.indexOf(line) === 0 && false) { // Disabled for production
                console.log('Testing individual character rendering...');
                const testY = Math.max(20, y - 50);
                ctx.fillText('Test: ׭׬׌', ctx.canvas.width / 2, testY);
            }
            
            // Ensure line is not empty or corrupted and is within canvas bounds
            if (line && line.trim()) {
                // Ensure text is within canvas bounds
                const textY = Math.max(size, Math.min(y, ctx.canvas.height - 10));
                ctx.fillText(line, ctx.canvas.width / 2, textY);
                console.log('Drew line at y:', textY);
            }
            y += dimensions.lineHeight;
        }
    }
};

// Theme management module
const ThemeManager = {
    init() {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const saved = localStorage.getItem('theme_noamba');
        const isDark = saved ? saved === 'dark' : prefersDark;
        document.body.classList.toggle('dark', isDark);
    },

    toggle() {
        const nextIsDark = !document.body.classList.contains('dark');
        document.body.classList.toggle('dark', nextIsDark);
        localStorage.setItem('theme_noamba', nextIsDark ? 'dark' : 'light');
        CanvasRenderer.generate();
    }
};

// Share functionality module
const ShareManager = {
    async share() {
        const canvas = document.getElementById('canvas');
        
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'text-image.png', { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Generated Text Image'
                });
            } else {
                this.download(blob);
            }
        } catch (error) {
            console.log('Sharing failed', error);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            this.download(blob);
        }
    },

    download(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'text-image.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
};

// Character keyboard module
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
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    ThemeManager.init();
    document.getElementById('textInput').value = ', ברוכ׊׉ הבא׊׉!  הללו וורלד';
    CanvasRenderer.generate();

    // Event listeners
    document.getElementById('textInput').addEventListener('input', () => CanvasRenderer.generate());
    document.getElementById('fontSelect').addEventListener('change', () => CanvasRenderer.generate());
    document.getElementById('sizeInput').addEventListener('input', () => CanvasRenderer.generate());
    document.getElementById('themeToggle').addEventListener('click', () => ThemeManager.toggle());
    document.getElementById('shareWhatsApp').addEventListener('click', () => ShareManager.share());
    
    // Initialize character keyboard
    CharKeyboard.init();
});
