import db from './models/index.js';


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';  // Подключаем cors

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(cors());

// Middleware для обработки JSON

app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template.html'));
});
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Подключение маршрутов
import procedureTicketRoutes from './routes/procedureTicketRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import hotelRoomRoutes from './routes/hotelRoomRoutes.js';
import procedureRoutes from './routes/procedureRoutes.js';
import procedureRoomRoutes from './routes/procedureRoomRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import clientRoutes from './routes/clientRoutes.js';


// Подключение маршрутов
app.use('/api', hotelRoomRoutes);
app.use('/api', procedureRoutes);
app.use('/api', procedureRoomRoutes);
app.use('/api', staffRoutes);
app.use('/api', procedureTicketRoutes);
app.use('/api', tourRoutes);
app.use('/api',clientRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
