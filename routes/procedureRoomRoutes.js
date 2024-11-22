import express from 'express';
import procedureRoomController from '../controllers/procedureRoomController.js';

const router = express.Router();

// Аналогично создаём маршруты для ProcedureRoom
router.post('/procedureRooms', async (req, res) => {
  try {
    const procedureRoom = await procedureRoomController.create(req.body);
    res.status(201).json(procedureRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/procedureRooms', async (req, res) => {
  try {
    const procedureRooms = await procedureRoomController.getAll();
    res.status(200).json(procedureRooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/procedureRooms/:id', async (req, res) => {
  try {
    const procedureRoom = await procedureRoomController.getById(req.params.id);
    if (!procedureRoom) return res.status(404).json({ message: 'ProcedureRoom not found' });
    res.status(200).json(procedureRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/procedureRooms/:id', async (req, res) => {
  try {
    const updatedProcedureRoom = await procedureRoomController.update(req.params.id, req.body);
    res.status(200).json(updatedProcedureRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/procedureRooms/:id', async (req, res) => {
  try {
    await procedureRoomController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
