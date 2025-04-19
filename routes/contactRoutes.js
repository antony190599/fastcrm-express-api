import express from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/requestValidation.middleware.js';
import * as contactController from '../controllers/contactController.js';
import { validateCreateContact, validateUpdateContact, validateGetContact, validateGetContacts } from '../validator/contactValidators.js';

const router = express.Router();

router.get('/', validate(validateGetContacts), contactController.getAllContacts);
router.get('/search', contactController.searchContacts); // Add new search route
router.get('/:id', validate(validateGetContact), contactController.getContactById);
router.post('/', validate(validateCreateContact), contactController.createContact);
router.put('/:id', validate(validateUpdateContact), contactController.updateContact);
router.delete('/:id', validate([
  param('id').isUUID().withMessage('Invalid contact ID')
]), contactController.deleteContact);

export default router;