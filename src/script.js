/**
 * MultiGender Hebrew Text Designer - Simplified Version
 * Version: 0.1.2
 */

// Configuration
const CONFIG = {
    VERSION: '0.1.2',
    FONT_FAMILY: 'AlefMultiGenderHebrew, sans-serif',
    FONT_SIZES: { small: 16, normal: 20, large: 24 },
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT_MAX: 1200, // Reduced height limit for better UX
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
    
    // Initialize textarea (empty by default)
    const textDiv = document.getElementById('textDiv');
    
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
        checkHeightLimit();
        debouncedUpdate();
    });
    
    textDiv.addEventListener('paste', function() {
        setTimeout(() => {
            checkHeightLimit();
            debouncedUpdate();
        }, 100);
    });
    
    // Character buttons
    document.querySelectorAll('.char-button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isHeightExceeded()) {
                return; // Don't add characters if height limit exceeded
            }
            
            const char = btn.dataset.char;
            const selection = window.getSelection();
            
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(char));
                
                // Move cursor to end of inserted text
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // If no selection, append to end
                textDiv.textContent += char;
                
                // Move cursor to end
                const range = document.createRange();
                range.selectNodeContents(textDiv);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            textDiv.focus();
            checkHeightLimit();
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

// Height limit functions
function isHeightExceeded() {
    const textDiv = document.getElementById('textDiv');
    return textDiv.scrollHeight > CONFIG.CANVAS_HEIGHT_MAX;
}

function checkHeightLimit() {
    const textDiv = document.getElementById('textDiv');
    if (isHeightExceeded()) {
        textDiv.style.borderColor = '#e74c3c';
        textDiv.style.backgroundColor = isDark ? '#2d1b1b' : '#fdf2f2';
        textDiv.contentEditable = 'false';
    } else {
        // Reset to theme-appropriate colors
        textDiv.style.borderColor = '';
        textDiv.style.backgroundColor = '';
        textDiv.contentEditable = 'true';
    }
}

// Toggle theme
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    
    // Reset textarea styles to let CSS take over
    const textDiv = document.getElementById('textDiv');
    if (!isHeightExceeded()) {
        textDiv.style.borderColor = '';
        textDiv.style.backgroundColor = '';
    }
    
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

// Share canvas to WhatsApp
function shareCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        // Create a file from the blob
        const file = new File([blob], 'multigender-hebrew-text.png', { type: 'image/png' });
        
        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: 'עברית רב-מגדרית',
                text: 'תמונה שנוצרה עם כלי העברית הרב-מגדרית'
            }).catch((error) => {
                console.log('Error sharing:', error);
                // Fallback to download
                downloadCanvas();
            });
        } else {
            // Fallback to download
            downloadCanvas();
        }
    }, 'image/png');
}

// Fallback download function
function downloadCanvas() {
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