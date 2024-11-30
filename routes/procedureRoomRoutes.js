import express from 'express';
import procedureRoomController from '../controllers/procedureRoomController.js';
import { ProcedureRoom } from '../models/index.js';
import db from '../models/index.js';

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
  const { location,service_type,occupancy_status, page } = req.query;

  try {
    const whereClause = {};
    if (location) whereClause.location = { [db.Sequelize.Op.like]: `%${location}%` };; // Предполагается точное соответствие
    if (service_type) whereClause.service_type = { [db.Sequelize.Op.like]: `%${service_type}%` };
    if (occupancy_status) whereClause.occupancy_status = { [db.Sequelize.Op.like]: `%${occupancy_status}%` };

    if (page) {
      // Логика пагинации
      const limit = 200; // Количество записей на страницу
      const offset = (page - 1) * limit;

      const procedureRooms = await ProcedureRoom.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      return res.json({
        data: procedureRooms.rows,
        total: procedureRooms.count,
        totalPages: Math.ceil(procedureRooms.count / limit),
        currentPage: page,
      });
    }

    // Логика фильтрации без пагинации
    const procedureRooms = await ProcedureRoom.findAll({ where: whereClause });
    return res.json(procedureRooms);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error filtering procedure rooms data' });
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
