import express from 'express';
import staffController from '../controllers/staffController.js';
import { Staff } from '../models/index.js'; // Убедитесь, что путь корректен

const router = express.Router();

// Аналогично создаём маршруты для Staff
router.post('/staffs', async (req, res) => {
  try {
    const staff = await staffController.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/staffs', async (req, res) => {
  const limit = 100; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;
  try {
    const { rows: staff, count } = await Staff.findAndCountAll({
      limit,
      offset,
      order:[],
    });

    res.json({
      data: staff,
      totalPages: Math.ceil(count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/staffs/:id', async (req, res) => {

  console.log('aaaaaaaaaaaaaaaaa')
  try {
    const staff = await staffController.getById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/staffs/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await Staff.update(updatedData, {
      where: { staff_id: id },
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




router.delete('/staffs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Staff.destroy({ where: { staff_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
