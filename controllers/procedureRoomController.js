import { ProcedureRoom } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const procedureRoomController = baseController(ProcedureRoom); // Подключаем базовый контроллер с моделью Client

export default procedureRoomController; // Экспортируем готовый контроллер

