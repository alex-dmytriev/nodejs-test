// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import studentsRoutes from './routes/studentsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Global Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.use(studentsRoutes); // students routes

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Something went wrong');
});

app.use(notFoundHandler); // Middleware 404
app.use(errors()); // Celebrate validation error handler
app.use(errorHandler); // Middleware для обробки помилок

await connectMongoDB(); // MongoDB connection

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
