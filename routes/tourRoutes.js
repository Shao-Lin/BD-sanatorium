import express from 'express';
import tourController from '../controllers/tourController.js';

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
  try {
    const tours = await tourController.getAll();
    res.status(200).json(tours);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
