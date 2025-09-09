// Canvas renderer module
const CanvasRenderer = {
    generate() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const text = document.getElementById('textInput').value;
        const font = document.getElementById('fontSelect').value;
        const sizeVal = parseInt(document.getElementById('sizeInput').value, 10);
        const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 32;

        // Check if MultiGender font is available and load it
        const ensureMultiGenderFont = async () => {
            try {
                // Check current protocol and adjust font loading accordingly
                const isFileProtocol = window.location.protocol === 'file:';
                console.log('Current protocol:', window.location.protocol);
                
                if (isFileProtocol) {
                    console.log('File protocol detected - using different font loading approach');
                    // For file:// protocol, try to load font directly
                    const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.woff)');
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    console.log('Loaded font via FontFace API for file protocol');
                } else {
                    // For http:// protocol, use standard loading
                    await document.fonts.load('32px "AlefMultiGenderHebrew"');
                    console.log('Loaded font via document.fonts.load for HTTP protocol');
                }
                
                // Check if font is actually available
                const testCanvas = document.createElement('canvas');
                const testCtx = testCanvas.getContext('2d');
                testCtx.font = '32px "AlefMultiGenderHebrew"';
                const testText = '׭׬׌׎׫׊׏׋׉׮׍׈';
                const metrics = testCtx.measureText(testText);
                
                console.log('MultiGender font test:', {
                    font: testCtx.font,
                    metrics: metrics,
                    width: metrics.width,
                    protocol: window.location.protocol
                });
                
                // If width is 0 or very small, font might not be loaded
                if (metrics.width < 10) {
                    console.warn('MultiGender font may not be loaded properly, trying TTF fallback');
                    // Try loading TTF as fallback
                    const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.ttf)');
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    console.log('Loaded TTF fallback');
                }
            } catch (e) {
                console.error('Font loading error:', e);
            }
        };

        // Load fonts and render
        ensureMultiGenderFont().then(() => {
            // Wait for all fonts to be ready
            document.fonts.ready.then(() => {
                console.log('Starting canvas rendering...');
                
                // Force reload the MultiGender font specifically for canvas
                const reloadFont = async () => {
                    try {
                        const isFileProtocol = window.location.protocol === 'file:';
                        console.log('Reloading font for protocol:', window.location.protocol);
                        
                        if (isFileProtocol) {
                            // For file protocol, try both WOFF and TTF
                            try {
                                const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.woff)');
                                await fontFace.load();
                                document.fonts.add(fontFace);
                                console.log('Reloaded WOFF font for file protocol');
                            } catch (woffError) {
                                console.log('WOFF failed, trying TTF:', woffError);
                                const fontFace = new FontFace('AlefMultiGenderHebrew', 'url(fonts/AlefMultiGndr-Regular.ttf)');
                                await fontFace.load();
                                document.fonts.add(fontFace);
                                console.log('Reloaded TTF font for file protocol');
                            }
                        } else {
                            // For HTTP protocol, use standard approach
                            await document.fonts.load('32px "AlefMultiGenderHebrew"');
                            console.log('Reloaded font via document.fonts.load for HTTP protocol');
                        }
                    } catch (e) {
                        console.log('Font reload error:', e);
                    }
                };
                
                reloadFont().then(() => {
                    this.setupCanvas(ctx, font, size);
                    const lines = this.prepareText(text);
                    console.log('Prepared lines:', lines);
                    const dimensions = this.calculateDimensions(ctx, lines, size);
                    console.log('Canvas dimensions:', dimensions);
                    this.resizeCanvas(canvas, dimensions);
                    this.drawText(ctx, lines, size, dimensions);
                    console.log('Canvas rendering completed');
                });
            });
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
        
        // Draw multi-line text centered
        const totalTextHeight = lines.length * dimensions.lineHeight;
        let y = Math.round((ctx.canvas.height - totalTextHeight) / 2) + size;
        
        for (const line of lines) {
            console.log('Drawing line:', line, 'with font:', ctx.font);
            
            // Test drawing individual characters
            if (hasSpecialChars) {
                console.log('Testing individual character rendering...');
                const testY = y - 50; // Draw test above main text
                ctx.fillText('Test: ׭׬׌', ctx.canvas.width / 2, testY);
            }
            
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
