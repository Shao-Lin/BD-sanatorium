import { Client } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const clientController = baseController(Client); // Подключаем базовый контроллер с моделью Client

export default clientController; // Экспортируем готовый контроллер

