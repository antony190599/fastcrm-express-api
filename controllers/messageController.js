import * as messageService from '../services/messageService.js';
import * as plantillaService from '../services/plantillaService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Send a message to a contact using the specified method
 */
export const sendMessage = async (req, res) => {
  const { contactId } = req.params;
  const { method, subject, content } = req.body;
  
  try {
    // Validate required fields
    if (!method) {
      return res.status(400).json(errorResponse('Message method is required (email or whatsapp)'));
    }
    
    if (!content) {
      return res.status(400).json(errorResponse('Message content is required'));
    }
    
    // For email, subject is required
    if (method.toLowerCase() === 'email' && !subject) {
      return res.status(400).json(errorResponse('Subject is required for email messages'));
    }
    
    // Send message using the appropriate service
    const result = await messageService.sendMessage(
      method,
      contactId,
      { subject, content }
    );
    
    res.status(200).json(successResponse(
      result,
      `Message sent successfully via ${method}`
    ));
  } catch (error) {
    console.error(`Error in sendMessage controller: ${error.message}`);
    res.status(500).json(errorResponse('Error sending message', [error.message]));
  }
};

/**
 * Send a message to multiple contacts at once
 */
export const bulkSendMessage = async (req, res) => {
  const { contactIds, method, subject, content, templateId } = req.body;
  
  try {
    // Validate required fields - already done by validator, but double-checking
    if (!contactIds || contactIds.length === 0) {
      return res.status(400).json(errorResponse('At least one contact ID is required'));
    }
    
    if (!method) {
      return res.status(400).json(errorResponse('Message method is required (email or whatsapp)'));
    }
    
    // Get template content if a templateId was provided
    let finalContent = content;
    if (templateId) {
      const template = await plantillaService.getTemplateById(templateId);
      if (!template) {
        return res.status(404).json(errorResponse('Template not found'));
      }
      finalContent = template.content;
    }
    
    // For email, subject is required
    if (method.toLowerCase() === 'email' && !subject) {
      return res.status(400).json(errorResponse('Subject is required for email messages'));
    }
    
    // Send message to multiple recipients
    const results = await messageService.bulkSendMessage(
      method,
      contactIds,
      { subject, content: finalContent }
    );
    
    res.status(200).json(successResponse(
      results,
      `Messages sent successfully via ${method} to ${results.filter(r => r.success).length}/${contactIds.length} contacts`
    ));
  } catch (error) {
    console.error(`Error in bulkSendMessage controller: ${error.message}`);
    res.status(500).json(errorResponse('Error sending messages', [error.message]));
  }
};
