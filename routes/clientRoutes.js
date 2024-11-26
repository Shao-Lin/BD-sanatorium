import express from 'express';
import clientController from '../controllers/clientController.js';
import { Client } from '../models/index.js';

const router = express.Router();

router.post('/clients', async (req, res) => {
  try {
    const client = await clientController.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// client.routes.js
router.get('/clients', async (req, res) => {
  const limit = 100; // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;
  try {
    const { rows: client, count } = await Client.findAndCountAll({
      limit,
      offset,
      order:[],
    });

    res.json({
      data: client,
      totalPages: Math.ceil(count / limit), // Общее количество страниц
      currentPage: page, // Текущая страница
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/clients/:id', async (req, res) => {
  try {
    const client = await clientController.getById(req.params.id);
    if (!client) return res.status(404).json({ message: 'client not found' });
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/clients/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления
 
  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await Client.update(updatedData, {
      where: { client_id: id },
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



router.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Удаляем клиента
    const deletedCount = await Client.destroy({ where: { client_id:id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully. Related tours updated automatically.' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
