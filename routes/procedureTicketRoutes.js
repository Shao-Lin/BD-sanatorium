import express from 'express';
import procedureTicketController from '../controllers/procedureTicketController.js';
import { ProcedureTicket } from '../models/index.js';

const router = express.Router();

// Маршруты для ProcedureTicket

// Создание ProcedureTicket
router.post('/procedureTickets', async (req, res) => {
  try {
    const { ticket_procedure_id, procedure_room_id, procedure_id,staff_id,date_procedure,tour_id } = req.body;

    // Проверяем, что все необходимые поля переданы
    if (!ticket_procedure_id || !procedure_room_id|| !procedure_id || !staff_id || !date_procedure || !tour_id) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await procedureTicketController.create({ ticket_procedure_id, procedure_room_id, procedure_id,staff_id,date_procedure,tour_id });
    res.status(201).json(client); // Возвращаем созданную запись
  } catch (error) {
    console.error('Ошибка создания клиента:', error.message);
    res.status(500).json({ error: 'Ошибка создания клиента' });
  }
});

// Получение всех ProcedureTickets
// procedureTicket.routes.js
router.get('/procedureTickets', async (req, res) => {
  const limit = 100 // Количество записей на страницу
  const page = parseInt(req.query.page, 10) || 1;   // Текущая страница
  const offset = (page - 1) * limit;

  try {
    const { rows: procedureTickets, count } = await ProcedureTicket.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: procedureTickets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Получение ProcedureTicket по ID
router.get('/procedureTickets/:id', async (req, res) => {
  try {
    const procedureTicket = await procedureTicketController.getById(req.params.id);
    if (!procedureTicket) return res.status(404).json({ message: 'ProcedureTicket not found' });
    res.status(200).json(procedureTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Обновление ProcedureTicket
router.put('/procedureTickets/:id', async (req, res) => {
  const { id } = req.params;  // ID, по которому ищем запись
  const updatedData = req.body;  // Новые данные для обновления

  try {
    // Обновляем данные сотрудника по staff_id
    const [updatedCount] = await ProcedureTicket.update(updatedData, {
      where: { ticket_procedure_id: id },
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

// Удаление ProcedureTicket
router.delete('/procedureTickets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await ProcedureTicket.destroy({ where: { ticket_procedure_id: id } }); // Используем room_id
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

