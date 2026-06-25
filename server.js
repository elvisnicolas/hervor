const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static('public'));

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/test', (req, res) => {
    res.json({ status: '✅ Servidor funcionando correctamente' });
});

// Ruta principal para la IA
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('📩 Prompt recibido:', prompt);

        // Respuesta de prueba para confirmar conexión
        return res.json({
            mensaje: `¡Recibí tu mensaje: "${prompt}". La conexión funciona! 🎉`,
            emoji: '✅'
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ mensaje: 'Error interno', emoji: '❌' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
