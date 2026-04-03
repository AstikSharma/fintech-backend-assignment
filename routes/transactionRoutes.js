import express from 'express';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTransactions);
router.post('/', protect, authorize('Admin', 'Analyst'), createTransaction);
router.put('/:id', protect, authorize('Admin'), updateTransaction);
router.delete('/:id', protect, authorize('Admin'), deleteTransaction);

export default router;