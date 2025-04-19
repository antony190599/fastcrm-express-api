import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import * as plantillaService from '../services/plantillaService.js';
import { TemplateResponseDTO } from '../dtos/TemplateResponseDTO.js';
import { getPaginationParams, createPaginationMeta } from '../utils/paginationUtils.js';

export const getAllTemplates = async (req, res) => {
  const { q, type } = req.query;
  const pagination = getPaginationParams(req.query);

  try {
    const { templates, total } = await plantillaService.getAllTemplates(q, type, pagination);
    const formattedTemplates = templates.map(template => new TemplateResponseDTO(template));
    
    // Create pagination metadata
    const paginationMeta = createPaginationMeta(pagination.page, pagination.limit, total);
    
    res.status(200).json(successResponse(
      formattedTemplates, 
      'Templates fetched successfully',
      { pagination: paginationMeta }
    ));
  } catch (error) {
    console.log(error);
    res.status(500).json(errorResponse('Error fetching templates', [error.message]));
  }
};

export const createTemplate = async (req, res) => {
  const { type, content, labels, author } = req.body || {};

  if (!type || !content || !author) {
    return res.status(400).json(errorResponse('Type, content, and author are required'));
  }

  try {
    const newTemplate = await plantillaService.createTemplate({ type, content, labels, author });
    const formattedTemplate = new TemplateResponseDTO(newTemplate);
    res.status(201).json(successResponse(formattedTemplate, 'Template created successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Error creating template', [error.message]));
  }
};

export const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { type, content, labels, author } = req.body;

  if (!type || !content || !author) {
    return res.status(400).json(errorResponse('Type, content, and author are required'));
  }

  try {
    const updatedTemplate = await plantillaService.updateTemplate(id, { type, content, labels, author });

    if (!updatedTemplate) {
      return res.status(404).json(errorResponse('Template not found'));
    }

    const formattedTemplate = new TemplateResponseDTO(updatedTemplate);
    res.status(200).json(successResponse(formattedTemplate, 'Template updated successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Error updating template', [error.message]));
  }
};

export const deleteTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await plantillaService.deleteTemplate(id);

    if (!deletedTemplate) {
      return res.status(404).json(errorResponse('Template not found'));
    }

    res.status(200).json(successResponse(null, 'Template deleted successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Error deleting template', [error.message]));
  }
};

export const getTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await plantillaService.getTemplateById(id);

    if (!template) {
      return res.status(404).json(errorResponse('Template not found'));
    }

    const formattedTemplate = new TemplateResponseDTO(template);
    res.status(200).json(successResponse(formattedTemplate, 'Template fetched successfully'));
  } catch (error) {
    res.status (500).json(errorResponse('Error fetching template', [error.message]));
  }
};