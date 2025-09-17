/**
 * MultiGender Hebrew Text Designer - Clean Production Version
 * Version: 0.4.3
 */

// Configuration
const CONFIG = {
    VERSION: '0.4.3',
    FONT_FAMILY: 'AlefMultiGenderHebrew, sans-serif',
    FONT_SIZES: { small: 20, normal: 24, large: 28 },
    CANVAS_WIDTH: 1200,
    LINE_HEIGHT: 1.4,
    DPI_SCALE: 3, // Higher DPI for better quality
    DESIRED_EXPORT_FONT_PX: 28
};

// Global state
let currentFontSize = CONFIG.FONT_SIZES.normal;
let isDark = false;
let debugMode = false; // Set to true to show canvas for debugging

// Mobile detection utility
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('multigender-theme');
    if (savedTheme === 'dark') {
        isDark = true;
        document.body.classList.add('dark');
    }
}

// Save theme to localStorage
function saveTheme() {
    localStorage.setItem('multigender-theme', isDark ? 'dark' : 'light');
}
let updateTimeout;

// ----- Responsive sizing helpers (width-based height rules) -----

function getContainerContentWidth() {
    const container = document.querySelector('.container');
    if (!container) return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const styles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    return Math.max(0, container.clientWidth - paddingLeft - paddingRight);
}

function getWidthBasedHeights(widthPx) {
    // 4) minimal textarea height is 1/4 of its width
    // 5) maximal textarea height is 4/3 of its width
    const minHeight = widthPx / 4;
    const maxHeight = (4 / 3) * widthPx;
    return { minHeight, maxHeight };
}

function adjustFontSizeForExport(textDiv, captureScale) {
    // 7) font size should be adjusted such that it will be 24px on the exported image
    const desiredExportPx = CONFIG.DESIRED_EXPORT_FONT_PX;
    const displayFontPx = desiredExportPx / Math.max(1, captureScale);
    textDiv.style.fontSize = displayFontPx + 'px';
}

function updateTextAreaDimensions() {
    const textDiv = document.getElementById('textDiv');
    if (!textDiv) return;

    // 3) textarea width is max possible (screen size - padding)
    const availableWidth = getContainerContentWidth();
    if (availableWidth <= 0) return;
    textDiv.style.width = availableWidth + 'px';

    // Compute export capture scale relative to fixed canvas width (1200)
    const captureScale = CONFIG.CANVAS_WIDTH / Math.max(1, textDiv.offsetWidth);

    // Adjust font size BEFORE measuring height so layout is correct
    adjustFontSizeForExport(textDiv, captureScale);

    // Height rules based on current width
    const { minHeight, maxHeight } = getWidthBasedHeights(textDiv.offsetWidth);

    // Measure content height and clamp between min and max
    textDiv.style.height = 'auto';
    const paddingTop = parseFloat(getComputedStyle(textDiv).paddingTop) || 0;
    const paddingBottom = parseFloat(getComputedStyle(textDiv).paddingBottom) || 0;
    const contentHeight = textDiv.scrollHeight + paddingTop + paddingBottom;
    const nextHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
    textDiv.style.height = nextHeight + 'px';
}

// Update share button text based on device type
function updateShareButtonText() {
    const shareButton = document.getElementById('shareButton');
    if (isMobile()) {
        shareButton.innerHTML = '📤 שתפו';
        shareButton.setAttribute('aria-label', 'Share');
    } else {
        shareButton.innerHTML = '📋 העתיקו';
        shareButton.setAttribute('aria-label', 'Copy to clipboard');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    loadTheme();
    
    // Initialize textarea (empty by default)
    const textDiv = document.getElementById('textDiv');
    
    // Apply initial responsive sizing and font adjustment
    updateTextAreaDimensions();
    
    // Update share button text based on device
    updateShareButtonText();
    
    // Generate initial canvas
    generateCanvas();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update button text and responsive sizing on window resize (for device rotation)
    window.addEventListener('resize', () => {
        updateShareButtonText();
        updateTextAreaDimensions();
        debouncedUpdate();
    });

    // Ensure layout stabilizes after fonts load (desktop Chrome may shift metrics)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            updateTextAreaDimensions();
            generateCanvas();
        }).catch(() => {
            // noop
        });
    }
});

