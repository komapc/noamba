/**
 * MultiGender Hebrew Text Designer - Simplified Version
 * Version: 2.6.1
 */

// Configuration
const CONFIG = {
    VERSION: '2.7.0',
    FONT_FAMILY: 'AlefMultiGenderHebrew, sans-serif',
    FONT_SIZES: { small: 82, normal: 96, large: 110 },
    CANVAS_WIDTH: 1200,
    CANVAS_PADDING: 40,
    LINE_HEIGHT: 1.4
};

// Global state
let currentFontSize = CONFIG.FONT_SIZES.normal;
let currentAlignment = 'center';
let isDark = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MultiGender Hebrew Text Designer v' + CONFIG.VERSION);
    
    // Set initial text
    const textInput = document.getElementById('textInput');
    textInput.value = 'ברוכ׊׉ הבא׊׉!';
    
    // Apply initial styling
    autoResizeTextarea();
    updateTextareaStyle();
    
    // Generate initial canvas
    generateCanvas();
    
    // Event listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    const textInput = document.getElementById('textInput');
    const themeToggle = document.getElementById('themeToggle');
    const sizeButtons = document.getElementById('sizeButtons');
    const alignmentButtons = document.getElementById('alignmentButtons');
    
    // Text input
    textInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateTextareaStyle();
        generateCanvas();
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark', isDark);
        updateTextareaStyle();
        generateCanvas();
    });
    
    // Size buttons
    sizeButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('.size-btn');
        if (btn) {
            sizeButtons.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFontSize = CONFIG.FONT_SIZES[btn.dataset.size];
            updateTextareaStyle();
            generateCanvas();
        }
    });
    
    // Alignment buttons
    alignmentButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('.align-btn');
        if (btn) {
            alignmentButtons.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAlignment = btn.dataset.align;
            updateTextareaStyle();
            generateCanvas();
        }
    });
    
    // Character buttons
    document.querySelectorAll('.char-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const char = btn.dataset.char;
            const start = textInput.selectionStart;
            const end = textInput.selectionEnd;
            const text = textInput.value;
            textInput.value = text.slice(0, start) + char + text.slice(end);
            textInput.focus();
            textInput.setSelectionRange(start + char.length, start + char.length);
            autoResizeTextarea();
            updateTextareaStyle();
            generateCanvas();
        });
    });
    
    // Canvas toggle button
    document.getElementById('canvasToggle').addEventListener('click', () => {
        const canvasContainer = document.querySelector('.canvas-container');
        canvasContainer.classList.toggle('hidden');
    });
    
    // Share button
    document.getElementById('shareWhatsApp').addEventListener('click', shareCanvas);
}

// Auto-resize textarea to fit content
function autoResizeTextarea() {
    const textInput = document.getElementById('textInput');
    textInput.style.height = 'auto';
    textInput.style.height = textInput.scrollHeight + 'px';
}

// Update textarea styling to match canvas
function updateTextareaStyle() {
    const textInput = document.getElementById('textInput');
    const isMobile = window.innerWidth <= 768;
    
    // Calculate responsive font size
    const displayScale = isMobile ? 350 / CONFIG.CANVAS_WIDTH : 500 / CONFIG.CANVAS_WIDTH;
    const textareaFontSize = Math.max(16, Math.round(currentFontSize * displayScale));
    const textareaPadding = Math.round(CONFIG.CANVAS_PADDING * displayScale);
    
    // Apply styling
    textInput.style.fontFamily = CONFIG.FONT_FAMILY;
    textInput.style.fontSize = `${textareaFontSize}px`;
    textInput.style.lineHeight = CONFIG.LINE_HEIGHT;
    textInput.style.direction = 'rtl';
    textInput.style.textAlign = currentAlignment;
    textInput.style.backgroundColor = isDark ? '#0f172a' : '#ffffff';
    textInput.style.color = isDark ? '#e5e7eb' : '#111827';
    textInput.style.padding = `${textareaPadding}px`;
    textInput.style.width = isMobile ? '350px' : '500px';
}

