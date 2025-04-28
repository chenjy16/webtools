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
  Link // Import Link for map buttons
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
// Removed FlagIcon import as CardMedia displays the flag
import AdBanner from '../../components/AdBanner'; // Assuming AdBanner component exists

export default function CountryInfo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState(''); // Separate state for Autocomplete input
  const [countryData, setCountryData] = useState(null);
  const [allCountries, setAllCountries] = useState([]); // For Autocomplete options
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false); // Separate loading for list fetching
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
  const [activeTab, setActiveTab] = useState(0);

  // Fetch all countries list for Autocomplete on initial mount
  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchAllCountries = async () => {
    setLoadingList(true); // Indicate list is loading
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2'); // Fetch only needed fields
      if (!response.ok) throw new Error('Failed to fetch country list');
      const data = await response.json();

      // Sort countries by common name
      const sortedCountries = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );

      setAllCountries(sortedCountries.map(c => ({ label: c.name.common, code: c.cca2 }))); // Structure for Autocomplete

    } catch (err) {
      // Don't set the main error state for list failure, maybe just log it
      console.error('Failed to fetch country list:', err);
      // setError('Failed to fetch country list, autocomplete might be limited.');
    } finally {
      setLoadingList(false);
    }
  };

  // Search for a specific country by name or code
  const searchCountry = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setError('Please enter a country name or code.');
      return;
    }

    setLoading(true);
    setError('');
    setCountryData(null); // Clear previous results

    try {
      let response;
      // Prioritize searching by code if query length is 2 or 3 (likely cca2 or cca3)
      if (query.length === 2 || query.length === 3) {
        response = await fetch(`https://restcountries.com/v3.1/alpha/${query}`);
        if (!response.ok) {
           // If code search fails, try by name as fallback
           response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`); // Try full name match first
           if (!response.ok) {
               response = await fetch(`https://restcountries.com/v3.1/name/${query}`); // Then partial name match
           }
        }
      } else {
        // If longer query, prioritize name search
        response = await fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`); // Try full name match first
        if (!response.ok) {
            response = await fetch(`https://restcountries.com/v3.1/name/${query}`); // Then partial name match
        }
      }


      if (!response.ok) {
        // Handle specific error codes if needed, e.g., 404 Not Found
        if (response.status === 404) {
            throw new Error(`Country '${query}' not found.`);
        } else {
            throw new Error(`API error: ${response.statusText} (Status: ${response.status})`);
        }
      }

      const data = await response.json();

      // API might return an array even for alpha code search, always take the first element
      if (Array.isArray(data) && data.length > 0) {
         setCountryData(data[0]);
      } else if (!Array.isArray(data)) {
          // This case shouldn't happen with v3.1 alpha endpoint but handle just in case
          setCountryData(data);
      } else {
          throw new Error(`No valid country data found for '${query}'.`);
      }

    } catch (err) {
      console.error("Search Error:", err);
      setError(`Search failed: ${err.message}`);
      setCountryData(null); // Ensure data is cleared on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed if using query argument directly

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchCountry(searchQuery); // Use the state value from Autocomplete selection/input
  };

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Copy text to clipboard utility
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

  // Show snackbar utility
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // --- Data Formatting Helpers ---
  const formatPopulation = (population) => {
    if (population === undefined || population === null) return 'N/A';
    return new Intl.NumberFormat('en-US').format(population);
  };

  const formatArea = (area) => {
     if (area === undefined || area === null) return 'N/A';
    // Add comma separators and units
    return `${new Intl.NumberFormat('en-US').format(area)} km²`;
  };

  const getLanguages = (languages) => {
     if (!languages) return 'N/A';
     return Object.values(languages).join(', ');
  };

  const getCurrencies = (currencies) => {
      if (!currencies) return 'N/A';
      return Object.values(currencies)
          .map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`) // Handle missing symbol
          .join(', ');
  };

   const getCallingCode = (idd) => {
       if (!idd || !idd.root) return 'N/A';
       // Combine root and the first suffix if available
       return `${idd.root}${idd.suffixes && idd.suffixes.length > 0 ? idd.suffixes[0] : ''}`;
   };

   const getDrivingSide = (car) => {
       if (!car || !car.side) return 'N/A';
       // Capitalize the first letter
       return car.side.charAt(0).toUpperCase() + car.side.slice(1);
   };


  // --- Render ---
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Country Information Finder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        Look up detailed information about countries worldwide, including location, population, languages, currency, and more.
      </Typography>

      {/* Ad Placeholder */}
      <AdBanner slot="0011223344" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Autocomplete
                  freeSolo // Allow users to type arbitrary text
                  options={allCountries} // Provide list of { label: 'Name', code: 'XX' }
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)} // How to display option
                  filterOptions={(options, params) => {
                      // Custom filtering logic (optional, MUI default is good)
                      const filtered = options.filter((option) =>
                          option.label.toLowerCase().includes(params.inputValue.toLowerCase()) ||
                          option.code.toLowerCase().includes(params.inputValue.toLowerCase())
                      );
                      return filtered;
                  }}
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
                         endAdornment: ( // Show loading spinner in Autocomplete only when fetching list
                            <>
                              {loadingList ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                      }}
                       // Use internal input value state for TextField value
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)} // Update internal input state
                    />
                  )}
                  // Update main searchQuery when an option is selected or input changes (for freeSolo)
                  onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue); // Keep track of typed value
                      if (!event || event.type !== 'change') {
                          // Only update search query if it's not just typing
                          setSearchQuery(newInputValue || '');
                      }
                  }}
                   // Handle selection from the dropdown
                   onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setSearchQuery(newValue); // User typed and pressed Enter
                      } else if (newValue && newValue.label) {
                        setSearchQuery(newValue.label); // User selected from list
                         searchCountry(newValue.label); // Trigger search immediately on selection
                      } else {
                        setSearchQuery(''); // Clear if selection is cleared
                      }
                    }}
                   // No need for value prop here when using freeSolo with controlled input value
                  // value={searchQuery} // Don't bind directly to searchQuery for freeSolo text field control
                  loading={loadingList}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading || !searchQuery.trim()} // Disable if loading or query is empty
                  sx={{ height: '56px' }} // Match TextField height
                  startIcon={!loading ? <SearchIcon /> : null} // Icon only when not loading
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator for Search */}
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
                  <Card elevation={3} sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="180" // Adjusted height
                      image={countryData.flags?.svg || countryData.flags?.png} // Prefer SVG
                      alt={`${countryData.name.common} Flag`}
                      sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 1, borderBottom: '1px solid', borderColor: 'divider' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-flag.png'; }} // Basic fallback
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {countryData.name.common}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
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

                {/* Detailed Information Tabs */}
                <Grid item xs={12} md={8}>
                  <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} indicatorColor="primary" textColor="primary">
                    <Tab label="General Info" />
                    <Tab label="Geography" /> {/* Combined Geo & Pop */}
                    <Tab label="Culture" /> {/* Combined Lang & Curr */}
                  </Tabs>

                  {/* Tab Content */}
                  <TableContainer component={Paper} elevation={2} >
                    <Table size="small">
                      <TableBody>
                        {/* General Info Tab */}
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

                        {/* Geography & Population Tab */}
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

                        {/* Languages & Currency Tab */}
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
                              {/* Add more cultural/economic info if available in API */}
                              {/* <TableRow>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Demonyms (M/F)</TableCell>
                                  <TableCell>{countryData.demonyms?.eng?.m} / {countryData.demonyms?.eng?.f}</TableCell>
                              </TableRow> */}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              {/* Map Links Section */}
              {countryData.maps && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Map Links
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<PublicIcon />}
                    href={countryData.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer" // Security best practice
                    sx={{ mr: 1, mb: 1 }} // Add margin bottom for wrap
                  >
                    Google Maps
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PublicIcon />}
                    href={countryData.maps.openStreetMaps}
                    target="_blank"
                    rel="noopener noreferrer" // Security best practice
                     sx={{ mr: 1, mb: 1 }}
                  >
                    OpenStreetMap
                  </Button>
                  {/* Add link to country's Coat of Arms if available */}
                  {countryData.coatOfArms?.svg &&
                     <Button
                       variant="outlined"
                       startIcon={<PublicIcon />} // Replace with a better icon if possible
                       href={countryData.coatOfArms.svg}
                       target="_blank"
                       rel="noopener noreferrer"
                       sx={{ mb: 1 }}
                     >
                       Coat of Arms
                     </Button>
                  }
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for Copy Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} variant="filled" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}