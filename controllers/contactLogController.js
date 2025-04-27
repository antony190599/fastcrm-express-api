import * as contactLogService from '../services/contactLogService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { toContactLogDto, toContactLogDtoList } from '../dtos/contactLogDto.js';
import { getPaginationParams, createPaginationMeta } from '../utils/paginationUtils.js';

export const getAllContactLogs = async (req, res) => {
  try {
    const { contactId, method, status } = req.query;
    const pagination = getPaginationParams(req.query);
    
    const { contactLogs, total } = await contactLogService.getAllContactLogs(
      { contactId, method, status }, 
      pagination
    );
    
    const contactLogDtos = toContactLogDtoList(contactLogs);
    
    // Create pagination metadata
    const paginationMeta = createPaginationMeta(pagination.page, pagination.limit, total);
    
    res.json(successResponse(
      contactLogDtos, 
      'Contact logs fetched successfully',
      { pagination: paginationMeta }
    ));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching contact logs', [error.message]));
  }
};

export const getContactLogById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const contactLog = await contactLogService.getContactLogById(id);
    
    if (!contactLog) {
      return res.status(404).json(errorResponse('Contact log not found'));
    }
    
    const contactLogDto = toContactLogDto(contactLog);
    res.json(successResponse(contactLogDto, 'Contact log fetched successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching contact log', [error.message]));
  }
};

export const getContactLogsByContact = async (req, res) => {
  const { contactId } = req.params;
  const pagination = getPaginationParams(req.query);
  
  try {
    const { contactLogs, total } = await contactLogService.getContactLogsByContactId(contactId, pagination);
    const contactLogDtos = toContactLogDtoList(contactLogs);
    
    // Create pagination metadata
    const paginationMeta = createPaginationMeta(pagination.page, pagination.limit, total);
    
    res.json(successResponse(
      contactLogDtos, 
      'Contact logs fetched successfully',
      { pagination: paginationMeta }
    ));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching contact logs', [error.message]));
  }
};

export const createContactLog = async (req, res) => {
  const contactLogData = req.body;
  
  try {
    const contactLog = await contactLogService.createContactLog(contactLogData);
    const contactLogDto = toContactLogDto(contactLog);
    res.status(201).json(successResponse(contactLogDto, 'Contact log created successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error creating contact log', [error.message]));
  }
};

export const updateContactLog = async (req, res) => {
  const { id } = req.params;
  const contactLogData = req.body;
  
  try {
    const contactLog = await contactLogService.updateContactLog(id, contactLogData);
    const contactLogDto = toContactLogDto(contactLog);
    res.json(successResponse(contactLogDto, 'Contact log updated successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error updating contact log', [error.message]));
  }
};

export const deleteContactLog = async (req, res) => {
  const { id } = req.params;
  
  try {
    await contactLogService.deleteContactLog(id);
    res.json(successResponse(null, 'Contact log deleted successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error deleting contact log', [error.message]));
  }
};
