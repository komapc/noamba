/**
 * MultiGender Hebrew Text Designer - Simplified Version
 * Version: 2.8.0
 */

// Configuration
const CONFIG = {
    VERSION: '2.8.0',
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
let resizeTimeout;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MultiGender Hebrew Text Designer v' + CONFIG.VERSION);
    
    // Set initial text
    const textInput = document.getElementById('textInput');
    textInput.value = 'ברוכ׊׉ הבא׊׉!';
    
    // Apply initial styling and generate canvas
    autoResizeTextarea();
    updateTextareaStyle();
    generateCanvas();
    
    // Setup event listeners
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
    
    // Window resize with debouncing
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateTextareaStyle();
            generateCanvas();
        }, 100);
    });
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

// Generate canvas with proper word wrapping that matches textarea
async function generateCanvas() {
    const canvas = document.getElementById('canvas');
    const textInput = document.getElementById('textInput');
    
    // Get text and process it
    const text = textInput.value;
    if (!text.trim()) {
        canvas.width = textInput.offsetWidth;
        canvas.height = textInput.offsetHeight;
        canvas.style.width = textInput.offsetWidth + 'px';
        canvas.style.height = textInput.offsetHeight + 'px';
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = window.getComputedStyle(textInput).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    try {
        // Use html2canvas with letterRendering: true - NO manual wrapping logic
        const canvasElement = await html2canvas(textInput, {
            scale: 1,
            letterRendering: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: window.getComputedStyle(textInput).backgroundColor
        });
        
        // Set canvas dimensions to match the captured element
        canvas.width = canvasElement.width;
        canvas.height = canvasElement.height;
        canvas.style.width = canvasElement.width + 'px';
        canvas.style.height = canvasElement.height + 'px';
        
        // Draw the captured image directly
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasElement, 0, 0);
        
        console.log('Canvas generated with html2canvas (no manual wrapping)');
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        
    } catch (error) {
        console.error('Error generating canvas with html2canvas:', error);
        // Fallback to empty canvas
        canvas.width = textInput.offsetWidth;
        canvas.height = textInput.offsetHeight;
        canvas.style.width = textInput.offsetWidth + 'px';
        canvas.style.height = textInput.offsetHeight + 'px';
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = window.getComputedStyle(textInput).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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