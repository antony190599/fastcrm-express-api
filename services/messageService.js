import { Resend } from 'resend';
import dotenv from 'dotenv';
import prisma from '../lib/prisma.js';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
    switch (method.toLowerCase()) {
      case 'email':
        return await sendEmail(contact, messageData);
      
      case 'whatsapp':
        return await sendWhatsApp(contact, messageData);
        
      default:
        throw new Error('Invalid message method. Use "email" or "whatsapp"');
    }
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
    throw error;
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
    const { subject, content } = messageData;
    
    if (!subject || !content) {
      throw new Error('Email subject and content are required');
    }
    
    if (!contact.email) {
      throw new Error('Contact has no email address');
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: contact.email,
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
    
    // Mock successful response
    return {
      success: true,
      method: 'whatsapp',
      recipient: contact.phone,
      messageId: `whatsapp-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error.message}`);
    throw error;
  }
};
