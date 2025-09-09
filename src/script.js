// Canvas renderer module
const CanvasRenderer = {
    generate() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const text = document.getElementById('textInput').value;
        const font = document.getElementById('fontSelect').value;
        const sizeVal = parseInt(document.getElementById('sizeInput').value, 10);
        const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 32;

        // Wait for fonts to load, especially the MultiGender font
        const loadFont = async () => {
            try {
                // Load the specific font with proper family name
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
                await document.fonts.load(`${size}px "${actualFont}"`);
                
                // Also try to load the MultiGender font specifically for special characters
                if (actualFont !== 'AlefMultiGenderHebrew') {
                    await document.fonts.load(`${size}px "AlefMultiGenderHebrew"`);
                }
            } catch (e) {
                console.log('Font loading error:', e);
            }
        };
        
        loadFont().then(() => {
            // Add a small delay to ensure font is fully loaded
            setTimeout(() => {
                this.setupCanvas(ctx, font, size);
                const lines = this.prepareText(text);
                const dimensions = this.calculateDimensions(ctx, lines, size);
                this.resizeCanvas(canvas, dimensions);
                this.drawText(ctx, lines, size, dimensions);
            }, 100);
        });
    },

    setupCanvas(ctx, font, size) {
        // Map font names to actual font families
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
        
        // For special characters, always use MultiGender font as primary
        const hasSpecialChars = /[׭׬׌׎׫׊׏׋׉׮׍׈]/.test(document.getElementById('textInput').value);
        const fontString = hasSpecialChars 
            ? `${size}px "AlefMultiGenderHebrew", "${actualFont}", "Noto Rashi Hebrew", sans-serif`
            : `${size}px "${actualFont}", "AlefMultiGenderHebrew", "Noto Rashi Hebrew", sans-serif`;
            
        ctx.font = fontString;
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
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        return lines.length === 0 ? [''] : lines;
    },

    calculateDimensions(ctx, lines, size) {
        const lineHeight = Math.round(size * 1.3);
        const padding = Math.round(size * 0.5);
        
        let maxWidth = 0;
        lines.forEach(line => {
            const metrics = ctx.measureText(line);
            maxWidth = Math.max(maxWidth, metrics.width);
        });
        
        return {
            width: Math.max(400, Math.min(1200, maxWidth + padding * 2)),
            height: Math.max(100, lines.length * lineHeight + padding * 2),
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
        
        // Draw multi-line text centered
        const totalTextHeight = lines.length * dimensions.lineHeight;
        let y = Math.round((ctx.canvas.height - totalTextHeight) / 2) + size;
        
        for (const line of lines) {
            ctx.fillText(line, ctx.canvas.width / 2, y);
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
