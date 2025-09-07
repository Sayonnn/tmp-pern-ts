/**
 * Standardized error response
 * @param {Response} res 
 * @param {number} status 
 * @param {string} message 
 * @param {string} [field] - optional field causing the error
 */
export function errorResponse(res, status, message, field = null) {
  return res.status(status).json({
    status: false,
    message,
    ...(field && { field })
  });
}

/**
 * Standardized success response
 * @param {Response} res
 * @param {string} message
 * @param {object} data
 */
export function successResponse(res, message, data = {}) {
  return res.status(200).json({
    status: true,
    message,
    ...data
  });
}
