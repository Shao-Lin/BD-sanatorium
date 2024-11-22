import express from 'express';
import hotelRoomController from '../controllers/hotelRoomController.js';

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

router.get('/hotelRooms', async (req, res) => {
  const { type } = req.query;
  try {
    const hotelRooms = await hotelRoomController.getAll();
    res.status(200).json(hotelRooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
