const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 150
            })
        });
        const data = await response.json();
        const content = data.choices[0].message.content;
        try {
            res.json(JSON.parse(content));
        } catch (e) {
            const match = content.match(/\{.*\}/s);
            res.json(match ? JSON.parse(match[0]) : { mensaje: content, emoji: '🌿' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Sigue adelante, todo va a mejorar.', emoji: '💪' });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));