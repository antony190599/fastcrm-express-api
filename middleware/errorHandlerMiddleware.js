import { errorResponse } from '../utils/responseFormatter.js';

export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(errorResponse('Internal Server Error', [err.message]));
};
