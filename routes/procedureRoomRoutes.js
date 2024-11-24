import express from 'express';
import procedureRoomController from '../controllers/procedureRoomController.js';
import { ProcedureRoom } from '../models/index.js';

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

// procedureRoom.routes.js
router.get('/procedureRooms', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: procedureRooms, count } = await ProcedureRoom.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: procedureRooms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const { id } = req.params;

  try {
    const deletedCount = await ProcedureRoom.destroy({ where: { room_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
