import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import * as metricsService from '../services/metricsService.js';

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await metricsService.getDashboardMetrics();
    res.status(200).json(successResponse(
      metrics,
      'Dashboard metrics fetched successfully'
    ));
  } catch (error) {
    console.error('Error in metrics controller:', error);
    res.status(500).json(errorResponse('Error fetching dashboard metrics', [error.message]));
  }
};
