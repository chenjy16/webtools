/**
 * API Tester Constants
 */

// Local storage key names
export const STORAGE_KEYS = {
  // HISTORY: 'api_tester_history', // Removed history key
  FAVORITES: 'api_tester_favorites'
};

// Request method options
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

// Common API examples
export const API_EXAMPLES = [
  { name: 'JSONPlaceholder Posts', url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET' },
  { name: 'JSONPlaceholder Users', url: 'https://jsonplaceholder.typicode.com/users', method: 'GET' },
  { name: 'Random User API', url: 'https://randomuser.me/api/', method: 'GET' },
  { name: 'Httpbin', url: 'https://httpbin.org/get', method: 'GET' },
];

// Request body format types
export const BODY_FORMATS = [
  { value: 'json', label: 'JSON', contentType: 'application/json' },
  { value: 'form', label: 'Form Data (x-www-form-urlencoded)', contentType: 'application/x-www-form-urlencoded' },
  { value: 'formData', label: 'Form Data (multipart/form-data)', contentType: 'multipart/form-data' },
  { value: 'xml', label: 'XML', contentType: 'application/xml' },
  { value: 'text', label: 'Plain Text', contentType: 'text/plain' }
];