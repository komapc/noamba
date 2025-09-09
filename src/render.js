const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();

// Serve static files from the src directory
app.use(express.static(path.join(__dirname)));

// Function to download and cache fonts
async function downloadFont(url, filename) {
    const filepath = path.join(__dirname, 'fonts', filename);
    
    // Return cached font if it exists
    if (fs.existsSync(filepath)) {
        return filepath;
    }

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download font: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filepath);
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => reject(err));
            });
        }).on('error', reject);
    });
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

app.get('/render', async (req, res) => {
    const rawText = req.query.text || 'Hello, world!';
    const lines = rawText.split(/\r?\n/).map(escapeXml);
    const width = parseInt(req.query.width) || 800;
    const height = parseInt(req.query.height) || 200;
    const font = escapeXml(req.query.font || 'Caveat');
    const sizeVal = parseInt(req.query.size);
    const fontSize = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 32;
    const lineHeight = Math.round(fontSize * 1.3);
    // Colors (sanitize to simple hex)
    const hexColorRe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    const fg = typeof req.query.fg === 'string' && hexColorRe.test(req.query.fg) ? req.query.fg : '#111827';
    const bg = typeof req.query.bg === 'string' && hexColorRe.test(req.query.bg) ? req.query.bg : '#ffffff';
    
    try {
        // Download and cache the font
        const fontUrl = 'https://fonts.gstatic.com/s/caveat/v19/WnzgHAc5bAfYB2QRah7pcpNvOx-pjRV6SIAjLw.woff2';
        await downloadFont(fontUrl, 'caveat-bold.woff2');
        
        const totalTextHeight = lineHeight * Math.max(lines.length, 1);
        const startY = Math.round((height - totalTextHeight) / 2) + fontSize; // baseline alignment
        const tspans = lines.map((line, idx) => {
            const y = startY + idx * lineHeight;
            return `<tspan x="50%" y="${y}">${line}</tspan>`;
        }).join('');

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: 'Caveat';
        src: url('${path.relative(process.cwd(), path.join(__dirname, 'fonts', 'caveat-bold.woff2'))}') format('woff2');
        font-weight: bold;
        font-style: normal;
        size-adjust: 120%;
      }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  <text
    x="50%"
    font-family="${font}, Caveat"
    font-size="${fontSize}"
    text-anchor="middle"
    fill="${fg}"
    direction="rtl"
    xml:lang="he"
  >
    ${tspans}
  </text>
</svg>`;

        const buffer = await sharp(Buffer.from(svg))
            .png()
            .toBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="rendered-text.png"');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Error generating image');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});