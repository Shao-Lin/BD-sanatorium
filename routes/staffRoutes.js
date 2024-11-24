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
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: staff, count } = await Staff.findAndCountAll({
      limit,
      offset,
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
  try {
    const staff = await staffController.getById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/staffs/:id', async (req, res) => {
  try {
    const updatedStaff = await staffController.update(req.params.id, req.body);
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
