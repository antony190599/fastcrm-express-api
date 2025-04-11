import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/corsmiddleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import plantillaRoutes from './routes/plantillaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

app.use('/api/templates', plantillaRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