// Setup all event listeners
function setupEventListeners() {
    const textDiv = document.getElementById('textDiv');
    const themeToggle = document.getElementById('themeToggle');
    const shareButton = document.getElementById('shareButton');
    
    // Text input - prevent typing when height exceeded
    textDiv.addEventListener('input', function(e) {
        // Always truncate if height exceeded
        if (isHeightExceeded()) {
            truncateToFit();
        }
        
        // Auto-resize height and enforce new rules
        updateTextAreaDimensions();
        
        checkHeightLimit();
        debouncedUpdate();
    });
    
    // Prevent typing when height limit is already exceeded
    textDiv.addEventListener('keydown', function(e) {
        if (isHeightExceeded() && !isDeletionKey(e)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent pasting when height limit is already exceeded
    textDiv.addEventListener('paste', function(e) {
        if (isHeightExceeded()) {
            e.preventDefault();
            return false;
        }
    });
    
    
    // Character buttons - simplified
    document.querySelectorAll('.char-button').forEach(btn => {
        btn.addEventListener('click', () => {
            // Don't add characters if height limit exceeded
            if (isHeightExceeded()) {
                return;
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
            // Let input handler deal with height limiting
            textDiv.dispatchEvent(new Event('input'));
        });
    });
    
    // Theme toggle button
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Share button - different behavior for mobile vs desktop
    shareButton.addEventListener('click', () => {
        if (isMobile()) {
            shareCanvas();
        } else {
            copyCanvasToClipboard();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && e.ctrlKey) {
            e.preventDefault();
            toggleTheme();
        }
        if (e.key === 'd' && e.ctrlKey) {
            e.preventDefault();
            debugMode = !debugMode;
            const canvas = document.getElementById('canvas');
            canvas.style.display = debugMode ? 'block' : 'none';
        }
    });
}

// Debounced update function
function debouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(generateCanvas, 300);
}

// Height limit functions - simplified CSS-based approach
function isHeightExceeded() {
    const textDiv = document.getElementById('textDiv');
    if (!textDiv) return false;
    const { maxHeight } = getWidthBasedHeights(textDiv.offsetWidth || getContainerContentWidth());
    return (textDiv.scrollHeight) > maxHeight;
}

// Check if key is a deletion key (backspace, delete, etc.)
function isDeletionKey(e) {
    return e.key === 'Backspace' || e.key === 'Delete' || 
           (e.ctrlKey && (e.key === 'a' || e.key === 'x' || e.key === 'c'));
}

// Truncate text to fit within height limit
function truncateToFit() {
    const textDiv = document.getElementById('textDiv');
    let text = textDiv.textContent;
    let maxLength = 0;
    
    // Binary search to find max length that fits
    let left = 0;
    let right = text.length;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const testText = text.substring(0, mid);
        
        // Test height with temporary element
        const temp = document.createElement('div');
        temp.style.cssText = window.getComputedStyle(textDiv).cssText;
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        temp.style.height = 'auto';
        temp.style.maxHeight = 'none';
        temp.style.width = textDiv.offsetWidth + 'px';
        temp.textContent = testText;
        document.body.appendChild(temp);
        
        const { maxHeight } = getWidthBasedHeights(textDiv.offsetWidth);
        if (temp.scrollHeight <= maxHeight) {
            maxLength = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        document.body.removeChild(temp);
    }
    
    // Truncate if needed
    if (maxLength < text.length) {
        textDiv.textContent = text.substring(0, maxLength);
        
        // Move cursor to end
        const range = document.createRange();
        range.selectNodeContents(textDiv);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function checkHeightLimit() {
    const textDiv = document.getElementById('textDiv');
    const exceeded = isHeightExceeded();
    
    if (exceeded) {
        textDiv.style.backgroundColor = isDark ? '#2d1b1b' : '#fdf2f2';
    } else {
        // Reset to theme-appropriate colors
        textDiv.style.backgroundColor = '';
    }
}

// Toggle theme
function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    saveTheme(); // Save theme preference
    
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
    
    // Ensure dimensions and font reflect current rules before measuring
    updateTextAreaDimensions();
    
    // Always match textarea dimensions exactly
    const textareaHeight = textDiv.offsetHeight;
    const textareaWidth = textDiv.offsetWidth;
    
    // 1) canvas size width is 1200 (fixed export width)
    const exportWidth = CONFIG.CANVAS_WIDTH;
    // 6) canvas is scaled textarea (preserve aspect)
    const captureScale = Math.max(1, exportWidth / Math.max(1, textareaWidth));
    const exportHeight = Math.round(textareaHeight * captureScale);

    // Backing store size is fixed 1200 x proportional
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    // CSS size matches on-screen textarea
    canvas.style.width = textareaWidth + 'px';
    canvas.style.height = textareaHeight + 'px';
    try {
        console.log('[Canvas]', {
            cssWidthPx: textareaWidth,
            cssHeightPx: textareaHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            captureScale,
            exportWidth,
            exportHeight,
            backingWidth: canvas.width,
            backingHeight: canvas.height
        });
    } catch (_) {}
    
    // Show canvas only in debug mode
    canvas.style.display = debugMode ? 'block' : 'none';
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get text and process it
    const text = textDiv.textContent;
    if (!text.trim()) {
        // Empty text - just fill with background color
        ctx.fillStyle = window.getComputedStyle(textDiv).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    try {
        // Use html2canvas directly on textarea
        const canvasElement = await html2canvas(textDiv, {
            // Scale capture so backing store width becomes 1200 regardless of CSS width
            scale: captureScale,
            letterRendering: true,
            useCORS: true,
            allowTaint: true,
            backgroundColor: window.getComputedStyle(textDiv).backgroundColor
        });
        
        // Draw the captured content onto our canvas
        ctx.drawImage(canvasElement, 0, 0, exportWidth, exportHeight);

        // Signature (bottom-right): "עבמה-{version}"
        try {
            const sigText = `עבמה-${CONFIG.VERSION}`;
            ctx.save();
            ctx.direction = 'rtl';
            ctx.font = `${14 * CONFIG.DPI_SCALE}px ${CONFIG.FONT_FAMILY}`;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            const padding = 10 * CONFIG.DPI_SCALE;
            const metrics = ctx.measureText(sigText);
            const textWidth = metrics.width;
            const x = canvas.width - padding - textWidth;
            const y = canvas.height - padding;
            ctx.fillText(sigText, x, y);
            ctx.restore();
        } catch (e) {
            // ignore signature errors
        }
        
        // Canvas generated successfully
        
    } catch (error) {
        console.error('Error capturing with HTML2Canvas:', error);
        // Fallback: fill with background color
        ctx.fillStyle = window.getComputedStyle(textDiv).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Auto-resize textarea height between 300 and 1600 without scrollbar
function resizeTextAreaHeight() {
    const textDiv = document.getElementById('textDiv');
    if (!textDiv) return;
    // Temporarily set height to auto to measure scrollHeight
    textDiv.style.height = 'auto';
    const paddingTop = parseFloat(getComputedStyle(textDiv).paddingTop) || 0;
    const paddingBottom = parseFloat(getComputedStyle(textDiv).paddingBottom) || 0;
    const contentHeight = textDiv.scrollHeight + paddingTop + paddingBottom;
    const minHeight = 200;
    const maxHeight = CONFIG.CANVAS_HEIGHT_MAX;
    const nextHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
    textDiv.style.height = nextHeight + 'px';
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
                // Fallback to download
                downloadCanvas();
            });
        } else {
            // Fallback to download
            downloadCanvas();
        }
    }, 'image/png');
}

// Copy canvas to clipboard
function copyCanvasToClipboard() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob((blob) => {
        if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                showCopySuccess();
            }).catch((error) => {
                console.error('Failed to copy to clipboard:', error);
                // Fallback to download
                downloadCanvas();
            });
        } else {
            // Fallback to download
            downloadCanvas();
        }
    }, 'image/png');
}

// Show copy success feedback
function showCopySuccess() {
    const shareButton = document.getElementById('shareButton');
    const originalText = shareButton.innerHTML;
    shareButton.innerHTML = '✅ הועתק!';
    shareButton.style.background = '#10b981';
    
    setTimeout(() => {
        shareButton.innerHTML = originalText;
        shareButton.style.background = '';
    }, 2000);
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