const express = require('express');
const router = express.Router();
const plantillaController = require('../controllers/plantillaController');

// GET all templates (supports optional keyword search with query parameter 'q')
router.get('/', plantillaController.getAllTemplates);

// POST a new template
router.post('/', plantillaController.createTemplate);

// PUT (update) a template by ID
router.put('/:id', plantillaController.updateTemplate);

// DELETE a template by ID
router.delete('/:id', plantillaController.deleteTemplate);

module.exports = router;
