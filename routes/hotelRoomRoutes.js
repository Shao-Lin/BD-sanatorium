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

router.put('/hotelRooms/:id', async (req, res) => {
  try {
    const updatedHotelRoom = await hotelRoomController.update(req.params.id, req.body);
    res.status(200).json(updatedHotelRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/hotelRooms/:id', async (req, res) => {
  try {
    await hotelRoomController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
