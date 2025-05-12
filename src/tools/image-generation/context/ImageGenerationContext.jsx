import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建上下文
const ImageGenerationContext = createContext();

// 自定义钩子，用于在组件中访问上下文
export const useImageGeneration = () => useContext(ImageGenerationContext);

// 上下文提供者组件
export const ImageGenerationProvider = ({ children }) => {
  // 状态管理
  const [apiKey, setApiKey] = useState('');
  const [useDefaultKey, setUseDefaultKey] = useState(true);
  const [defaultApiKey, setDefaultApiKey] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // 获取默认API密钥
  const getDefaultApiKey = () => {
    // 1. 首先检查window上是否有Cloudflare Workers注入的环境变量
    if (typeof window !== 'undefined' && window.ENV_VITE_HUGGINGFACE_API_KEY) {
      return window.ENV_VITE_HUGGINGFACE_API_KEY;
    }
    
    // 2. 尝试从从vite环境变量获取
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      return import.meta.env.VITE_HUGGINGFACE_API_KEY;
    }
    
    // 3. 从本地存储尝试获取之前保存的值
    try {
      const savedKey = localStorage.getItem('image_generation_api_key');
      if (savedKey) {
        return savedKey;
      }
    } catch (e) {
      console.log('无法访问本地存储');
    }
    
    return "";
  };
  
  // 在组件挂载时获取API密钥
  useEffect(() => {
    // 首次获取API Key
    const initialApiKey = getDefaultApiKey();
    setDefaultApiKey(initialApiKey);

    // 添加事件监听器来检测环境变量注入
    const handleEnvVarsInjected = () => {
      if (typeof window !== 'undefined' && window.ENV_VITE_HUGGINGFACE_API_KEY) {
        setDefaultApiKey(window.ENV_VITE_HUGGINGFACE_API_KEY);
      }
    };

    // 添加事件监听
    document.addEventListener('env-vars-injected', handleEnvVarsInjected);
    
    // 设置定时器，每5秒检查一次window上的环境变量
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && window.ENV_VITE_HUGGINGFACE_API_KEY) {
        setDefaultApiKey(window.ENV_VITE_HUGGINGFACE_API_KEY);
        clearInterval(intervalId); // 找到后停止检查
      }
    }, 5000);

    // 清理函数
    return () => {
      document.removeEventListener('env-vars-injected', handleEnvVarsInjected);
      clearInterval(intervalId);
    };
  }, []);

  // 保存API密钥到本地存储
  const saveApiKey = (key) => {
    try {
      localStorage.setItem('image_generation_api_key', key);
      return true;
    } catch (e) {
      console.error('保存API密钥失败:', e);
      return false;
    }
  };

  // 获取当前API密钥
  const getCurrentApiKey = () => {
    return useDefaultKey ? defaultApiKey : apiKey;
  };

  // 提供上下文值
  const contextValue = {
    apiKey,
    setApiKey,
    useDefaultKey,
    setUseDefaultKey,
    defaultApiKey,
    setDefaultApiKey,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    setSnackbarSeverity,
    snackbarOpen,
    setSnackbarOpen,
    saveApiKey,
    getCurrentApiKey
  };

  return (
    <ImageGenerationContext.Provider value={contextValue}>
      {children}
    </ImageGenerationContext.Provider>
  );
};