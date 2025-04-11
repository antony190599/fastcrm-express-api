const { errorResponse } = require('../utils/responseFormatter');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json(errorResponse('Internal Server Error', [err.message]));
};

module.exports = { errorHandlerMiddleware };
