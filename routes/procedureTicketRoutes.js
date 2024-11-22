import express from 'express';
import procedureTicketController from '../controllers/procedureTicketController.js';

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
router.get('/procedureTickets', async (req, res) => {
  try {
    const procedureTickets = await procedureTicketController.getAll();
    res.status(200).json(procedureTickets);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  try {
    await procedureTicketController.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

