import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function PublicHolidays() {
  const [year, setYear] = useState(dayjs().year());
  const [country, setCountry] = useState('CN');
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // 假期持续天数和日期范围的默认值映射
  const defaultHolidayDurations = {
    // 中国主要假期
    CN: {
      'New Year\'s Day': {
        duration: 3,
        dateRanges: {
          '2023': ['2022-12-31', '2023-01-01', '2023-01-02'],
          '2024': ['2023-12-30', '2023-12-31', '2024-01-01']
        }
      },
      'Chinese New Year': {
        duration: 7,
        dateRanges: {
          '2023': ['2023-01-21', '2023-01-22', '2023-01-23', '2023-01-24', '2023-01-25', '2023-01-26', '2023-01-27'],
          '2024': ['2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16', '2024-02-17']
        }
      },
      'Tomb-Sweeping Day': {
        duration: 3,
        dateRanges: {
          '2023': ['2023-04-05', '2023-04-06', '2023-04-07'],
          '2024': ['2024-04-04', '2024-04-05', '2024-04-06']
        }
      },
      'Labour Day': {
        duration: 5,
        dateRanges: {
          '2023': ['2023-04-29', '2023-04-30', '2023-05-01', '2023-05-02', '2023-05-03'],
          '2024': ['2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04', '2024-05-05']
        }
      },
      'Dragon Boat Festival': {
        duration: 3,
        dateRanges: {
          '2023': ['2023-06-22', '2023-06-23', '2023-06-24'],
          '2024': ['2024-06-08', '2024-06-09', '2024-06-10']
        }
      },
      'Mid-Autumn Festival': {
        duration: 3,
        dateRanges: {
          '2023': ['2023-09-29', '2023-09-30', '2023-10-01'],
          '2024': ['2024-09-15', '2024-09-16', '2024-09-17']
        }
      },
      'National Day': {
        duration: 7,
        dateRanges: {
          '2023': ['2023-10-01', '2023-10-02', '2023-10-03', '2023-10-04', '2023-10-05', '2023-10-06', '2023-10-07'],
          '2024': ['2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', '2024-10-05', '2024-10-06', '2024-10-07']
        }
      },
    },
    // 美国主要假期
    US: {
      'New Year\'s Day': { duration: 1 },
      'Independence Day': { duration: 1 },
      'Thanksgiving Day': { duration: 2 },
      'Christmas Day': { duration: 1 },
    },
    // 默认值
    default: 1
  };

  // Get country list
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
      if (!response.ok) {
        throw new Error('Unable to fetch country list');
      }
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to fetch country list, please try again later');
    }
  };

  // 获取假期的日期范围
  const getHolidayDateRange = (holiday, selectedYear) => {
    const countryData = defaultHolidayDurations[country];
    if (!countryData) return null;
    
    const holidayData = countryData[holiday.name];
    if (!holidayData || typeof holidayData === 'number') return null;
    
    const yearStr = selectedYear.toString();
    const dateRanges = holidayData.dateRanges?.[yearStr];
    
    if (!dateRanges) {
      // 如果没有特定年份的日期范围，则基于假期日期生成一个默认范围
      const holidayDate = new Date(holiday.date);
      const startDate = new Date(holidayDate);
      const endDate = new Date(holidayDate);
      endDate.setDate(endDate.getDate() + (holidayData.duration || 1) - 1);
      
      return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      };
    }
    
    return {
      start: dateRanges[0],
      end: dateRanges[dateRanges.length - 1],
      dates: dateRanges
    };
  };

  // Get holiday data
  const fetchHolidays = async () => {
    if (!country) {
      setError('Please select a country');
      return;
    }

    setLoading(true);
    setError('');
    setHolidays([]);

    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      
      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 为每个假期添加持续天数信息和日期范围
      const processedData = data.map(holiday => {
        const countryDurations = defaultHolidayDurations[country] || {};
        const holidayInfo = countryDurations[holiday.name];
        
        let duration = defaultHolidayDurations.default;
        if (holidayInfo) {
          duration = typeof holidayInfo === 'object' ? holidayInfo.duration : holidayInfo;
        }
        
        const dateRange = getHolidayDateRange(holiday, year);
        
        return {
          ...holiday,
          duration: duration,
          dateRange: dateRange
        };
      });
      
      setHolidays(processedData);
      
      if (processedData.length === 0) {
        setError(`No public holiday data found for ${getCountryName(country)} in ${year}`);
      }
    } catch (err) {
      console.error('Failed to fetch holiday data:', err);
      setError(`Failed to fetch holiday data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (newValue) => {
    setYear(newValue.year());
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const getCountryName = (countryCode) => {
    const found = countries.find(c => c.countryCode === countryCode);
    return found ? found.name : countryCode;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  // 获取日期的日号
  const getDayOfMonth = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  // 格式化日期范围
  const formatDateRange = (dateRange) => {
    if (!dateRange) return 'No data';
    
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    if (dateRange.start === dateRange.end) {
      return formatDate(dateRange.start);
    }
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
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

  const copyAllHolidays = () => {
    if (holidays.length === 0) return;
    
    const countryName = getCountryName(country);
    let text = `Public Holidays for ${countryName} in ${year}:\n`;
    text += `Total: ${holidays.length} holidays, ${getTotalDaysOff()} days off\n\n`;
    
    holidays.forEach(holiday => {
      const dayOfMonth = getDayOfMonth(holiday.date);
      text += `${formatDate(holiday.date)} - ${holiday.localName}\n`;
      text += `Duration: ${holiday.duration} day(s)\n`;
      
      if (holiday.dateRange) {
        text += `Holiday Period: ${formatDateRange(holiday.dateRange)}\n`;
      }
      
      if (holiday.localName !== holiday.name) {
        text += `(${holiday.name})\n`;
      }
      text += `\n`;
    });
    
    copyToClipboard(text);
  };

  // 计算总放假天数
  const getTotalDaysOff = () => {
    return holidays.reduce((sum, holiday) => sum + holiday.duration, 0);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ color: '#1976d2', fontWeight: 'bold' }}
      >
        Public Holidays Worldwide
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        align="center"
      >
        Query public holiday information for countries around the world. Supports holiday data for multiple countries and regions.
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="country-select-label">Country/Region</InputLabel>
                <Select
                  labelId="country-select-label"
                  value={country}
                  label="Country/Region"
                  onChange={handleCountryChange}
                  disabled={loading || countries.length === 0}
                >
                  {countries.map((c) => (
                    <MenuItem key={c.countryCode} value={c.countryCode}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Year"
                  views={['year']}
                  value={dayjs().year(year)}
                  onChange={handleYearChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={loading}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={fetchHolidays}
                disabled={loading || !country}
                startIcon={loading ? <CircularProgress size={24} /> : <SearchIcon />}
                sx={{ height: '56px' }}
              >
                {loading ? 'Searching...' : 'Search Holidays'}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {holidays.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">
                    Public Holidays for {getCountryName(country)} in {year}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total: {holidays.length} holidays, {getTotalDaysOff()} days off
                    {' ('}
                    {holidays.filter(h => h.global).length} National,
                    {' '}
                    {holidays.filter(h => !h.global).length} Regional
                    {')'}
                  </Typography>
                </Box>
                <Tooltip title="Copy all holiday information">
                  <IconButton onClick={copyAllHolidays} color="primary">
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Day</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Holiday Period</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holidays.map((holiday) => {
                      const date = new Date(holiday.date);
                      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const dayOfMonth = date.getDate();
                      return (
                        <TableRow key={holiday.date} hover>
                          <TableCell>
                            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </TableCell>
                          <TableCell>{weekday}</TableCell>
                          <TableCell>
                            <Tooltip title={holiday.name} arrow placement="top">
                              <Typography>{holiday.localName}</Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {holiday.global ? 'National' : 'Regional'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${holiday.duration} day(s)`} 
                              color={holiday.duration > 1 ? "primary" : "default"} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {holiday.dateRange ? (
                              <Tooltip 
                                title={holiday.dateRange.dates ? 
                                  `Specific dates: ${holiday.dateRange.dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}` : 
                                  ''
                                } 
                                arrow 
                                placement="top"
                              >
                                <Typography variant="body2">
                                  {formatDateRange(holiday.dateRange)}
                                </Typography>
                              </Tooltip>
                            ) : 'No data'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          About Public Holiday Data
        </Typography>
        <Typography variant="body2" paragraph>
          • Data sourced from Nager.Date API, covering over 100 countries and regions worldwide
        </Typography>
        <Typography variant="body2" paragraph>
          • Holiday information includes date, name, and whether it's a national holiday
        </Typography>
        <Typography variant="body2" paragraph>
          • Duration information and holiday periods are estimated based on common practice and may vary by year or region
        </Typography>
        <Typography variant="body2" paragraph>
          • For China and some other countries, holiday periods are based on official announcements
        </Typography>
        <Typography variant="body2" paragraph>
          • Some countries may display English names, depending on the data provided by the API
        </Typography>
        <Typography variant="body2" paragraph>
          • Data updates may be delayed, and the latest holiday changes may not be reflected immediately
        </Typography>
      </Box>
    </Box>
  );
}