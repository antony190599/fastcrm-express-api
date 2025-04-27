import express from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/requestValidation.middleware.js';
import * as contactLogController from '../controllers/contactLogController.js';
import { 
  validateCreateContactLog, 
  validateUpdateContactLog, 
  validateGetContactLog, 
  validateGetContactLogs 
} from '../validator/contactLogValidators.js';

const router = express.Router();

router.get('/', validate(validateGetContactLogs), contactLogController.getAllContactLogs);
router.get('/:id', validate(validateGetContactLog), contactLogController.getContactLogById);
router.get('/contact/:contactId', validate([
  param('contactId').isUUID().withMessage('Invalid contact ID')
]), contactLogController.getContactLogsByContact);
router.post('/', validate(validateCreateContactLog), contactLogController.createContactLog);
router.put('/:id', validate(validateUpdateContactLog), contactLogController.updateContactLog);
router.delete('/:id', validate([
  param('id').isUUID().withMessage('Invalid contact log ID')
]), contactLogController.deleteContactLog);

export default router;
