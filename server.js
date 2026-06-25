const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ruta de prueba (para verificar que el servidor vive)
app.get('/api/test', (req, res) => {
    res.json({ status: '✅ Servidor funcionando correctamente' });
});

// Ruta principal que usa DeepSeek
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('📩 Prompt recibido:', prompt.substring(0, 50) + '...');

        // 1. Llamar a DeepSeek
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { 
                        role: "system", 
                        content: "Eres el alma de HERVOR. Responde en español, con calidez y autenticidad. Siempre en formato JSON con los campos: mensaje y emoji." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        // 2. Procesar la respuesta
        const data = await response.json();
        console.log('✅ DeepSeek respondió');

        const content = data.choices[0].message.content;
        
        // 3. Extraer el JSON de la respuesta
        try {
            const jsonResponse = JSON.parse(content);
            res.json(jsonResponse);
        } catch (e) {
            const match = content.match(/\{.*\}/s);
            if (match) {
                res.json(JSON.parse(match[0]));
            } else {
                res.json({ 
                    mensaje: content.substring(0, 150), 
                    emoji: '🌿' 
                });
            }
        }
    } catch (error) {
        console.error('❌ Error en /api/chat:', error);
        res.status(500).json({ 
            mensaje: 'Hubo un error, pero no te preocupes. Sigue adelante.',
            emoji: '💪'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ API Key configurada: ${!!process.env.DEEPSEEK_API_KEY}`);
});
