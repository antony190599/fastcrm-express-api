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
    .isString()
    .withMessage('error'),
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