import express from 'express';
import { getDashboardSummary } from '../controllers/summaryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Admin', 'Analyst'), getDashboardSummary);

export default router;