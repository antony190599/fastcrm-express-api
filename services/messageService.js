import { Resend } from 'resend';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';
import MessageHistory from '../models/MessageHistory.js';

dotenv.config();

// Destructure environment variables
const { RESEND_API_KEY, EMAIL_TEST_RECIPIENT } = process.env;

// Initialize Resend with API key
const resend = new Resend(RESEND_API_KEY);

/**
 * Send a message via specified channel (WhatsApp or Email)
 * @param {String} method - The message method ('whatsapp' or 'email')
 * @param {String} contactId - ID of contact to send message to
 * @param {Object} messageData - Message content data
 * @returns {Object} - Result of the send operation
 */
export const sendMessage = async (method, contactId, messageData) => {
  try {
    // Fetch contact details from database
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { company: true }
    });
    
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    // Choose method based on input
    let result;
    switch (method.toLowerCase()) {
      case 'email':
        result = await sendEmail(contact, messageData);
        break;
      
      case 'whatsapp':
        result = await sendWhatsApp(contact, messageData);
        break;
        
      default:
        throw new Error('Invalid message method. Use "email" or "whatsapp"');
    }

    // Track message history
    await saveMessageHistory(contactId, method, messageData, result);
    
    return result;
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
    throw error;
  }
};

/**
 * Send messages to multiple contacts at once
 * @param {String} method - Message method (email/whatsapp)
 * @param {Array<String>} contactIds - Array of contact IDs
 * @param {Object} messageData - Message content and subject
 * @returns {Array<Object>} - Results for each contact
 */
export const bulkSendMessage = async (method, contactIds, messageData) => {
  console.log(`Sending ${method} messages to ${contactIds.length} contacts`);
  
  const results = [];
  
  // Process each contact sequentially to avoid rate limits
  for (const contactId of contactIds) {
    try {
      const result = await sendMessage(method, contactId, messageData);
      results.push({
        contactId,
        success: true,
        ...result
      });
    } catch (error) {
      console.error(`Failed to send message to contact ${contactId}:`, error.message);
      results.push({
        contactId,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Save message to history for tracking and analytics
 */
const saveMessageHistory = async (contactId, method, messageData, result) => {
  try {
    const { subject, content } = messageData;
    
    const messageHistory = await MessageHistory.create({
      contactId,
      method,
      subject,
      content,
      status: result && result.success !== false ? 'sent' : 'failed',
      messageId: result && result.messageId ? result.messageId : null
    });
    
    console.log(`Message history saved: ${messageHistory._id}`);
    return messageHistory;
  } catch (error) {
    console.error('Error saving message history:', error);
    // No lanzamos el error para no interrumpir el flujo principal
    return null;
  }
};

/**
 * Get message metrics for dashboard
 */
export const getMessageMetrics = async () => {
  try {
    console.log('Fetching message metrics from database...');
    
    // Obtenemos el conteo total
    const totalCount = await MessageHistory.countDocuments();
    console.log(`Total messages found: ${totalCount}`);
    
    // Obtenemos el conteo por método
    const emailCount = await MessageHistory.countDocuments({ method: 'email' });
    const whatsappCount = await MessageHistory.countDocuments({ method: 'whatsapp' });
    
    console.log(`Email messages: ${emailCount}, WhatsApp messages: ${whatsappCount}`);
    
    return {
      total: totalCount,
      byMethod: {
        email: emailCount,
        whatsapp: whatsappCount
      }
    };
  } catch (error) {
    console.error('Error fetching message metrics:', error);
    return { total: 0, byMethod: { email: 0, whatsapp: 0 } };
  }
};

/**
 * Send an email using Resend API
 * @param {Object} contact - Contact information
 * @param {Object} messageData - Message content
 * @returns {Object} - Result of email send operation
 */
const sendEmail = async (contact, messageData) => {
  try {
    let { subject, content } = messageData;
    
    if (!subject || !content) {
      throw new Error('Email subject and content are required');
    }
    
    if (!contact.email) {
      throw new Error('Contact has no email address');
    }

    if (EMAIL_TEST_RECIPIENT) {
      console.log(`Sending test email to ${EMAIL_TEST_RECIPIENT}`);

      content += `<br><br>To: ${contact.email}`;
    }  
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: EMAIL_TEST_RECIPIENT ?? contact.email,
      subject: subject,
      html: content,
    });
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    return {
      success: true,
      method: 'email',
      recipient: contact.email,
      messageId: data.id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

/**
 * Send a WhatsApp message (placeholder for WhatsApp integration)
 * @param {Object} contact - Contact information
 * @param {Object} messageData - Message content
 * @returns {Object} - Result of WhatsApp send operation
 */
const sendWhatsApp = async (contact, messageData) => {
  try {
    const { content } = messageData;
    
    if (!content) {
      throw new Error('WhatsApp message content is required');
    }
    
    if (!contact.phone) {
      throw new Error('Contact has no phone number');
    }
    
    // This is a placeholder for actual WhatsApp API integration
    // You would implement the real WhatsApp sending logic here
    
    console.log(`Sending WhatsApp message to ${contact.phone}: ${content}`);
    // Asegúrate de que esta respuesta tenga la misma estructura que la de sendEmail
    const messageId = `whatsapp-${Date.now()}`;
    
    // Registra explícitamente el éxito del mensaje
    console.log(`WhatsApp message sent successfully with ID: ${messageId}`);
    // Mock successful response
    return {
      success: true,
      method: 'whatsapp',
      recipient: contact.phone,
      messageId: messageId,
      timestamp: new Date().toISOString(),
      data: { id: messageId }
    };
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error.message}`);
    throw error;
  }
};
