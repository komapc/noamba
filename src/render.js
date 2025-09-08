const express = require('express');
const sharp = require('sharp');
const path = require('path');

const app = express();

// Serve static files from the src directory
app.use(express.static(path.join(__dirname)));

app.get('/render', async (req, res) => {
    const text = req.query.text || 'Hello, world!';
    const width = parseInt(req.query.width) || 800;
    const height = parseInt(req.query.height) || 200;
    const font = req.query.font || 'Arial';
    
    try {
        const svg = `
            <svg width="${width}" height="${height}">
                <rect width="100%" height="100%" fill="white"/>
                <text 
                    x="50%" 
                    y="50%" 
                    font-family="${font}" 
                    font-size="48" 
                    text-anchor="middle" 
                    dominant-baseline="middle"
                    fill="black"
                >
                    ${text}
                </text>
            </svg>
        `;

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