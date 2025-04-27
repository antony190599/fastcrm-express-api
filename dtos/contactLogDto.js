/**
 * Transform a contact log database object to a response DTO
 * @param {Object} contactLog - The contact log database object
 * @returns {Object} - The contact log DTO
 */
export const toContactLogDto = (contactLog) => {
  if (!contactLog) return null;
  
  return {
    id: contactLog.id,
    contactId: contactLog.contactId,
    contact: contactLog.contact ? {
      id: contactLog.contact.id,
      firstName: contactLog.contact.firstName,
      lastName: contactLog.contact.lastName,
      email: contactLog.contact.email
    } : null,
    timestamp: contactLog.timestamp,
    templateId: contactLog.templateId,
    templateName: contactLog.templateName,
    messageId: contactLog.messageId,
    method: contactLog.method,
    notes: contactLog.notes,
    status: contactLog.status,
    createdAt: contactLog.createdAt,
    updatedAt: contactLog.updatedAt
  };
};

/**
 * Transform an array of contact log database objects to response DTOs
 * @param {Array} contactLogs - Array of contact log database objects
 * @returns {Array} - Array of contact log DTOs
 */
export const toContactLogDtoList = (contactLogs) => {
  if (!contactLogs) return [];
  return contactLogs.map(contactLog => toContactLogDto(contactLog));
};
