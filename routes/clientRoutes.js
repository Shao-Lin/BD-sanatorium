import express from 'express';
import clientController from '../controllers/clientController.js';
import { Client } from '../models/index.js';
import db from '../models/index.js';

const router = express.Router();

router.post('/clients', async (req, res) => {
  try {
    const { client_id, birth_date, phone_number } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!client_id || !birth_date || !phone_number) {
      return res.status(400).json({ error: 'All fields (client_id, birth_date, phone_number) are required.' });
    }

    const client = await clientController.create({ client_id, birth_date, phone_number });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// client.routes.js
router.get('/clients', async (req, res) => {
  const { birth_date, phone_number, page } = req.query;

  try {
    const whereClause = {};
    if (birth_date) whereClause.birth_date = birth_date
    if (phone_number) whereClause.phone_number = { [db.Sequelize.Op.like]: `%${phone_number}%` };

    if (page) {
      // Логика пагинации
      const limit = 200; // Количество записей на страницу
      const offset = (page - 1) * limit;

      const clients = await Client.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      return res.json({
        data: clients.rows,
        total: clients.count,
        totalPages: Math.ceil(clients.count / limit),
        currentPage: page,
      });
    }

    // Логика фильтрации без пагинации
    const clients = await Client.findAll({ where: whereClause });
    return res.json(clients);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error filtering clients data' });
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
