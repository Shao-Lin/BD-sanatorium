import express from 'express';
import procedureController from '../controllers/procedureController.js';
import { Procedure } from '../models/index.js';

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

// procedure.routes.js
router.get('/procedures', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: procedures, count } = await Procedure.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: procedures,
      totalPages: Math.ceil(count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const { id } = req.params;

  try {
    const deletedCount = await Procedure.destroy({ where: { procedure_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
