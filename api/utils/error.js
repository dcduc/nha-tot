export const errorHandler = (statusCode, message, additionalInfo = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  Object.assign(error, additionalInfo);
  return error;
};
