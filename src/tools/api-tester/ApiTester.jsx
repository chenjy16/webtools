import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fade
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

// 导入自定义组件
import RequestForm from './components/RequestForm';
import ResponsePanel from './components/ResponsePanel';
import FavoritesPanel from './components/FavoritesPanel';


// 导入工具函数和钩子
import { buildUrl, buildHeaders, formatJson } from './utils/apiUtils';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './utils/constants';



// 导入常量
import { HTTP_METHODS, API_EXAMPLES } from './utils/constants';

export default function ApiTester() {
  // 基本请求状态
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 请求参数状态
  const [activeTab, setActiveTab] = useState(0);
  const [params, setParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [bodyFormat, setBodyFormat] = useState('json'); // 默认为JSON格式
  
  // 响应状态
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  
  // 只保留收藏功能，移除历史记录
  // const [history, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, []);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  
  // 通知状态
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  

  
  // 处理标签页切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // 处理参数变更
  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
    
    // 如果最后一行有内容，添加新的空行
    if (index === params.length - 1 && (newParams[index].key || newParams[index].value)) {
      setParams([...newParams, { key: '', value: '' }]);
    }
  };
  
  // 处理头信息变更
  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
    
    // 如果最后一行有内容，添加新的空行
    if (index === headers.length - 1 && (newHeaders[index].key || newHeaders[index].value)) {
      setHeaders([...newHeaders, { key: '', value: '' }]);
    }
  };
  
  // 处理请求体变更
  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };
  
  // 处理请求体格式变更
  const handleBodyFormatChange = (newFormat) => {
    setBodyFormat(newFormat);
    
    // 当切换格式时，清空请求体
    if (newFormat !== bodyFormat) {
      setBody('');
    }
  };
  
  // 删除参数行
  const handleRemoveParam = (index) => {
    if (params.length > 1) {
      const newParams = [...params];
      newParams.splice(index, 1);
      setParams(newParams);
    }
  };
  
  // 删除头信息行
  const handleRemoveHeader = (index) => {
    if (headers.length > 1) {
      const newHeaders = [...headers];
      newHeaders.splice(index, 1);
      setHeaders(newHeaders);
    }
  };
  
  // 发送请求
  const sendRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    setResponseTime(null);
    
    const finalUrl = buildUrl(url, params);
    const headerObj = buildHeaders(headers);
    
    const requestOptions = {
      method,
      headers: headerObj,
    };
    
    // 添加请求体（如果不是GET或HEAD请求）
    if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
      try {
        // 根据不同的请求体格式处理
        switch (bodyFormat) {
          case 'json':
            // 尝试解析JSON
            JSON.parse(body);
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = body;
            break;
            
          case 'form':
            // x-www-form-urlencoded 格式
            requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            requestOptions.body = body;
            break;
            
          case 'formData':
            // multipart/form-data 格式
            // 注意：这里不设置 Content-Type，fetch API 会自动设置正确的 boundary
            const formData = new FormData();
            // 解析表单数据字符串并添加到 FormData 对象
            body.split('\n').forEach(line => {
              const [key, value] = line.split(':').map(part => part.trim());
              if (key && value) {
                formData.append(key, value);
              }
            });
            requestOptions.body = formData;
            break;
            
          case 'xml':
            // XML 格式
            requestOptions.headers['Content-Type'] = 'application/xml';
            requestOptions.body = body;
            break;
            
          case 'text':
            // 纯文本格式
            requestOptions.headers['Content-Type'] = 'text/plain';
            requestOptions.body = body;
            break;
            
          default:
            // 默认作为文本处理
            requestOptions.body = body;
        }
      } catch (e) {
        if (bodyFormat === 'json') {
          setError(`JSON parsing error: ${e.message}`);
          setLoading(false);
          return;
        }
        // 对于其他格式，继续处理
        requestOptions.body = body;
      }
    }
    
    const startTime = new Date().getTime();
    
    try {
      const response = await fetch(finalUrl, requestOptions);
      const endTime = new Date().getTime();
      setResponseTime(endTime - startTime);
      
      // 获取响应头
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      // 尝试解析响应体
      let responseBody;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }
      
      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers,
        body: responseBody,
        time: endTime - startTime
      };
      
      setResponse(responseData);
      
      
    } catch (err) {
      setError(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理保存到收藏夹
  const handleSaveToFavorites = () => {
    // 显示保存对话框或直接保存
    const requestName = prompt('Enter request name:');
    if (requestName) {
      const newFavorite = {
        id: Date.now().toString(),
        name: requestName,
        url,
        method,
        params: params.filter(p => p.key && p.value),
        headers: headers.filter(h => h.key && h.value),
        body,
        bodyFormat
      };
      
      setFavorites([...favorites, newFavorite]);
      showSnackbar('Request saved to favorites', 'success');
    }
  };

  // 显示通知
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // 从收藏夹加载
  const loadFromFavorites = (favorite) => {
    setUrl(favorite.url);
    setMethod(favorite.method);
    setParams([...favorite.params, { key: '', value: '' }]);
    setHeaders([...favorite.headers, { key: '', value: '' }]);
    setBody(favorite.body || '');
    showSnackbar('Favorite request loaded', 'info');
  };
  

  
  // 删除收藏
  const deleteFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
    showSnackbar('Favorite removed', 'info');
  };
  

  
  // 复制到剪贴板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };
  

  
  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        API Tester
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test your API endpoints, supporting various HTTP methods, custom headers and parameters, with favorites functionality.
      </Typography>
      
      <Grid container spacing={3}>
        {/* 左侧面板：只保留收藏 */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <FavoritesPanel 
                favorites={favorites} 
                onLoadFavorite={loadFromFavorites} 
                onDeleteFavorite={deleteFavorite} 
              />
            </CardContent>
          </Card>
          
    
        </Grid>
        
        {/* 右侧面板：请求和响应 */}
        <Grid item xs={12} md={9}>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <RequestForm 
                url={url}
                method={method}
                activeTab={activeTab}
                params={params}
                headers={headers}
                body={body}
                bodyFormat={bodyFormat}
                loading={loading}
                onUrlChange={(e) => setUrl(e.target.value)}
                onMethodChange={(e) => setMethod(e.target.value)}
                onTabChange={handleTabChange}
                onParamChange={handleParamChange}
                onHeaderChange={handleHeaderChange}
                onBodyChange={handleBodyChange}
                onBodyFormatChange={handleBodyFormatChange}
                onRemoveParam={handleRemoveParam}
                onRemoveHeader={handleRemoveHeader}
                onSendRequest={sendRequest}
                onSaveToFavorites={handleSaveToFavorites}
              />
            </CardContent>
          </Card>
          
          {/* 响应面板 */}
          {response && (
            <ResponsePanel 
              response={response} 
              responseTime={responseTime} 
              onCopyToClipboard={copyToClipboard} 
            />
          )}
          
          {/* 错误显示 */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Grid>
      </Grid>
      
      {/* 通知栏 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
     
    </Box>
  );
}

// 加载收藏的请求
const loadFavorite = (favorite) => {
  setUrl(favorite.url);
  setMethod(favorite.method);
  setParams(favorite.params || [{ key: '', value: '' }]);
  setHeaders(favorite.headers || [{ key: '', value: '' }]);
  setBody(favorite.body || '');
  setBodyFormat(favorite.bodyFormat || 'json');
};

// 保存请求到收藏夹
const saveToFavorites = () => {
  const favoriteItem = {
    id: Date.now(),
    name: url.split('/').pop() || 'API Request',
    url,
    method,
    params: params.filter(p => p.key && p.value),
    headers: headers.filter(h => h.key && h.value),
    body,
    timestamp: new Date().toISOString()
  };
  
  setFavorites([favoriteItem, ...favorites]);
  showSnackbar('Request saved to favorites', 'success');
};