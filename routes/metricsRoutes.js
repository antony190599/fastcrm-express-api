import express from 'express';
import * as metricsController from '../controllers/metricsController.js';

const router = express.Router();

router.get('/dashboard', metricsController.getDashboardMetrics);

export default router;
