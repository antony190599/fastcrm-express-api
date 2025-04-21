import { param, body } from 'express-validator';

export const validateSendMessage = [
  param('contactId')
    .isUUID()
    .withMessage('Invalid contact ID'),
  body('method')
    .isIn(['email', 'whatsapp'])
    .withMessage('Method must be either "email" or "whatsapp"'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required'),
  body('subject')
    .if(body('method').equals('email'))
    .notEmpty()
    .withMessage('Subject is required for email messages')
];

export const validateBulkSendMessage = [
  body('contactIds')
    .isArray({ min: 1 })
    .withMessage('At least one contact ID is required'),
  body('contactIds.*')
    .isUUID()
    .withMessage('All contact IDs must be valid UUIDs'),
  body('method')
    .isIn(['email', 'whatsapp'])
    .withMessage('Method must be either "email" or "whatsapp"'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required'),
  body('subject')
    .if(body('method').equals('email'))
    .notEmpty()
    .withMessage('Subject is required for email messages'),
  body('templateId')
    .optional()
    .isMongoId()
    .withMessage('If provided, template ID must be a valid MongoDB ID')
];