// Generate canvas with proper RTL text rendering
function generateCanvas() {
    const canvas = document.getElementById('canvas');
    const textInput = document.getElementById('textInput');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Get text and process it
    const text = textInput.value;
    if (!text.trim()) {
        canvas.width = textInput.offsetWidth;
        canvas.height = textInput.offsetHeight;
        canvas.style.width = textInput.offsetWidth + 'px';
        canvas.style.height = textInput.offsetHeight + 'px';
        ctx.fillStyle = window.getComputedStyle(textInput).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    // Get textarea styles
    const textareaStyle = window.getComputedStyle(textInput);
    const isMobile = window.innerWidth <= 768;
    
    // Calculate responsive font size
    const displayScale = isMobile ? 350 / CONFIG.CANVAS_WIDTH : 500 / CONFIG.CANVAS_WIDTH;
    const textareaFontSize = Math.max(16, Math.round(currentFontSize * displayScale));
    const textareaPadding = Math.round(CONFIG.CANVAS_PADDING * displayScale);
    
    // Calculate textarea content width (excluding padding)
    const textareaWidth = (isMobile ? 350 : 500) - (textareaPadding * 2);
    
    // Wrap text to match textarea exactly
    const wrappedLines = wrapTextToFitWidth(text, textareaWidth, textareaFontSize);
    
    // Calculate canvas dimensions
    const lineHeight = textareaFontSize * CONFIG.LINE_HEIGHT;
    const textHeight = wrappedLines.length * lineHeight;
    const canvasHeight = Math.max(100, textHeight + textareaPadding * 2);
    
    // Set canvas size to match textarea exactly
    const displayWidth = isMobile ? 350 : 500;
    
    canvas.width = displayWidth;
    canvas.height = canvasHeight;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    // Clear canvas with textarea background
    ctx.fillStyle = textareaStyle.backgroundColor;
    ctx.fillRect(0, 0, displayWidth, canvasHeight);
    
    // Set text properties to match textarea EXACTLY
    ctx.font = `${textareaFontSize}px ${CONFIG.FONT_FAMILY}`;
    ctx.fillStyle = textareaStyle.color;
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'rtl';
    ctx.textAlign = currentAlignment;
    
    // Calculate text position to match textarea exactly
    let startY;
    if (currentAlignment === 'center') {
        startY = canvasHeight / 2 - (textHeight - lineHeight) / 2;
    } else {
        startY = textareaPadding + lineHeight;
    }
    
    // Draw text exactly as it appears in textarea
    let y = startY;
    for (const line of wrappedLines) {
        if (line.trim()) {
            let x;
            if (currentAlignment === 'center') {
                x = displayWidth / 2;
            } else if (currentAlignment === 'left') {
                x = textareaPadding;
            } else {
                x = displayWidth - textareaPadding;
            }
            ctx.fillText(line, x, y);
        }
        y += lineHeight;
    }
}

// Wrap text to fit within the given width
function wrapTextToFitWidth(text, maxWidth, fontSize) {
    // Create a temporary canvas to measure text
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${fontSize}px ${CONFIG.FONT_FAMILY}`;
    
    // Split text into lines and wrap each line
    const inputLines = text.split('\n');
    const wrappedLines = [];
    
    for (const line of inputLines) {
        if (line.trim()) {
            const wrapped = wrapLine(line, maxWidth, tempCtx);
            wrappedLines.push(...wrapped);
        } else {
            wrappedLines.push('');
        }
    }
    
    return wrappedLines;
}

// Wrap a single line to fit within the given width
function wrapLine(text, maxWidth, ctx) {
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

// Share canvas
function shareCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'multigender-hebrew-text.png';
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateTextareaStyle();
        generateCanvas();
    }, 100);
});
