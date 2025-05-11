// 存储服务，用于管理 API 密钥

// 存储 API 密钥
export const saveApiKey = (apiKey) => {
  try {
    localStorage.setItem('website_builder_api_key', apiKey);
    return true;
  } catch (error) {
    console.error('Failed to save API key:', error);
    return false;
  }
};

// 获取当前 API 密钥
export const getCurrentApiKey = (defaultKey, useDefaultKey, userKey) => {
  if (useDefaultKey) {
    return defaultKey;
  }
  
  if (userKey) {
    return userKey;
  }
  
  try {
    const savedKey = localStorage.getItem('website_builder_api_key');
    return savedKey || '';
  } catch (error) {
    console.error('Failed to get API key:', error);
    return '';
  }
};

// 检查 API 密钥是否有效
export const checkApiKey = async (apiKey) => {
  if (!apiKey) return false;
  
  try {
    return apiKey.length > 8;
  } catch (error) {
    console.error('Failed to verify API key:', error);
    return false;
  }
};