import prisma from '../lib/prisma.js';

export const getAllContactLogs = async (filters, pagination) => {
  // Build filter conditions
  const where = {};
  
  if (filters.contactId) {
    where.contactId = filters.contactId;
  }
  
  if (filters.method) {
    where.method = filters.method;
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  // Get total count for pagination
  const total = await prisma.contactLog.count({ where });
  
  // Get paginated contact logs
  const contactLogs = await prisma.contactLog.findMany({
    where,
    include: { contact: true },
    orderBy: { timestamp: 'desc' },
    skip: pagination.skip,
    take: pagination.limit
  });
  
  return { contactLogs, total };
};

export const getContactLogById = async (id) => {
  return await prisma.contactLog.findUnique({
    where: { id },
    include: { contact: true }
  });
};

export const getContactLogsByContactId = async (contactId, pagination) => {
  // Get total count for pagination
  const total = await prisma.contactLog.count({
    where: { contactId }
  });
  
  // Get paginated contact logs for a specific contact
  const contactLogs = await prisma.contactLog.findMany({
    where: { contactId },
    orderBy: { timestamp: 'desc' },
    skip: pagination.skip,
    take: pagination.limit
  });
  
  return { contactLogs, total };
};

export const createContactLog = async (contactLogData) => {
  const { contactId, templateId, templateName, messageId, method, notes, status } = contactLogData;
  
  return await prisma.contactLog.create({
    data: {
      contactId,
      templateId,
      templateName,
      messageId,
      method,
      notes,
      status: status || 'success'
    },
    include: { contact: true }
  });
};

export const updateContactLog = async (id, contactLogData) => {
  const { templateId, templateName, messageId, method, notes, status } = contactLogData;
  
  return await prisma.contactLog.update({
    where: { id },
    data: {
      ...(templateId !== undefined && { templateId }),
      ...(templateName !== undefined && { templateName }),
      ...(messageId !== undefined && { messageId }),
      ...(method !== undefined && { method }),
      ...(notes !== undefined && { notes }),
      ...(status !== undefined && { status })
    },
    include: { contact: true }
  });
};

export const deleteContactLog = async (id) => {
  return await prisma.contactLog.delete({
    where: { id }
  });
};
