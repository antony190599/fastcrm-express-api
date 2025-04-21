import prisma from '../lib/prisma.js';
import Plantilla from '../models/Plantilla.js';
import { getMessageMetrics } from './messageService.js';

/**
 * Get dashboard metrics including:
 * - Total templates by type
 * - Total contacts
 * - Total companies
 * - Total messages sent by method
 */
export const getDashboardMetrics = async () => {
  try {
    // Get contact and company counts from PostgreSQL via Prisma
    const [contactCount, companyCount] = await Promise.all([
      prisma.contact.count(),
      prisma.company.count()
    ]);

    // Get template counts from MongoDB
    const templateMetrics = await getTemplateMetrics();

    // Get message metrics
    const messageMetrics = await getMessageMetrics();

    return {
      contacts: {
        total: contactCount
      },
      companies: {
        total: companyCount
      },
      templates: templateMetrics,
      messages: messageMetrics
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

/**
 * Get template metrics including total count and breakdown by type
 */
const getTemplateMetrics = async () => {
  try {
    // Get total template count
    const totalCount = await Plantilla.countDocuments();

    // Get count by type using aggregation
    const typeBreakdown = await Plantilla.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { type: "$_id", count: 1, _id: 0 } }
    ]);

    // Convert to more friendly format
    const byType = {};
    typeBreakdown.forEach(item => {
      byType[item.type] = item.count;
    });

    return {
      total: totalCount,
      byType
    };
  } catch (error) {
    console.error('Error fetching template metrics:', error);
    return { total: 0, byType: {} };
  }
};
