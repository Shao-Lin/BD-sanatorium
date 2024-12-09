import express from 'express';
import hotelRoomController from '../controllers/hotelRoomController.js';
import { HotelRoom } from '../models/index.js';
import db from '../models/index.js';

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
  const { price,room_type,booking_status,occupancy_status, page } = req.query;

  try {
    const whereClause = {};
    if (room_type) whereClause.room_type = { [db.Sequelize.Op.like]: `%${room_type}%` };; // Предполагается точное соответствие
    if (price) whereClause.price = price
    if (occupancy_status) whereClause.occupancy_status = occupancy_status
    if (booking_status) whereClause.booking_status = booking_status

    if (page) {
      // Логика пагинации
      const limit = 200; // Количество записей на страницу
      const offset = (page - 1) * limit;

      const hotelRooms = await HotelRoom.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      return res.json({
        data: hotelRooms.rows,
        total: hotelRooms.count,
        totalPages: Math.ceil(hotelRooms.count / limit),
        currentPage: page,
      });
    }

    // Логика фильтрации без пагинации
    const hotelRooms = await HotelRoom.findAll({ where: whereClause });
    return res.json(hotelRooms);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error filtering hotel rooms data' });
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
