import { ProcedureTicket } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const procedureTicketController = baseController(ProcedureTicket); // Подключаем базовый контроллер с моделью Client

export default procedureTicketController; // Экспортируем готовый контроллер

