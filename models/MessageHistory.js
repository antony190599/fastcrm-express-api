import mongoose from 'mongoose';

const messageHistorySchema = new mongoose.Schema({
  contactId: { 
    type: String, 
    required: true,
    index: true 
  },
  method: { 
    type: String, 
    enum: ['email', 'whatsapp'], 
    required: true,
    index: true 
  },
  subject: { 
    type: String
  },
  content: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sent', 'failed', 'delivered', 'read'],
    default: 'sent',
    index: true
  },
  messageId: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

export default mongoose.model('MessageHistory', messageHistorySchema);
