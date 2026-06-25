const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// ✅ ESTA ES LA RUTA QUE DEBE EXISTIR
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('📩 Prompt recibido:', prompt);

        // Simulación de respuesta (para probar antes de conectar IA)
        return res.json({
            mensaje: `¡Hola! Recibí tu mensaje: "${prompt}". Esto es una prueba de que la ruta funciona.`,
            emoji: '✅'
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno', emoji: '❌' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
