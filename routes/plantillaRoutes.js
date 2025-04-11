const express = require('express');
const router = express.Router();
const plantillaController = require('../controllers/plantillaController');
const { validate } = require('../middleware/requestValidationMiddleware');
const {
	validateGetTemplates,
	validateCreateTemplate,
	validateUpdateTemplate,
} = require('../validator/templatesValidators');

// GET all templates (supports optional keyword search with query parameter 'q')
router.get('/', validate(validateGetTemplates), plantillaController.getAllTemplates);

// POST a new template
router.post('/', validate(validateCreateTemplate), plantillaController.createTemplate);

// PUT (update) a template by ID
router.put('/:id', validate(validateUpdateTemplate), plantillaController.updateTemplate);

// DELETE a template by ID
router.delete('/:id', plantillaController.deleteTemplate);

module.exports = router;
