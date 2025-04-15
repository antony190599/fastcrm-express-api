import express from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/requestValidation.middleware.js';
import * as companyController from '../controllers/companyController.js';
import { validateCreateCompany, validateUpdateCompany, validateGetCompany } from '../validator/companyValidators.js';

const router = express.Router();

router.get('/', companyController.getAllCompanies);
router.get('/:id', validate(validateGetCompany), companyController.getCompanyById);
router.post('/', validate(validateCreateCompany), companyController.createCompany);
router.put('/:id', validate(validateUpdateCompany), companyController.updateCompany);
router.delete('/:id', validate([
  param('id').isUUID().withMessage('Invalid company ID')
]), companyController.deleteCompany);

export default router;
