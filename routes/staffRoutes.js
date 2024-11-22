import express from 'express';
import staffController from '../controllers/staffController.js';

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
  try {
    const staffs = await staffController.getAll();
    res.status(200).json(staffs);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  try {
    await staffController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
