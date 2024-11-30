import express from 'express';
import staffController from '../controllers/staffController.js';
import { Staff } from '../models/index.js'; // Убедитесь, что путь корректен
import db from '../models/index.js';
const router = express.Router();

// Аналогично создаём маршруты для Staff
router.post('/staffs', async (req, res) => {
  try {
    const { staff_id, full_name, phone_number,position} = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!staff_id || !full_name|| !phone_number || !position ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await staffController.create({ staff_id, full_name, phone_number,position });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

router.get('/staffs', async (req, res) => {
  const { full_name, phone_number,position, page } = req.query;

  try {
    const whereClause = {};
    if (full_name) whereClause.full_name = { [db.Sequelize.Op.like]: `%${full_name}%` };
    if (position) whereClause.position = { [db.Sequelize.Op.like]: `%${position}%` };
    if (phone_number) whereClause.phone_number = { [db.Sequelize.Op.like]: `%${phone_number}%` };

    if (page) {
      const limit = 200; // Количество записей на страницу
      const offset = (page - 1) * limit;

      const staff = await Staff.findAndCountAll({
        where: whereClause,
        limit,
        offset,
      });

      return res.json({
        data: staff.rows,
        total: staff.count,
        totalPages: Math.ceil(staff.count / limit),
        currentPage: page,
      });
    }

    const staff = await Staff.findAll({ where: whereClause });
    return res.json(staff);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Error fetching staff data' });
  }
});



router.get('/staffs/:id', async (req, res) => {

  console.log('aaaaaaaaaaaaaaaaa')
  try {
    const staff = await staffController.getById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/staffs/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await Staff.update(updatedData, {
      where: { staff_id: id },
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




router.delete('/staffs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Staff.destroy({ where: { staff_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
