export const successResponse = (data, message = 'Success', meta = null) => ({
  success: true,
  message,
  data,
  ...(meta && { meta })
});

export const errorResponse = (message = 'Error', errors = []) => ({
  success: false,
  message,
  errors,
});