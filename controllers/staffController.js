import { Staff } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const staffController = baseController(Staff); // Подключаем базовый контроллер с моделью Client

export default staffController; // Экспортируем готовый контроллер

