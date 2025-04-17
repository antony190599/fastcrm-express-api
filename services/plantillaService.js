import Plantilla from '../models/Plantilla.js';

export const getAllTemplates = async (query, type) => {
    console.log('Getting all templates with query:', query, 'and type:', type);
  const filter = {
    ...(query && { content: { $regex: query, $options: 'i' } }),
    ...(type && { type }),
  };
  const queryExecution = Plantilla.find(filter);
  // clone the query to avoid modifying the original one
  const clonedQuery = queryExecution.clone();
  const explainResult = await clonedQuery.explain('executionStats'); // Evaluate performance
  console.log('Query Performance:', explainResult); // Log performance details
  return await queryExecution;
};

export const createTemplate = async (data) => {
  const newTemplate = new Plantilla(data);
  return await newTemplate.save();
};

export const updateTemplate = async (id, data) => {
  return await Plantilla.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
};

export const deleteTemplate = async (id) => {
  return await Plantilla.findByIdAndDelete(id);
};

export const getTemplateById = async (id) => {
  return await Plantilla.findById(id);
};