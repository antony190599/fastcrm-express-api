const Plantilla = require('../models/Plantilla');

// GET all templates
exports.getAllTemplates = async (req, res) => {
  const { q } = req.query;

  try {
    const query = q
      ? { content: { $regex: q, $options: 'i' } } // Search by keyword if 'q' is provided
      : {}; // Otherwise, return all templates

    const templates = await Plantilla.find(query);
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
};

// POST a new template
exports.createTemplate = async (req, res) => {
  const { type, content, labels, author } = req.body;

  if (!type || !content || !author) {
    return res.status(400).json({ message: 'Type, content, and author are required' });
  }

  try {
    const newTemplate = new Plantilla({ type, content, labels, author });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error });
  }
};

// PUT (update) a template by ID
exports.updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { type, content, labels, author } = req.body;

  if (!type || !content || !author) {
    return res.status(400).json({ message: 'Type, content, and author are required' });
  }

  try {
    const updatedTemplate = await Plantilla.findByIdAndUpdate(
      id,
      { type, content, labels, author },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error });
  }
};

// DELETE a template by ID
exports.deleteTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await Plantilla.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error });
  }
};
