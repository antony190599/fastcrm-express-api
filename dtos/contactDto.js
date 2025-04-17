/**
 * Transform a contact database object to a response DTO
 * @param {Object} contact - The contact database object
 * @returns {Object} - The contact DTO
 */
export const toContactDto = (contact) => {
  if (!contact) return null;
  
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    title: contact.title, // Changed from position to title to match the database schema
    companyId: contact.companyId,
    company: contact.company ? {
      id: contact.company.id,
      name: contact.company.name
    } : null,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt
  };
};

/**
 * Transform an array of contact database objects to response DTOs
 * @param {Array} contacts - Array of contact database objects
 * @returns {Array} - Array of contact DTOs
 */
export const toContactDtoList = (contacts) => {
  if (!contacts) return [];
  return contacts.map(contact => toContactDto(contact));
};