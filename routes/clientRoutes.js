import express from 'express';
import clientController from '../controllers/clientController.js';

const router = express.Router();

router.post('/clients', async (req, res) => {
  try {
    const client = await clientController.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

router.get('/clients', async (req, res) => {
  try {
    const clients = await clientController.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения клиентов' });
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

router.delete('/clients:id', async (req, res) => {
  try {
    await clientController.delete(req.params.id);
    res.json({ message: 'Клиент удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления клиента' });
  }
});

export default router;
