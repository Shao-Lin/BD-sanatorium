import express from 'express';
import procedureController from '../controllers/procedureController.js';

const router = express.Router();

// Аналогично создаём маршруты для Procedure
router.post('/procedures', async (req, res) => {
  try {
    const procedure = await procedureController.create(req.body);
    res.status(201).json(procedure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/procedures', async (req, res) => {
  try {
    console.log('[LOG] Fetching all procedures');
    const procedures = await procedureController.getAll();
    res.status(200).json(procedures);
  } catch (error) {
    console.error('[ERROR] Fetching procedures:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/procedures/:id', async (req, res) => {
  try {
    const procedure = await procedureController.getById(req.params.id);
    if (!procedure) return res.status(404).json({ message: 'Procedure not found' });
    res.status(200).json(procedure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/procedures/:id', async (req, res) => {
  try {
    const updatedProcedure = await procedureController.update(req.params.id, req.body);
    res.status(200).json(updatedProcedure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/procedures/:id', async (req, res) => {
  try {
    await procedureController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
