import { useState } from 'react';
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
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AdBanner from '../../components/AdBanner';
import { js as beautifyJs, css as beautifyCss, html as beautifyHtml } from 'js-beautify';
import CleanCSS from 'clean-css';
// 移除 html-minifier 导入
// import { minify as minifyHtml } from 'html-minifier';
// 导入自定义的 HTML 压缩函数
import { minifyHtml } from '../../utils/simple-html-minifier.js';
import { minify as minifyJs } from 'terser';

export default function CodeFormatter() {
  const [activeTab, setActiveTab] = useState(0);
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [formatType, setFormatType] = useState('js');
  const [operation, setOperation] = useState('beautify');
  const [options, setOptions] = useState({
    js: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    },
    css: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      indent_inner_html: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_empty_lines: false
    },
    html: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      indent_inner_html: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_empty_lines: false,
      unformatted: ['a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u', 'strike', 'big', 'small', 'pre'],
      content_unformatted: ['pre', 'code'],
      extra_liners: ['head', 'body', '/html']
    },
    minifyHtml: {
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeAttributeQuotes: false,
      useShortDoctype: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    },
    minifyJs: {
      compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        keep_classnames: false,
        keep_fargs: true,
        keep_fnames: false,
        keep_infinity: false
      },
      mangle: true,
      output: {
        comments: false
      }
    },
    minifyCss: {
      level: 2
    }
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setOperation(newValue === 0 ? 'beautify' : 'minify');
  };

  const handleFormatTypeChange = (event) => {
    setFormatType(event.target.value);
    setOutputCode('');
  };

  const handleInputChange = (event) => {
    setInputCode(event.target.value);
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('已复制到剪贴板', 'success');
  };

  // 将 insertExample 函数移到组件内部
  const insertExample = () => {
    let example = '';
    
    if (formatType === 'js') {
      example = `function greeting(name) {\n  console.log("Hello, " + name + "!");\n  return { message: "Hello, " + name + "!" };\n}\n\ngreeting("World");`;
    } else if (formatType === 'css') {
      example = `body{margin:0;padding:0;font-family:Arial,sans-serif;}.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;}.header{background-color:#f0f0f0;padding:10px;border-bottom:1px solid #ddd;}`;
    } else if (formatType === 'html') {
      example = `<!DOCTYPE html><html><head><title>Example</title><style>body{margin:0;padding:0;}</style></head><body><div class="container"><h1>Hello World</h1><p>This is an example.</p></div><script>console.log("Hello!");</script></body></html>`;
    }
    
    setInputCode(example);
  };

  // 修复 handleProcess 函数中的 JS 压缩部分
  // 修改 handleProcess 函数，确保 if-else 结构正确
  const handleProcess = async () => {
    if (!inputCode.trim()) {
      showSnackbar('请输入代码', 'error');
      return;
    }
  
    try {
      if (operation === 'beautify') {
        // 美化代码
        let beautified = '';
        
        if (formatType === 'js') {
          try {
            // 尝试解析 JS 以验证语法
            // eslint-disable-next-line no-new-func
            new Function(inputCode);
            beautified = beautifyJs(inputCode, options.js);
          } catch (jsError) {
            console.error('JavaScript 语法错误:', jsError);
            // 即使有语法错误也尝试美化
            beautified = beautifyJs(inputCode, options.js);
          }
        } else if (formatType === 'css') {
          beautified = beautifyCss(inputCode, options.css);
        } else if (formatType === 'html') {
          beautified = beautifyHtml(inputCode, options.html);
        }
        
        setOutputCode(beautified);
        showSnackbar('代码美化成功', 'success');
      } else {
        // 压缩代码
        if (formatType === 'js') {
          try {
            // 确保 terser 选项正确，避免使用可能依赖 process 的选项
            const minifyOptions = {
              compress: {
                dead_code: true,
                drop_debugger: true,
                keep_fargs: true
              },
              mangle: true,
              output: {
                comments: false
              }
            };
            
            const result = await minifyJs(inputCode, minifyOptions);
            if (result && result.code) {
              setOutputCode(result.code);
              showSnackbar('代码压缩成功', 'success');
            } else {
              throw new Error('JavaScript 压缩失败');
            }
          } catch (jsError) {
            console.error('JavaScript 压缩错误:', jsError);
            showSnackbar(`JavaScript 压缩失败: ${jsError.message}`, 'error');
          }
        } else if (formatType === 'css') {
          try {
            // 使用更简单的 CleanCSS 配置
            const minifier = new CleanCSS({ level: 1 });
            const result = minifier.minify(inputCode);
            
            if (result && result.styles !== undefined) {
              setOutputCode(result.styles);
              showSnackbar('代码压缩成功', 'success');
            } else {
              throw new Error('CSS 压缩失败');
            }
          } catch (cssError) {
            console.error('CSS 压缩错误:', cssError);
            showSnackbar(`CSS 压缩失败: ${cssError.message}`, 'error');
          }
        } else if (formatType === 'html') {
          try {
            // 使用自定义的简单 HTML 压缩函数，不需要传递选项
            const result = minifyHtml(inputCode);
            setOutputCode(result);
            showSnackbar('代码压缩成功', 'success');
          } catch (htmlError) {
            console.error('HTML 压缩错误:', htmlError);
            showSnackbar(`HTML 压缩失败: ${htmlError.message}`, 'error');
          }
        }
      }
    } catch (error) {
      console.error('处理代码时出错:', error);
      showSnackbar(`处理失败: ${error.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        代码格式化工具
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        美化或压缩您的JavaScript、CSS和HTML代码。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="8899001122" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
          >
            <Tab label="代码美化" />
            <Tab label="代码压缩" />
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>代码类型</InputLabel>
                <Select
                  value={formatType}
                  label="代码类型"
                  onChange={handleFormatTypeChange}
                >
                  <MenuItem value="js">JavaScript</MenuItem>
                  <MenuItem value="css">CSS</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="输入代码"
                multiline
                rows={8}
                value={inputCode}
                onChange={handleInputChange}
                placeholder={`请在此输入您的${formatType.toUpperCase()}代码...`}
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleProcess}
                disabled={!inputCode.trim()}
              >
                {operation === 'beautify' ? '美化代码' : '压缩代码'}
              </Button>
              
              <Box>
                <Button 
                  variant="outlined"
                  color="info"
                  onClick={insertExample}
                  sx={{ mr: 1 }}
                >
                  插入示例
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={clearAll}
                  startIcon={<DeleteIcon />}
                >
                  清空
                </Button>
              </Box>
            </Grid>
            
            {outputCode && (
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    position: 'relative',
                    backgroundColor: '#f5f5f5',
                    fontFamily: 'monospace',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton 
                      onClick={() => copyToClipboard(outputCode)}
                      color="primary"
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-all',
                      mt: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  >
                    {outputCode}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="8899001122" />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
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