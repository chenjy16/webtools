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
  IconButton,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AdBanner from '../../components/AdBanner';

export default function RegexTester() {
  const [regexPattern, setRegexPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [highlightedText, setHighlightedText] = useState('');

  // 常用正则表达式示例
  const regexExamples = [
    { name: '电子邮件', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: '手机号码', pattern: '1[3-9]\\d{9}' },
    { name: 'URL', pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)' },
    { name: 'IP地址', pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' },
    { name: '日期(YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' }
  ];

  // 当正则表达式或测试字符串变化时，执行匹配
  useEffect(() => {
    testRegex();
  }, [regexPattern, testString, flags]);

  const handleFlagChange = (flag) => {
    setFlags({
      ...flags,
      [flag]: !flags[flag]
    });
  };

  const testRegex = () => {
    setMatches([]);
    setError('');
    setHighlightedText('');

    if (!regexPattern || !testString) return;

    try {
      // 构建标志字符串
      let flagsStr = '';
      if (flags.global) flagsStr += 'g';
      if (flags.ignoreCase) flagsStr += 'i';
      if (flags.multiline) flagsStr += 'm';
      if (flags.dotAll) flagsStr += 's';
      if (flags.unicode) flagsStr += 'u';
      if (flags.sticky) flagsStr += 'y';

      // 创建正则表达式对象
      const regex = new RegExp(regexPattern, flagsStr);
      
      // 执行匹配
      const matchResults = [];
      let match;
      
      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          matchResults.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchResults.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
        }
      }
      
      setMatches(matchResults);
      
      // 生成高亮文本
      generateHighlightedText(testString, matchResults);
      
    } catch (err) {
      setError(`正则表达式错误: ${err.message}`);
    }
  };

  const generateHighlightedText = (text, matchResults) => {
    if (matchResults.length === 0) {
      setHighlightedText(text);
      return;
    }
    
    // 按照匹配位置排序
    const sortedMatches = [...matchResults].sort((a, b) => a.index - b.index);
    
    let result = '';
    let lastIndex = 0;
    
    sortedMatches.forEach((match) => {
      // 添加匹配前的文本
      result += text.substring(lastIndex, match.index);
      
      // 添加带高亮的匹配文本
      result += `<mark style="background-color: #ffeb3b; padding: 0;">${text.substr(match.index, match.length)}</mark>`;
      
      lastIndex = match.index + match.length;
    });
    
    // 添加最后一个匹配后的文本
    result += text.substring(lastIndex);
    
    setHighlightedText(result);
  };

  const applyExample = (pattern) => {
    setRegexPattern(pattern);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('已复制到剪贴板', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        正则表达式测试器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        测试和验证正则表达式，查看匹配结果和捕获组。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="6677889900" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>正则表达式</Typography>
                <Tooltip title="输入正则表达式，不需要包含斜杠和标志">
                  <HelpOutlineIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                placeholder="例如: [a-z]+\d+"
                error={!!error}
                helperText={error}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>标志</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={<Checkbox checked={flags.global} onChange={() => handleFlagChange('global')} />}
                  label={
                    <Tooltip title="全局匹配 - 查找所有匹配项">
                      <Typography>g (全局)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.ignoreCase} onChange={() => handleFlagChange('ignoreCase')} />}
                  label={
                    <Tooltip title="忽略大小写">
                      <Typography>i (忽略大小写)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.multiline} onChange={() => handleFlagChange('multiline')} />}
                  label={
                    <Tooltip title="多行模式 - ^ 和 $ 匹配每一行的开始和结束">
                      <Typography>m (多行)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.dotAll} onChange={() => handleFlagChange('dotAll')} />}
                  label={
                    <Tooltip title="点号匹配所有字符，包括换行符">
                      <Typography>s (点匹配所有)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.unicode} onChange={() => handleFlagChange('unicode')} />}
                  label={
                    <Tooltip title="启用Unicode匹配">
                      <Typography>u (Unicode)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.sticky} onChange={() => handleFlagChange('sticky')} />}
                  label={
                    <Tooltip title="粘性匹配 - 只从正则表达式的lastIndex位置开始匹配">
                      <Typography>y (粘性)</Typography>
                    </Tooltip>
                  }
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>测试文本</Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="输入要测试的文本..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>常用正则表达式</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {regexExamples.map((example, index) => (
                  <Chip
                    key={index}
                    label={example.name}
                    onClick={() => applyExample(example.pattern)}
                    color="primary"
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Grid>
            
            {highlightedText && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">匹配结果</Typography>
                    <IconButton 
                      onClick={() => copyToClipboard(matches.map(m => m.value).join('\n'))}
                      color="primary"
                      disabled={matches.length === 0}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    找到 {matches.length} 个匹配项
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'white' }}>
                    <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
                  </Paper>
                  
                  {matches.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        匹配详情
                      </Typography>
                      <List dense>
                        {matches.map((match, index) => (
                          <ListItem key={index} divider={index < matches.length - 1}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">
                                    匹配 #{index + 1}: <strong>{match.value}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    位置: {match.index}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                match.groups.length > 0 ? (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      捕获组:
                                    </Typography>
                                    {match.groups.map((group, groupIndex) => (
                                      <Typography key={groupIndex} variant="body2">
                                        组 {groupIndex + 1}: {group || '(空)'}
                                      </Typography>
                                    ))}
                                  </Box>
                                ) : null
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="6677889900" />

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