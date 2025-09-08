const express = require('express');

const app = express();

app.get('/render', async (req, res) => {
    const text = req.query.text || 'Hello, world!';
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(text);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});