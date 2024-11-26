import express from 'express';
import procedureRoomController from '../controllers/procedureRoomController.js';
import { ProcedureRoom } from '../models/index.js';

const router = express.Router();

// Аналогично создаём маршруты для ProcedureRoom
router.post('/procedureRooms', async (req, res) => {
  try {
    const { room_id, location, service_type,occupancy_status } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!room_id || !location|| !service_type || !occupancy_status) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await procedureRoomController.create({ room_id, location, service_type,occupancy_status });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// procedureRoom.routes.js
router.get('/procedureRooms', async (req, res) => {
  const limit = 100 // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: procedureRooms, count } = await ProcedureRoom.findAndCountAll({
      limit,
      offset,
      order:[],
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
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await ProcedureRoom.update(updatedData, {
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
