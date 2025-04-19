# FASTCRM-EXPRESS-API1

## Message Sending Feature

This API supports sending messages to contacts through different channels (WhatsApp and Email).

### Implementation Details

#### Overview
The message sending feature allows users to select between WhatsApp and Email as the delivery method when communicating with contacts. For email delivery, the API uses [Resend](https://resend.com) to handle the sending process.

#### Configuration
- Emails are sent from `onboarding@resend.dev`
- Requires a valid Resend API key in the `.env` file (`RESEND_API_KEY`)

#### How to Use

1. **API Endpoint**
   - `POST /api/messages/:contactId`

2. **Request Body**
   ```json
   {
     "method": "email", // or "whatsapp"
     "subject": "Message Subject", // Required for email
     "content": "Message content goes here"
   }
   ```

3. **Response Format**
   ```json
   {
     "success": true,
     "message": "Message sent successfully via email",
     "data": {
       "success": true,
       "method": "email",
       "recipient": "contact@example.com",
       "messageId": "re_123456789",
       "timestamp": "2023-08-01T12:00:00.000Z"
     }
   }
   ```

#### Frontend Implementation Guide

To implement this feature in the frontend application:

1. **Create a message composition form** that includes:
   - Contact selection (or receive it from the contact detail page)
   - Message method selection (Radio buttons or dropdown with "WhatsApp" and "Email" options)
   - Subject field (shown only when "Email" is selected)
   - Message content textarea
   - Send button

2. **Handle method selection changes** by:
   - Showing/hiding the subject field when the user switches between Email and WhatsApp
   - Changing any preview or formatting based on the selected method

3. **Form Validation**:
   - Ensure content is provided for any method
   - Ensure subject is provided when Email is selected
   - Validate that the selected contact has the appropriate contact information (email or phone)

4. **API Integration**:
   ```javascript
   async function sendMessage(contactId, method, subject, content) {
     try {
       const response = await fetch(`/api/messages/${contactId}`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ method, subject, content })
       });
       
       const result = await response.json();
       
       if (!result.success) {
         throw new Error(result.message || 'Failed to send message');
       }
       
       return result.data;
     } catch (error) {
       console.error('Error sending message:', error);
       throw error;
     }
   }
   ```

5. **User Experience Considerations**:
   - Provide feedback during the sending process (loading indicator)
   - Display success or error messages after sending
   - Consider adding a message history feature for tracking communications