import * as messageService from '../services/messageService.js';
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
