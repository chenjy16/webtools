import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { generateWebsiteHtml } from '../services/HtmlGenerator.jsx';
import { getCurrentApiKey, saveApiKey, checkApiKey } from '../services/StorageService';
import { sendChatMessage, streamChatMessage } from '../services/AIService';

const WebsiteBuilderContext = createContext();

export const useWebsiteBuilder = () => useContext(WebsiteBuilderContext);

export const WebsiteBuilderProvider = ({ children }) => {
  // 网站构建相关状态 - 增强网站信息结构
  const [websiteType, setWebsiteType] = useState('');
  const [websiteInfo, setWebsiteInfo] = useState({
    title: '',
    description: '',
    sections: [],
    theme: 'light',
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    fontFamily: 'Segoe UI, sans-serif',
    headerStyle: 'fixed',
    footerStyle: 'simple',
    layoutType: 'standard',
    animations: true,
    features: {
      contactForm: false,
      gallery: false,
      testimonials: false,
      socialMedia: false,
      newsletter: false
    }
  });
  
  // 聊天相关状态
  const [chatMessages, setChatMessages] = useState([
    { 
      isUser: false, 
      text: '你好！我是网站构建助手。请直接告诉我你想要什么样的网站，我会立即为你生成。例如：一个简单的个人博客，包含首页、关于我和联系方式三个部分。' 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setChatLoading] = useState(false);
  
  // 流式响应相关状态
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedHtml, setStreamedHtml] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  
  // UI 相关状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // 移除实时预览功能，默认设置为false
  const [livePreviewEnabled, setLivePreviewEnabled] = useState(false);
  
  // 项目管理相关状态
  const [savedProjects, setSavedProjects] = useState([]);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  
  // API 相关状态
  const DEFAULT_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
  const [provider, setProvider] = useState('novita');
  const [apiKey, setApiKey] = useState('');
  const [useDefaultKey, setUseDefaultKey] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  
  const chatEndRef = useRef(null);
  
  // 初始化时加载保存的项目
  useEffect(() => {
    const savedProjectsData = localStorage.getItem('savedProjects');
    if (savedProjectsData) {
      try {
        setSavedProjects(JSON.parse(savedProjectsData));
      } catch (error) {
        console.error('加载保存的项目失败:', error);
      }
    }
  }, []);
  
  // 处理使用预制提示词模板
  const handleUseTemplate = (template) => {
    setUserInput(template);
  };
  
  // 增强网站信息提取功能
  const extractWebsiteInfoFromChat = (messages) => {
    // 分析聊天历史，提取网站信息
    let extractedInfo = {...websiteInfo};
    let websiteTypeFound = websiteType;
    
    // 遍历最近的消息查找关键信息
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (!msg.isUser) continue; // 只分析用户消息
      
      const text = msg.text.toLowerCase();
      
      // 提取网站类型
      if (!websiteTypeFound) {
        if (text.includes('博客') || text.includes('blog')) {
          websiteTypeFound = '博客';
        } else if (text.includes('电商') || text.includes('商店') || text.includes('shop')) {
          websiteTypeFound = '电商';
        } else if (text.includes('作品集') || text.includes('portfolio')) {
          websiteTypeFound = '作品集';
        } else if (text.includes('企业') || text.includes('公司') || text.includes('business')) {
          websiteTypeFound = '企业';
        } else if (text.includes('个人') || text.includes('personal')) {
          websiteTypeFound = '个人';
        }
      }
      
      // 提取标题和描述
      if (!extractedInfo.title) {
        const titleMatch = text.match(/标题[：:]\s*([^\n]+)/i) || 
                          text.match(/title[：:]\s*([^\n]+)/i);
        if (titleMatch) {
          extractedInfo.title = titleMatch[1].trim();
        }
      }
      
      if (!extractedInfo.description) {
        const descMatch = text.match(/描述[：:]\s*([^\n]+)/i) || 
                         text.match(/description[：:]\s*([^\n]+)/i);
        if (descMatch) {
          extractedInfo.description = descMatch[1].trim();
        }
      }
      
      // 提取颜色主题
      if (text.includes('深色') || text.includes('dark')) {
        extractedInfo.theme = 'dark';
      } else if (text.includes('浅色') || text.includes('light')) {
        extractedInfo.theme = 'light';
      }
      
      // 提取主色调
      const colorMatch = text.match(/颜色[：:]\s*([^\n]+)/i) || 
                        text.match(/color[：:]\s*([^\n]+)/i);
      if (colorMatch) {
        const colorText = colorMatch[1].toLowerCase();
        if (colorText.includes('蓝')) extractedInfo.primaryColor = '#3498db';
        else if (colorText.includes('红')) extractedInfo.primaryColor = '#e74c3c';
        else if (colorText.includes('绿')) extractedInfo.primaryColor = '#2ecc71';
        else if (colorText.includes('紫')) extractedInfo.primaryColor = '#9b59b6';
        else if (colorText.includes('橙')) extractedInfo.primaryColor = '#e67e22';
      }
      
      // 提取功能需求
      if (text.includes('联系表单') || text.includes('contact form')) {
        extractedInfo.features.contactForm = true;
      }
      if (text.includes('图库') || text.includes('gallery')) {
        extractedInfo.features.gallery = true;
      }
      if (text.includes('社交媒体') || text.includes('social media')) {
        extractedInfo.features.socialMedia = true;
      }
    }
    
    // 更新状态
    if (websiteTypeFound && websiteTypeFound !== websiteType) {
      setWebsiteType(websiteTypeFound);
    }
    
    // 更新网站信息
    setWebsiteInfo(extractedInfo);
    
    return { type: websiteTypeFound, info: extractedInfo };
  };
  
  // 处理发送消息 - 支持流式响应
  const handleSendMessage = async (customInput) => {
    const inputToSend = customInput || userInput;
    if (!inputToSend || (typeof inputToSend === 'string' && !inputToSend.trim())) return;
    
    const currentApiKey = getCurrentApiKey(DEFAULT_API_KEY, useDefaultKey, apiKey);
    if (!currentApiKey) {
      setSnackbarMessage('Please set a valid API key');
      setSnackbarOpen(true);
      return;
    }
    
    const newUserMessage = { isUser: true, text: inputToSend };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setUserInput('');
    setChatLoading(true);
    
    // 启用流式响应
    setIsStreaming(true);
    setStreamedHtml('');
    
    try {
      // 调用流式响应 API
      const finalHtml = await streamChatMessage(
        updatedMessages,
        inputToSend,
        currentApiKey,
        provider,
        (partialHtml) => {
          setStreamedHtml(partialHtml);
        }
      );
      
      // 更新生成的 HTML
      setGeneratedHtml(finalHtml);
      
      // 添加 AI 响应到聊天
      setChatMessages([
        ...updatedMessages,
        { 
          isUser: false, 
          text: "我已经生成了您的网站。您可以在右侧预览，或点击\"预览\"按钮查看完整效果。" 
        }
      ]);
      
      // 提取网站信息
      extractWebsiteInfoFromChat(updatedMessages);
      
      // 自动打开预览
      if (livePreviewEnabled) {
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      // 添加错误消息到聊天
      setChatMessages([
        ...updatedMessages,
        { 
          isUser: false, 
          text: `Error generating website: ${error.message}. Please check your API key or try again later.` 
        }
      ]);
      setSnackbarMessage(`Error generating website: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setChatLoading(false);
      setIsStreaming(false);
    }
  };
  
  // 保存当前项目
  const saveCurrentProject = (projectName) => {
    const newProject = {
      id: Date.now(),
      name: projectName || `Project ${savedProjects.length + 1}`,
      date: new Date().toISOString(),
      websiteType,
      websiteInfo,
      generatedHtml,
      chatMessages
    };
    
    const updatedProjects = [...savedProjects, newProject];
    setSavedProjects(updatedProjects);
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
    
    setCurrentProjectName(newProject.name);
    setSnackbarMessage(`Project "${newProject.name}" saved`);
    setSnackbarOpen(true);
  };
  
  // 加载项目
  const loadProject = (projectId) => {
    const project = savedProjects.find(p => p.id === projectId);
    if (project) {
      setWebsiteType(project.websiteType);
      setWebsiteInfo(project.websiteInfo);
      setGeneratedHtml(project.generatedHtml);
      setChatMessages(project.chatMessages);
      setCurrentProjectName(project.name);
      
      setSnackbarMessage(`Project "${project.name}" loaded`);
      setSnackbarOpen(true);
      
      if (project.generatedHtml && !previewOpen) {
        setPreviewOpen(true);
      }
    }
  };
  
  // 删除项目
  const deleteProject = (projectId) => {
    const projectToDelete = savedProjects.find(p => p.id === projectId);
    if (projectToDelete) {
      const updatedProjects = savedProjects.filter(p => p.id !== projectId);
      setSavedProjects(updatedProjects);
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      
      setSnackbarMessage(`Project "${projectToDelete.name}" deleted`);
      setSnackbarOpen(true);
    }
  };
  
  // 复制 HTML 代码
  const handleCopyHtml = () => {
    const htmlToCopy = isStreaming ? streamedHtml : generatedHtml;
    if (htmlToCopy) {
      navigator.clipboard.writeText(htmlToCopy)
        .then(() => {
          setSnackbarMessage('HTML code copied to clipboard');
          setSnackbarOpen(true);
        })
        .catch(err => {
          console.error('复制失败:', err);
          setSnackbarMessage('Copy failed, please copy manually');
          setSnackbarOpen(true);
        });
    }
  };
  
  // 下载 HTML 文件
  const handleDownloadHtml = () => {
    const htmlToDownload = isStreaming ? streamedHtml : generatedHtml;
    if (htmlToDownload) {
      const blob = new Blob([htmlToDownload], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${websiteInfo.title || 'website'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  // 处理预览对话框关闭
  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };
  
  // 处理 API 密钥对话框
  const handleApiKeyDialogOpen = () => {
    setApiKeyDialogOpen(true);
  };
  
  const handleApiKeyDialogClose = () => {
    setApiKeyDialogOpen(false);
  };
  
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };
  
  const handleUseDefaultKeyChange = (event) => {
    setUseDefaultKey(event.target.checked);
  };
  
  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };
  
  // 在WebsiteBuilderProvider组件中
  const handleSaveApiKey = () => {
    const keyToSave = useDefaultKey ? DEFAULT_API_KEY : apiKey.trim();
    if (keyToSave) {
      const success = saveApiKey(keyToSave);
      if (success) {
        setSnackbarMessage('API key saved successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to save API key');
        setSnackbarOpen(true);
      }
    }
  };
  
  // 处理项目对话框
  const handleProjectDialogOpen = () => {
    setProjectDialogOpen(true);
  };
  
  const handleProjectDialogClose = () => {
    setProjectDialogOpen(false);
  };
  
  // 处理 Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // 切换实时预览
  const toggleLivePreview = () => {
    setLivePreviewEnabled(!livePreviewEnabled);
  };
  
  return (
    <WebsiteBuilderContext.Provider value={{
      // 网站信息
      websiteType,
      setWebsiteType,
      websiteInfo,
      setWebsiteInfo,
      
      // 聊天相关
      chatMessages,
      setChatMessages,
      userInput,
      setUserInput,
      isChatLoading,
      handleSendMessage,
      handleUseTemplate,
      chatEndRef,
      
      // 流式响应相关
      isStreaming,
      streamedHtml,
      generatedHtml,
      
      // 预览相关
      previewOpen,
      setPreviewOpen,
      handlePreviewClose,
      handleCopyHtml,
      handleDownloadHtml,
      
      // 项目管理相关
      savedProjects,
      currentProjectName,
      saveCurrentProject,
      loadProject,
      deleteProject,
      projectDialogOpen,
      handleProjectDialogOpen,
      handleProjectDialogClose,
      
      // API 相关
      provider,
      apiKey,
      useDefaultKey,
      setUseDefaultKey,
      apiKeyDialogOpen,
      setApiKeyDialogOpen,
      handleApiKeyDialogOpen,
      handleApiKeyDialogClose,
      handleApiKeyChange,
      handleUseDefaultKeyChange,
      handleProviderChange,
      handleSaveApiKey,
      
      // UI 相关
      snackbarOpen,
      snackbarMessage,
      handleSnackbarClose,
      livePreviewEnabled,
      toggleLivePreview
    }}>
      {children}
    </WebsiteBuilderContext.Provider>
  );
};