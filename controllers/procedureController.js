import { Procedure } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const procedureController = baseController(Procedure); // Подключаем базовый контроллер с моделью Client

export default procedureController; // Экспортируем готовый контроллер

