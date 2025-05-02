// API base URL
export const API_BASE_URL = 'https://api.mail.tm';

// Keys for sessionStorage and localStorage
export const SESSION_ACCOUNT_KEY = 'tempmailAccount';
export const SESSION_TOKEN_KEY = 'tempmailToken';
export const LAST_CREATE_TIME_KEY = 'tempmailLastCreateTime';

// Rate limit configuration (in milliseconds)
export const CREATE_RATE_LIMIT = 60 * 1000; // 60 seconds

// Fetch domains
export const fetchDomains = async () => {
  const response = await fetch(`${API_BASE_URL}/domains`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch domains');
  }

  const data = await response.json();
  return data['hydra:member'] || [];
};

// Create account
export const createAccount = async (username, domain, password) => {
  const email = `${username}@${domain}`;
  const createResponse = await fetch(`${API_BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json().catch(() => ({ message: createResponse.statusText }));
    if (createResponse.status === 400 && errorData.detail === 'Account already exists.') {
      throw new Error('An email with this username already exists. Please try a different username.');
    }
    if (createResponse.status === 429) {
      const retryAfter = createResponse.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : CREATE_RATE_LIMIT;
      throw new Error(`Creation rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`, waitTime);
    }
    throw new Error(errorData.message || errorData.detail || 'Failed to create account');
  }

  return createResponse.json();
};

// Get token
export const getToken = async (email, password) => {
  const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json().catch(() => ({ message: tokenResponse.statusText }));
    if (tokenResponse.status === 429) {
      const retryAfter = tokenResponse.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : CREATE_RATE_LIMIT;
      throw new Error(`Login rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`, waitTime);
    }
    throw new Error(errorData.message || errorData.detail || 'Failed to login');
  }

  return tokenResponse.json();
};

// Fetch messages
export const fetchMessages = async (token) => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired or invalid', 401);
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || errorData.detail || 'Failed to fetch messages');
  }

  const data = await response.json();
  if (data && data['hydra:member']) {
    return data['hydra:member'].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return [];
};

// Fetch message details
export const fetchMessageDetails = async (token, messageId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired or invalid', 401);
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || errorData.detail || 'Failed to fetch message details');
  }

  return response.json();
};

// Mark message as read
export const markMessageAsRead = async (token, messageId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/ld+json'
    },
    body: JSON.stringify({ seen: true })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired or invalid', 401);
    }
    console.error(`Failed to mark message ${messageId} as read: ${response.status}`);
  }
};

// Delete message
export const deleteMessage = async (token, messageId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired or invalid', 401);
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || errorData.detail || 'Failed to delete message');
  }
};