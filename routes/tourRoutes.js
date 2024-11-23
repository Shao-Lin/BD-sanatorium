import express from 'express';
import tourController from '../controllers/tourController.js';
import { Tour } from '../models/index.js'; // Убедитесь, что путь корректен


const router = express.Router();

// Создание Tour
router.post('/tours', async (req, res) => {
  try {
    const tour = await tourController.create(req.body);
    res.status(201).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получение всех Tours
router.get('/tours', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: tours, count } = await Tour.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: tours,
      totalPages: Math.ceil(count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    const updatedTour = await tourController.update(req.params.id, req.body);
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Удаление Tour
router.delete('/tours/:id', async (req, res) => {
  try {
    await tourController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
