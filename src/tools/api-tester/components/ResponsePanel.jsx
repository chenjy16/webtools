import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatJson } from '../utils/apiUtils';
import { js as beautifyJs, css as beautifyCss, html as beautifyHtml } from 'js-beautify';

const ResponsePanel = ({ response, responseTime, onCopyToClipboard }) => {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // 根据content-type格式化响应内容
  const formatResponseBody = (body, headers) => {
    // 检查content-type响应头
    const contentType = headers['content-type'] || '';
    
    // 如果是JSON类型，格式化显示
    if (contentType.includes('application/json')) {
      if (typeof body === 'object') {
        return formatJson(body);
      } else {
        try {
          // 尝试解析字符串为JSON并格式化
          const jsonObj = JSON.parse(body);
          return formatJson(jsonObj);
        } catch (e) {
          // 如果解析失败，返回原始内容
          return body;
        }
      }
    }
    
    // 处理XML格式
    if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
      try {
        // 使用简单的缩进方法格式化XML
        return formatXml(body);
      } catch (e) {
        return body;
      }
    }
    
    // 处理HTML格式
    if (contentType.includes('text/html')) {
      try {
        // 使用js-beautify的html格式化器
        return beautifyHtml(body, {
          indent_size: 2,
          indent_char: ' ',
          max_preserve_newlines: 1
        });
      } catch (e) {
        return body;
      }
    }
    
    // 处理CSS格式
    if (contentType.includes('text/css')) {
      try {
        // 使用js-beautify的css格式化器
        return beautifyCss(body, {
          indent_size: 2,
          indent_char: ' '
        });
      } catch (e) {
        return body;
      }
    }
    
    // 处理JavaScript格式
    if (contentType.includes('application/javascript') || contentType.includes('text/javascript')) {
      try {
        // 使用js-beautify的js格式化器
        return beautifyJs(body, {
          indent_size: 2,
          indent_char: ' '
        });
      } catch (e) {
        return body;
      }
    }
    
    // 其他类型直接返回
    return body;
  };
  
  // 简单的XML格式化函数
  const formatXml = (xml) => {
    if (!xml) return xml;
    
    // 替换多余的空白
    let formatted = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
    let indent = '';
    const tab = '  '; // 两个空格的缩进
    
    // 添加适当的缩进
    formatted = formatted.split('\n').map(node => {
      if (node.match(/.+<\/\w[^>]*>$/)) {
        // 当前行包含开始和结束标签
        return indent + node;
      } else if (node.match(/^<\/\w/)) {
        // 当前行是结束标签
        indent = indent.substring(tab.length);
        return indent + node;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        // 当前行是开始标签
        const result = indent + node;
        indent += tab;
        return result;
      } else {
        // 其他情况
        return indent + node;
      }
    }).join('\n');
    
    return formatted;
  };

  if (!response) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Response Result
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 2 }}>
            Status: <span style={{ 
              color: response.status < 300 ? 'green' : response.status < 400 ? 'orange' : 'red',
              fontWeight: 'bold'
            }}>
              {response.status} {response.statusText}
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary" component="span">
            Time: <span style={{ fontWeight: 'bold' }}>{responseTime}ms</span>
          </Typography>
        </Box>
      </Box>

      <Accordion 
        expanded={expanded === 'panel1'} 
        onChange={handleChange('panel1')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Response Body</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              size="small" 
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => onCopyToClipboard(
                typeof response.body === 'object' 
                  ? JSON.stringify(response.body, null, 2) 
                  : response.body
              )}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <Box 
              component="pre" 
              sx={{ 
                mt: 1, 
                p: 2, 
                borderRadius: 1, 
                bgcolor: '#f5f5f5', 
                overflow: 'auto',
                maxHeight: '400px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            >
              {formatResponseBody(response.body, response.headers)}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'panel2'} 
        onChange={handleChange('panel2')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Response Headers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              size="small" 
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => onCopyToClipboard(JSON.stringify(response.headers, null, 2))}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <Box 
              component="pre" 
              sx={{ 
                mt: 1, 
                p: 2, 
                borderRadius: 1, 
                bgcolor: '#f5f5f5', 
                overflow: 'auto',
                maxHeight: '300px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            >
              {formatJson(response.headers)}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ResponsePanel;