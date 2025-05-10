// 存储服务，用于管理 API 密钥

// 存储 API 密钥
export const saveApiKey = (apiKey) => {
  try {
    localStorage.setItem('website_builder_api_key', apiKey);
    return true;
  } catch (error) {
    console.error('保存 API 密钥失败:', error);
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
    console.error('获取 API 密钥失败:', error);
    return '';
  }
};

// 检查 API 密钥是否有效
export const checkApiKey = async (apiKey) => {
  if (!apiKey) return false;
  
  try {
    // 这里可以添加实际的 API 密钥验证逻辑
    // 例如，发送一个简单的请求到 Hugging Face API
    // 为简化示例，这里只检查密钥长度是否合理
    return apiKey.length > 8;
  } catch (error) {
    console.error('验证 API 密钥失败:', error);
    return false;
  }
};