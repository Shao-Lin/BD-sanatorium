import { HotelRoom } from '../models/index.js'; // Импортируем модель Client
import baseController from './baseController.js'; // Импортируем базовый контроллер

const hotelRoomController = baseController(HotelRoom); // Подключаем базовый контроллер с моделью Client

export default hotelRoomController; // Экспортируем готовый контроллер

