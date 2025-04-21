import express from 'express';
import { validate } from '../middleware/requestValidation.middleware.js';
import * as messageController from '../controllers/messageController.js';
import { validateSendMessage, validateBulkSendMessage } from '../validator/messageValidators.js';

const router = express.Router();

router.post('/:contactId', validate(validateSendMessage), messageController.sendMessage);
router.post('/bulk', validate(validateBulkSendMessage), messageController.bulkSendMessage);

export default router;
