import express from 'express';
import hotelRoomController from '../controllers/hotelRoomController.js';
import { HotelRoom } from '../models/index.js';

const router = express.Router();

// Операции CRUD для HotelRoom
router.post('/hotelRooms', async (req, res) => {
  try {
    const hotelRoom = await hotelRoomController.create(req.body);
    res.status(201).json(hotelRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// hotelRoom.routes.js
router.get('/hotelRooms', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: hotelRooms, count } = await HotelRoom.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: hotelRooms,
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

router.put('/api/related/nullify/:nameTable/:id', async (req, res) => {
  const { nameTable, id } = req.params;
  console.log('nameTable:', nameTable, 'id:', id);

  try {
    if (nameTable === 'hotelRoom') {
      // Обнуляем записи для hotelRoom в таблице tour
      await db.query(
        'UPDATE tour SET room_id = NULL WHERE room_id = $1',
        [id]
      );
    }
    // Здесь можно добавить дополнительные правила для других таблиц, если потребуется

    res.status(200).json({
      message: `Related records for ${nameTable} ID ${id} have been nullified.`,
    });
  } catch (error) {
    console.error('Error nullifying related records:', error);
    res.status(500).json({ message: 'Failed to nullify related records' });
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
