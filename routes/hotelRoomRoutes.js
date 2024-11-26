import express from 'express';
import hotelRoomController from '../controllers/hotelRoomController.js';
import { HotelRoom } from '../models/index.js';

const router = express.Router();

// Операции CRUD для HotelRoom
router.post('/hotelRooms', async (req, res) => {
  try {
    const { room_id, price, room_type,booking_status,occupancy_status } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!room_id || !price|| !room_type || !booking_status || !occupancy_status) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await hotelRoomController.create({ room_id, price, room_type,booking_status,occupancy_status });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// hotelRoom.routes.js
router.get('/hotelRooms', async (req, res) => {
  const limit = 100; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;
  try {
    const { rows: room, count } = await HotelRoom.findAndCountAll({
      limit,
      offset,
      order:[],
    });

    res.json({
      data: room,
      totalPages: Math.ceil(count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/hotelRooms/:id', async (req, res) => {
  try {
    const hotelRoom = await hotelRoomController.getById(req.params.id);
    if (!hotelRoom) return res.status(404).json({ message: 'HotelRoom not found' });
    res.status(200).json(hotelRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/hotelRooms/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления
 
  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await HotelRoom.update(updatedData, {
      where: { room_id: id },
    });
    
    // Если запись не найдена или не было обновлено, возвращаем ошибку
    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Record not found or not updated' });
    }

    // Если запись обновлена, возвращаем успешный ответ
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});



router.delete('/hotelRooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await HotelRoom.destroy({ where: { room_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
