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
