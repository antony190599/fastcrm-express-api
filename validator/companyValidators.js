import { param, body } from 'express-validator';

export const validateCreateCompany = [
  body('name').notEmpty().withMessage('Company name is required'),
  body('industry').optional().isString().withMessage('Industry must be a string'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('address').optional().isString().withMessage('Address must be a string')
];

export const validateUpdateCompany = [
  param('id').isUUID().withMessage('Invalid company ID'),
  body('name').notEmpty().withMessage('Company name is required'),
  body('industry').optional().isString().withMessage('Industry must be a string'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('address').optional().isString().withMessage('Address must be a string')
];

export const validateGetCompany = [
  param('id').isUUID().withMessage('Invalid company ID')
];
