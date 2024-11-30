import express from 'express';
import tourController from '../controllers/tourController.js';
import { Tour } from '../models/index.js'; // Убедитесь, что путь корректен
import db from '../models/index.js';

const router = express.Router();

// Создание Tour
router.post('/tours', async (req, res) => {
  try {
    const { tour_id, client_id, check_in_date,check_out_date,tour_cost,room_id } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!tour_id || !client_id|| !check_in_date || !check_out_date || !tour_cost || !room_id) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await tourController.create({ tour_id, client_id, check_in_date,check_out_date,tour_cost,room_id });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// Получение всех Tours
router.get('/tours', async (req, res) => {
  const { client_id, check_in_date,check_out_date,tour_cost,room_id, page } = req.query;

  try {
    const whereClause = {};
    if (client_id) whereClause.client_id = client_id
    if (check_in_date) whereClause.check_in_date = check_in_date;
    if (tour_cost) whereClause.tour_cost = tour_cost
    if (check_out_date) whereClause.check_out_date = check_out_date;
    if (room_id) whereClause.room_id = room_id;

    if (page) {
      const limit = 200; // Количество записей на страницу
      const offset = (page - 1) * limit;

      const tours = await Tour.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      return res.json({
        data: tours.rows,
        total: tours.count,
        totalPages: Math.ceil(tours.count / limit),
        currentPage: page,
      });
    }

    const tours = await Tour.findAll({ where: whereClause });
    return res.json(tours);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error fetching tour data' });
  }
});


// Получение Tour по ID
router.get('/tours/:id', async (req, res) => {
  try {
    const tour = await tourController.getById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Обновление Tour
router.put('/tours/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await Tour.update(updatedData, {
      where: { tour_id: id },
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

// Удаление Tour
router.delete('/tours/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Tour.destroy({ where: { tour_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
