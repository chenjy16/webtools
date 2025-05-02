import { useState, useEffect, useCallback } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Autocomplete,
  Tabs,
  Tab,
  CardMedia,
  Link,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';


export default function CountryInfo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch all countries for Autocomplete on mount
  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchAllCountries = async () => {
    setLoadingList(true);
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
      if (!response.ok) throw new Error('Failed to fetch country list');
      const data = await response.json();
      const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      setAllCountries(sortedCountries.map(c => ({ label: c.name.common, code: c.cca2 })));
    } catch (err) {
      console.error('Failed to fetch country list:', err);
    } finally {
      setLoadingList(false);
    }
  };

  // Search country by name or code
  const searchCountry = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setError('Please enter a country name or code.');
      return;
    }
    setLoading(true);
    setError('');
    setCountryData(null);
    try {
      let response;
      if (query.length === 2 || query.length === 3) {
        response = await fetch(`https://restcountries.com/v3.1/alpha/${query}`);
        if (!response.ok) {
          response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
          if (!response.ok) {
            response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
          }
        }
      } else {
        response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`);
        if (!response.ok) {
          response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
        }
      }
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Country '${query}' not found.`);
        } else {
          throw new Error(`API error: ${response.statusText} (Status: ${response.status})`);
        }
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setCountryData(data[0]);
      } else if (!Array.isArray(data)) {
        setCountryData(data);
      } else {
        throw new Error(`No valid country data found for '${query}'.`);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError(`Search failed: ${err.message}`);
      setCountryData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchCountry(searchQuery);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text)
        .then(() => showSnackbar('Copied to clipboard', 'success'))
        .catch(err => {
          console.error('Failed to copy:', err);
          showSnackbar('Failed to copy', 'error');
        });
    } else {
      showSnackbar('Clipboard not available or no text to copy.', 'warning');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Formatting helpers
  const formatPopulation = (population) => {
    if (population === undefined || population === null) return 'N/A';
    return new Intl.NumberFormat('en-US').format(population);
  };

  const formatArea = (area) => {
    if (area === undefined || area === null) return 'N/A';
    return `${new Intl.NumberFormat('en-US').format(area)} km²`;
  };

  const getLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const getCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`)
      .join(', ');
  };

  const getCallingCode = (idd) => {
    if (!idd || !idd.root) return 'N/A';
    return `${idd.root}${idd.suffixes && idd.suffixes.length > 0 ? idd.suffixes[0] : ''}`;
  };

  const getDrivingSide = (car) => {
    if (!car || !car.side) return 'N/A';
    return car.side.charAt(0).toUpperCase() + car.side.slice(1);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ color: '#1976d2', fontWeight: 'bold' }}
      >
        Country Information Finder
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        align="center"
      >
        Look up detailed information about countries worldwide, including location, population, languages, currency, and more.
      </Typography>



      {/* Main Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Autocomplete
                  freeSolo
                  options={allCountries}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Enter Country Name or Code"
                      variant="outlined"
                      placeholder="e.g., China, United States, US, DE"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        endAdornment: (
                          <>
                            {loadingList ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  )}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    if (!event || event.type !== 'change') {
                      setSearchQuery(newInputValue || '');
                    }
                  }}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setSearchQuery(newValue);
                    } else if (newValue && newValue.label) {
                      setSearchQuery(newValue.label);
                      searchCountry(newValue.label);
                    } else {
                      setSearchQuery('');
                    }
                  }}
                  loading={loadingList}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  sx={{
                    height: '56px',
                    borderRadius: 1,
                    '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
                  }}
                  startIcon={!loading ? <SearchIcon /> : null}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {loading && !countryData && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Country Data Display */}
          {countryData && (
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                {/* Flag and Basic Info */}
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      boxShadow: 3,
                      borderRadius: 2,
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={countryData.flags?.svg || countryData.flags?.png}
                      alt={`${countryData.name.common} Flag`}
                      sx={{
                        objectFit: 'contain',
                        bgcolor: 'grey.100',
                        p: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-flag.png'; }}
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ color: '#1976d2', fontWeight: 'bold' }}
                      >
                        {countryData.name.common}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {countryData.name.official}
                      </Typography>
                      {countryData.capital && (
                        <Typography variant="body2">
                          Capital: {countryData.capital[0]}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Detailed Info Tabs */}
                <Grid item xs={12} md={8}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="General Info" sx={{ fontWeight: 'bold' }} />
                    <Tab label="Geography" sx={{ fontWeight: 'bold' }} />
                    <Tab label="Culture" sx={{ fontWeight: 'bold' }} />
                  </Tabs>

                  <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{ boxShadow: 2, borderRadius: 2 }}
                  >
                    <Table size="small">
                      <TableBody>
                        {activeTab === 0 && (
                          <>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '35%' }}>Country Codes</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2">{countryData.cca2} / {countryData.cca3}</Typography>
                                  <Tooltip title="Copy Codes">
                                    <IconButton size="small" onClick={() => copyToClipboard(`${countryData.cca2}, ${countryData.cca3}`)}>
                                      <ContentCopyIcon fontSize="inherit" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Region</TableCell>
                              <TableCell>{countryData.region}{countryData.subregion ? `, ${countryData.subregion}` : ''}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Capital City</TableCell>
                              <TableCell>{countryData.capital ? countryData.capital.join(', ') : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Independent</TableCell>
                              <TableCell>{countryData.independent ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>UN Member</TableCell>
                              <TableCell>{countryData.unMember ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Top-Level Domain</TableCell>
                              <TableCell>{countryData.tld ? countryData.tld.join(', ') : 'N/A'}</TableCell>
                            </TableRow>
                          </>
                        )}

                        {activeTab === 1 && (
                          <>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '35%' }}>Population</TableCell>
                              <TableCell>{formatPopulation(countryData.population)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Area</TableCell>
                              <TableCell>{formatArea(countryData.area)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Coordinates (Lat, Lng)</TableCell>
                              <TableCell>{countryData.latlng ? `${countryData.latlng[0].toFixed(4)}, ${countryData.latlng[1].toFixed(4)}` : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Landlocked</TableCell>
                              <TableCell>{countryData.landlocked ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Bordering Countries</TableCell>
                              <TableCell>{countryData.borders && countryData.borders.length > 0 ? countryData.borders.join(', ') : 'None'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Timezones</TableCell>
                              <TableCell>{countryData.timezones ? countryData.timezones.join(', ') : 'N/A'}</TableCell>
                            </TableRow>
                          </>
                        )}

                        {activeTab === 2 && (
                          <>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '35%' }}>Official Languages</TableCell>
                              <TableCell>{getLanguages(countryData.languages)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Currencies</TableCell>
                              <TableCell>{getCurrencies(countryData.currencies)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Calling Codes</TableCell>
                              <TableCell>{getCallingCode(countryData.idd)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Driving Side</TableCell>
                              <TableCell>{getDrivingSide(countryData.car)}</TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              {/* Map Links */}
              {countryData.maps && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: '#1976d2', fontWeight: 'bold' }}
                  >
                    Map Links
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<PublicIcon />}
                    href={countryData.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mr: 1,
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
                    }}
                  >
                    Google Maps
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PublicIcon />}
                    href={countryData.maps.openStreetMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mr: 1,
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
                    }}
                  >
                    OpenStreetMap
                  </Button>
                  {countryData.coatOfArms?.svg && (
                    <Button
                      variant="outlined"
                      startIcon={<PublicIcon />}
                      href={countryData.coatOfArms.svg}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
                      }}
                    >
                      Coat of Arms
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} variant="filled" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}