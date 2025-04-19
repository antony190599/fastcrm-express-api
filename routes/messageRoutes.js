import express from 'express';
import { validate } from '../middleware/requestValidation.middleware.js';
import * as messageController from '../controllers/messageController.js';
import { validateSendMessage } from '../validator/messageValidators.js';

const router = express.Router();

router.post('/:contactId', validate(validateSendMessage), messageController.sendMessage);

export default router;
