/**
 * MultiGender Hebrew Text Designer - Simplified Version
 * Version: 0.0.100
 */

// Configuration
const CONFIG = {
    VERSION: '0.0.100',
    FONT_FAMILY: 'AlefMultiGenderHebrew, sans-serif',
    FONT_SIZES: { small: 14, normal: 16, large: 20 },
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT_MAX: 1600, // 4/3 of 1200 = 1600
    CANVAS_PADDING: 40,
    LINE_HEIGHT: 1.4,
    DPI_SCALE: 2 // Higher DPI for better quality
};

// Global state
let currentFontSize = CONFIG.FONT_SIZES.normal;
let isDark = false;
let updateTimeout;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MultiGender Hebrew Text Designer v' + CONFIG.VERSION);
    
    // Set initial text
    const textDiv = document.getElementById('textDiv');
    textDiv.textContent = 'ברוכ׊׉ הבא׊׉!';
    
    // Generate initial canvas
    generateCanvas();
    
    // Setup event listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    const textDiv = document.getElementById('textDiv');
    const themeToggle = document.getElementById('themeToggle');
    const shareButton = document.getElementById('shareButton');
    
    // Text input
    textDiv.addEventListener('input', function() {
        debouncedUpdate();
    });
    
    textDiv.addEventListener('paste', function() {
        setTimeout(debouncedUpdate, 100);
    });
    
    // Character buttons
    document.querySelectorAll('.char-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const char = btn.dataset.char;
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(char));
            textDiv.focus();
            debouncedUpdate();
        });
    });
    
    // Theme toggle button
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Share button
    shareButton.addEventListener('click', () => {
        shareCanvas();
    });
    
    // Theme toggle keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && e.ctrlKey) {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Debounced update function
function debouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(generateCanvas, 300);
}

// Toggle theme
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    generateCanvas();
}

// Generate canvas using html2canvas - capture textarea directly like working test
async function generateCanvas() {
    const canvas = document.getElementById('canvas');
    const textDiv = document.getElementById('textDiv');
    
    // Get text and process it
    const text = textDiv.textContent;
    if (!text.trim()) {
        canvas.width = textDiv.offsetWidth * CONFIG.DPI_SCALE;
        canvas.height = textDiv.offsetHeight * CONFIG.DPI_SCALE;
        canvas.style.width = textDiv.offsetWidth + 'px';
        canvas.style.height = textDiv.offsetHeight + 'px';
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = window.getComputedStyle(textDiv).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    try {
        // Use html2canvas directly on textarea - exactly like working test file
        const canvasElement = await html2canvas(textDiv, {
            scale: CONFIG.DPI_SCALE,
            letterRendering: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: window.getComputedStyle(textDiv).backgroundColor
        });
        
        // Set canvas dimensions to match the captured element
        canvas.width = canvasElement.width;
        canvas.height = canvasElement.height;
        canvas.style.width = (canvasElement.width / CONFIG.DPI_SCALE) + 'px';
        canvas.style.height = (canvasElement.height / CONFIG.DPI_SCALE) + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasElement, 0, 0);
        
        console.log('Canvas generated with html2canvas (DPI scaled)');
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Display dimensions:', canvas.style.width, 'x', canvas.style.height);
        
    } catch (error) {
        console.error('Error capturing with HTML2Canvas:', error);
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