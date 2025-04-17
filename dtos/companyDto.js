/**
 * Transform a company database object to a response DTO
 * @param {Object} company - The company database object
 * @returns {Object} - The company DTO
 */
export const toCompanyDto = (company) => {
  if (!company) return null;
  
  return {
    id: company.id,
    name: company.name,
    ruc: company.ruc,
    industry: company.industry,
    website: company.website,
    address: company.address,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt
  };
};

/**
 * Transform an array of company database objects to response DTOs
 * @param {Array} companies - Array of company database objects
 * @returns {Array} - Array of company DTOs
 */
export const toCompanyDtoList = (companies) => {
  if (!companies) return [];
  return companies.map(company => toCompanyDto(company));
};
