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
    
    // Calculate difference in milliseconds
    const diffMs = Math.abs(end - start);
    
    // Calculate difference in days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Calculate difference in weeks
    const diffWeeks = Math.floor(diffDays / 7);
    
    // Calculate difference in months (approximate)
    const diffMonths = Math.floor(diffDays / 30.44);
    
    // Calculate difference in years (approximate)
    const diffYears = Math.floor(diffDays / 365.25);
    
    // Calculate difference in hours
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    // Calculate difference in minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    // Calculate difference in seconds
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
    showSnackbar('Copied to clipboard', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Date Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate the difference between two dates, or add/subtract time from a date.
      </Typography>

      {/* Ad above the tool */}
      <AdBanner slot="9900112233" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ mb: 3 }}
          >
            <Tab label="Date Difference" />
            <Tab label="Date Addition/Subtraction" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* Replace MUI DatePicker with standard date input */}
                <TextField
                  fullWidth
                  label="Start Date"
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
                  label="End Date"
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
                  Calculate Date Difference
                </Button>
              </Grid>
              
              {dateResult && (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">Calculation Result</Typography>
                      <IconButton 
                        onClick={() => copyToClipboard(`${dateResult.days} days, ${dateResult.hours} hours, ${dateResult.minutes} minutes`)}
                        color="primary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Years:</Typography>
                        <Typography variant="h6">{dateResult.years}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Months:</Typography>
                        <Typography variant="h6">{dateResult.months}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Weeks:</Typography>
                        <Typography variant="h6">{dateResult.weeks}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Days:</Typography>
                        <Typography variant="h6">{dateResult.days}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Hours:</Typography>
                        <Typography variant="h6">{dateResult.hours}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">Minutes:</Typography>
                        <Typography variant="h6">{dateResult.minutes}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Seconds:</Typography>
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
                  label="Select Date"
                  type="date"
                  value={formatDateForInput(addDate)}
                  onChange={(e) => setAddDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  InputProps={{ inputProps: { min: -1000, max: 1000 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={addUnit}
                    label="Unit"
                    onChange={(e) => setAddUnit(e.target.value)}
                  >
                    <MenuItem value="days">Days</MenuItem>
                    <MenuItem value="weeks">Weeks</MenuItem>
                    <MenuItem value="months">Months</MenuItem>
                    <MenuItem value="years">Years</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="seconds">Seconds</MenuItem>
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
                  Calculate Result Date
                </Button>
              </Grid>
              
              {addResult && (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">Calculation Result</Typography>
                      <IconButton 
                        onClick={() => copyToClipboard(addResult.toLocaleString('en-US'))}
                        color="primary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="h6">
                      {addResult.toLocaleString('en-US', {
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

      {/* Ad below the tool */}
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