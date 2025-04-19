/**
 * Parse pagination parameters from request
 * @param {Object} query - Request query object
 * @param {number} defaultLimit - Default limit if not specified
 * @returns {Object} - Pagination parameters
 */
export const getPaginationParams = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Create pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @returns {Object} - Pagination metadata
 */
export const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems: total,
    totalPages,
    hasNextPage,
    hasPrevPage
  };
};
