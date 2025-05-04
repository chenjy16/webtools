/**
 * API Utility Functions
 */

/**
 * Build complete URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Array} params - Parameter array, each element contains key and value
 * @returns {string} - Complete URL
 */
export const buildUrl = (baseUrl, params) => {
  // Filter out empty parameters
  const validParams = params.filter(p => p.key && p.value);
  
  if (validParams.length === 0) {
    return baseUrl;
  }
  
  const url = new URL(baseUrl);
  
  validParams.forEach(param => {
    url.searchParams.append(param.key, param.value);
  });
  
  return url.toString();
};

/**
 * Build request headers object
 * @param {Array} headers - Headers array, each element contains key and value
 * @returns {Object} - Headers object
 */
export const buildHeaders = (headers) => {
  const headerObj = {};
  
  headers.forEach(header => {
    if (header.key && header.value) {
      headerObj[header.key] = header.value;
    }
  });
  
  return headerObj;
};

/**
 * Format JSON string
 * @param {any} json - JSON object or string
 * @returns {string} - Formatted JSON string
 */
export const formatJson = (json) => {
  try {
    if (typeof json === 'string') {
      return JSON.stringify(JSON.parse(json), null, 2);
    } else {
      return JSON.stringify(json, null, 2);
    }
  } catch (e) {
    return json;
  }
};