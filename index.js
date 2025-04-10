const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { corsMiddleware } = require('./middleware/corsmiddleware'); // Correct casing

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware); // Use corsMiddleware
// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Importar rutas
const plantillaRoutes = require('./routes/plantillaRoutes');

// Usar rutas
app.use('/api/templates', plantillaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
