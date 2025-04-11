const Plantilla = require('../models/Plantilla');

exports.getAllTemplates = async (query) => {
  const filter = query
    ? { content: { $regex: query, $options: 'i' } }
    : {};
  return await Plantilla.find(filter);
};

exports.createTemplate = async (data) => {
  const newTemplate = new Plantilla(data);
  return await newTemplate.save();
};

exports.updateTemplate = async (id, data) => {
  return await Plantilla.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
};

exports.deleteTemplate = async (id) => {
  return await Plantilla.findByIdAndDelete(id);
};
