import { param, query, body } from 'express-validator';

export const validateGetTemplates = [
  query('q')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Query must be at least 2 characters long'),
  query('type')
    .optional()
    .isIn(['seguimiento', 'bienvenida'])
    .withMessage('Type must be either "seguimiento", "bienvenida"'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const validateCreateTemplate = [
  body('type').notEmpty().withMessage('Type is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

export const validateUpdateTemplate = [
  param('id').isMongoId().withMessage('Invalid template ID'),
  body('type').notEmpty().withMessage('Type is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

export const validateGetTemplate = [
  param('id').isMongoId().withMessage('Invalid template ID'),
];