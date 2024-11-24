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
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;

  try {
    const { rows: clients, count } = await Client.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: clients, // Это данные клиентов
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/clients:id', async (req, res) => {
  try {
    const client = await clientController.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения клиента' });
  }
});

router.put('/clients:id', async (req, res) => {
  try {
    const updated = await clientController.update(req.params.id, req.body);
    res.json({ message: 'Клиент обновлен', updated });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления клиента' });
  }
});

router.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Client.destroy({ where: { client_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
