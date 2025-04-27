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
// Remove MUI date picker imports
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import zhLocale from 'date-fns/locale/zh-CN';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AdBanner from '../../components/AdBanner';

export default function DateCalculator() {
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateResult, setDateResult] = useState(null);
  const [addDate, setAddDate] = useState(new Date());
  const [addValue, setAddValue] = useState(1);
  const [addUnit, setAddUnit] = useState('days');
  const [addResult, setAddResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Helper function to format date to YYYY-MM-DD for input fields
  const formatDateForInput = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 计算毫秒差值
    const diffMs = Math.abs(end - start);
    
    // 计算天数差
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // 计算周数
    const diffWeeks = Math.floor(diffDays / 7);
    
    // 计算月数（近似值）
    const diffMonths = Math.floor(diffDays / 30.44);
    
    // 计算年数（近似值）
    const diffYears = Math.floor(diffDays / 365.25);
    
    // 计算小时数
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    // 计算分钟数
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    // 计算秒数
    const diffSeconds = Math.floor(diffMs / 1000);

    setDateResult({
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds
    });
  };

  const calculateAddDate = () => {
    if (!addDate || !addValue) return;
    
    const date = new Date(addDate);
    
    switch (addUnit) {
      case 'days':
        date.setDate(date.getDate() + parseInt(addValue));
        break;
      case 'weeks':
        date.setDate(date.getDate() + (parseInt(addValue) * 7));
        break;
      case 'months':
        date.setMonth(date.getMonth() + parseInt(addValue));
        break;
      case 'years':
        date.setFullYear(date.getFullYear() + parseInt(addValue));
        break;
      case 'hours':
        date.setHours(date.getHours() + parseInt(addValue));
        break;
      case 'minutes':
        date.setMinutes(date.getMinutes() + parseInt(addValue));
        break;
      case 'seconds':
        date.setSeconds(date.getSeconds() + parseInt(addValue));
        break;
      default:
        break;
    }
    
    setAddResult(date);
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
        日期计算器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        计算两个日期之间的差异，或者在日期上添加/减去时间。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="9900112233" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
          >
            <Tab label="日期差异" />
            <Tab label="日期加减" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* Replace MUI DatePicker with standard date input */}
                <TextField
                  fullWidth
                  label="开始日期"
                  type="date"
                  value={formatDateForInput(startDate)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {/* Replace MUI DatePicker with standard date input */}
                <TextField
                  fullWidth
                  label="结束日期"
                  type="date"
                  value={formatDateForInput(endDate)}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={calculateDateDifference}
                  fullWidth
                >
                  计算日期差异
                </Button>
              </Grid>
              
              {dateResult && (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">计算结果</Typography>
                      <IconButton 
                        onClick={() => copyToClipboard(`${dateResult.days} 天, ${dateResult.hours} 小时, ${dateResult.minutes} 分钟`)}
                        color="primary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">年:</Typography>
                        <Typography variant="h6">{dateResult.years}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">月:</Typography>
                        <Typography variant="h6">{dateResult.months}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">周:</Typography>
                        <Typography variant="h6">{dateResult.weeks}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">天:</Typography>
                        <Typography variant="h6">{dateResult.days}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">小时:</Typography>
                        <Typography variant="h6">{dateResult.hours}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">分钟:</Typography>
                        <Typography variant="h6">{dateResult.minutes}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">秒:</Typography>
                        <Typography variant="h6">{dateResult.seconds}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* Replace MUI DatePicker with standard date input */}
                <TextField
                  fullWidth
                  label="选择日期"
                  type="date"
                  value={formatDateForInput(addDate)}
                  onChange={(e) => setAddDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="数值"
                  type="number"
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  InputProps={{ inputProps: { min: -1000, max: 1000 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>单位</InputLabel>
                  <Select
                    value={addUnit}
                    label="单位"
                    onChange={(e) => setAddUnit(e.target.value)}
                  >
                    <MenuItem value="days">天</MenuItem>
                    <MenuItem value="weeks">周</MenuItem>
                    <MenuItem value="months">月</MenuItem>
                    <MenuItem value="years">年</MenuItem>
                    <MenuItem value="hours">小时</MenuItem>
                    <MenuItem value="minutes">分钟</MenuItem>
                    <MenuItem value="seconds">秒</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={calculateAddDate}
                  fullWidth
                >
                  计算结果日期
                </Button>
              </Grid>
              
              {addResult && (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">计算结果</Typography>
                      <IconButton 
                        onClick={() => copyToClipboard(addResult.toLocaleString('zh-CN'))}
                        color="primary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="h6">
                      {addResult.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        weekday: 'long'
                      })}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="9900112233" />

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