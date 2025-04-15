import * as contactService from '../services/contactService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { toContactDto, toContactDtoList } from '../dtos/contactDto.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    const contactDtos = toContactDtoList(contacts);
    res.json(successResponse(contactDtos, 'Contacts fetched successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching contacts', [error.message]));
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const contact = await contactService.getContactById(id);
    
    if (!contact) {
      return res.status(404).json(errorResponse('Contact not found'));
    }
    
    const contactDto = toContactDto(contact);
    res.json(successResponse(contactDto, 'Contact fetched successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error fetching contact', [error.message]));
  }
};

export const createContact = async (req, res) => {
  const contactData = req.body;
  
  try {
    const contact = await contactService.createContact(contactData);
    const contactDto = toContactDto(contact);
    res.status(201).json(successResponse(contactDto, 'Contact created successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error creating contact', [error.message]));
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const contactData = req.body;
  
  try {
    const contact = await contactService.updateContact(id, contactData);
    const contactDto = toContactDto(contact);
    res.json(successResponse(contactDto, 'Contact updated successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error updating contact', [error.message]));
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  
  try {
    await contactService.deleteContact(id);
    
    res.json(successResponse(null, 'Contact deleted successfully'));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse('Error deleting contact', [error.message]));
  }
};
