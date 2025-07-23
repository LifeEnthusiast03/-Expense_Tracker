import express from 'express';
import { addIncome, deleteIncome, getUserIncome } from '../controllers/incomecontrollers';
import wrapController from '../utils/routehelper';

const router = express.Router();


// GET /api/income/userdata - Get all income records for the authenticated user
router.get('/userdata', wrapController(getUserIncome));

// POST /api/income - Add new income record
router.post('/',wrapController(addIncome));

// DELETE /api/income/:id - Delete specific income record by ID
router.delete('/:id', wrapController(deleteIncome));

export default router;