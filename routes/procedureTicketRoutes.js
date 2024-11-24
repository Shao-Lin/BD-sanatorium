import express from 'express';
import procedureTicketController from '../controllers/procedureTicketController.js';
import { ProcedureTicket } from '../models/index.js';

const router = express.Router();

// Маршруты для ProcedureTicket

// Создание ProcedureTicket
router.post('/procedureTickets', async (req, res) => {
  try {
    const procedureTicket = await procedureTicketController.create(req.body);
    res.status(201).json(procedureTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получение всех ProcedureTickets
// procedureTicket.routes.js
router.get('/procedureTickets', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Количество записей на страницу
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
  try {
    const updatedProcedureTicket = await procedureTicketController.update(req.params.id, req.body);
    res.status(200).json(updatedProcedureTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

