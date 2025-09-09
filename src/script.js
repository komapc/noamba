// Canvas renderer module
const CanvasRenderer = {
    generate() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const text = document.getElementById('textInput').value;
        const font = document.getElementById('fontSelect').value;
        const sizeVal = parseInt(document.getElementById('sizeInput').value, 10);
        const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 32;

        // Clear canvas with theme-aware background
        const isDark = document.body.classList.contains('dark');
        ctx.fillStyle = isDark ? '#0b0f14' : 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Wait for fonts to load
        document.fonts.ready.then(() => {
            // Set text color based on theme for contrast
            ctx.fillStyle = isDark ? '#e5e7eb' : '#111827';
            ctx.font = `${size}px "${font}"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.direction = 'rtl';
            ctx.textRendering = 'optimizeLegibility';
            
            // Enable advanced text features
            ctx.fontKerning = 'normal';
            if (font === 'Ezra SIL SR') {
                ctx.mozTextStyle = `${size}px "${font}"`;
                ctx.webkitFontSmoothing = 'antialiased';
                ctx.fontVariantLigatures = 'normal';
            }
            
            try {
                // Enable all OpenType features
                const features = {
                    'kern': 'normal',
                    'liga': 'normal',
                    'hlig': 'normal',
                    'calt': 'normal',
                    'dlig': 'normal',
                    'ccmp': 'normal',
                    'rlig': 'normal',
                    'locl': 'normal',
                    'mark': 'normal',
                    'mkmk': 'normal'
                };
                
                ctx.textAlign = 'center';
                const fontString = `${size}px "${font}"`;
                const featureString = Object.entries(features)
                    .map(([feature, value]) => `"${feature}" ${value}`)
                    .join(', ');
                
                ctx.font = fontString;
                if (ctx.fontFeatureSettings !== undefined) {
                    ctx.fontFeatureSettings = featureString;
                }
            } catch (e) {
                console.log('OpenType features not fully supported:', e);
            }

            // Draw multi-line text centered
            const lines = text.split(/\r?\n/);
            const lineHeight = Math.round(size * 1.3);
            const totalHeight = lineHeight * Math.max(lines.length, 1);
            let y = Math.round((canvas.height - totalHeight) / 2) + size;
            for (const line of lines) {
                ctx.fillText(line, canvas.width / 2, y);
                y += lineHeight;
            }
        });
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
