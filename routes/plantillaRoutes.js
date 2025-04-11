import express from 'express';
import * as plantillaController from '../controllers/plantillaController.js';
import { validate } from '../middleware/requestValidation.middleware.js';
import {
  validateGetTemplates,
  validateCreateTemplate,
  validateUpdateTemplate,
} from '../validator/templatesValidators.js';

const router = express.Router();

router.get('/', validate(validateGetTemplates), plantillaController.getAllTemplates);
router.post('/', validate(validateCreateTemplate), plantillaController.createTemplate);
router.put('/:id', validate(validateUpdateTemplate), plantillaController.updateTemplate);
router.delete('/:id', plantillaController.deleteTemplate);

export default router;
