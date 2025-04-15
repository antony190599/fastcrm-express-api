import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware.js';
import plantillaRoutes from './routes/plantillaRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

app.use('/api/templates', plantillaRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/companies', companyRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
