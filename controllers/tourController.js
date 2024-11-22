import { Tour } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const tourController = baseController(Tour); // Подключаем базовый контроллер с моделью Client

export default tourController; // Экспортируем готовый контроллер
