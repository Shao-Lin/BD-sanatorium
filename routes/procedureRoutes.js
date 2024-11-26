import express from 'express';
import procedureController from '../controllers/procedureController.js';
import { Procedure } from '../models/index.js';

const router = express.Router();

// Аналогично создаём маршруты для Procedure
router.post('/procedures', async (req, res) => {
  try {
    const { procedure_id, name, price } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!procedure_id || !price|| !name ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await procedureController.create({ procedure_id, name, price });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// procedure.routes.js
router.get('/procedures', async (req, res) => {
  const limit = 100 // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: procedures, count } = await Procedure.findAndCountAll({
      limit,
      offset,
      ordrer: [],
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
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await Procedure.update(updatedData, {
      where: { procedure_id: id },
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
