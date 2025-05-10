// Ensure all necessary components and libraries are imported at the top
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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';


export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [formula, setFormula] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Unit conversion categories
  const categories = [
    { id: 'length', name: 'Length' },
    { id: 'area', name: 'Area' },
    { id: 'volume', name: 'Volume' },
    { id: 'weight', name: 'Weight' },
    { id: 'temperature', name: 'Temperature' },
    { id: 'time', name: 'Time' },
    { id: 'speed', name: 'Speed' },
    { id: 'data', name: 'Data Storage' }
  ];

  // Unit definitions for each category
  const units = {
    length: [
      { id: 'km', name: 'Kilometer (km)', factor: 1000 },
      { id: 'm', name: 'Meter (m)', factor: 1 },
      { id: 'dm', name: 'Decimeter (dm)', factor: 0.1 },
      { id: 'cm', name: 'Centimeter (cm)', factor: 0.01 },
      { id: 'mm', name: 'Millimeter (mm)', factor: 0.001 },
      { id: 'um', name: 'Micrometer (μm)', factor: 0.000001 },
      { id: 'nm', name: 'Nanometer (nm)', factor: 0.000000001 },
      { id: 'mile', name: 'Mile (mi)', factor: 1609.344 },
      { id: 'yard', name: 'Yard (yd)', factor: 0.9144 },
      { id: 'foot', name: 'Foot (ft)', factor: 0.3048 },
      { id: 'inch', name: 'Inch (in)', factor: 0.0254 }
    ],
    area: [
      { id: 'km2', name: 'Square Kilometer (km²)', factor: 1000000 },
      { id: 'ha', name: 'Hectare (ha)', factor: 10000 },
      { id: 'm2', name: 'Square Meter (m²)', factor: 1 },
      { id: 'dm2', name: 'Square Decimeter (dm²)', factor: 0.01 },
      { id: 'cm2', name: 'Square Centimeter (cm²)', factor: 0.0001 },
      { id: 'mm2', name: 'Square Millimeter (mm²)', factor: 0.000001 },
      { id: 'acre', name: 'Acre (acre)', factor: 4046.8564224 },
      { id: 'mile2', name: 'Square Mile (mi²)', factor: 2589988.110336 },
      { id: 'yard2', name: 'Square Yard (yd²)', factor: 0.83612736 },
      { id: 'foot2', name: 'Square Foot (ft²)', factor: 0.09290304 },
      { id: 'inch2', name: 'Square Inch (in²)', factor: 0.00064516 }
    ],
    volume: [
      { id: 'm3', name: 'Cubic Meter (m³)', factor: 1 },
      { id: 'dm3', name: 'Cubic Decimeter (dm³)', factor: 0.001 },
      { id: 'cm3', name: 'Cubic Centimeter (cm³)', factor: 0.000001 },
      { id: 'mm3', name: 'Cubic Millimeter (mm³)', factor: 0.000000001 },
      { id: 'l', name: 'Liter (L)', factor: 0.001 },
      { id: 'ml', name: 'Milliliter (mL)', factor: 0.000001 },
      { id: 'gallon_us', name: 'US Gallon (gal)', factor: 0.003785411784 },
      { id: 'gallon_uk', name: 'Imperial Gallon (gal)', factor: 0.00454609 },
      { id: 'quart', name: 'Quart (qt)', factor: 0.000946352946 },
      { id: 'pint', name: 'Pint (pt)', factor: 0.000473176473 },
      { id: 'cup', name: 'Cup (cup)', factor: 0.000236588236 },
      { id: 'fluid_oz', name: 'Fluid Ounce (fl oz)', factor: 0.0000295735295625 },
      { id: 'tbsp', name: 'Tablespoon (tbsp)', factor: 0.0000147867647813 },
      { id: 'tsp', name: 'Teaspoon (tsp)', factor: 0.00000492892159375 }
    ],
    weight: [
      { id: 't', name: 'Tonne (t)', factor: 1000 },
      { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
      { id: 'g', name: 'Gram (g)', factor: 0.001 },
      { id: 'mg', name: 'Milligram (mg)', factor: 0.000001 },
      { id: 'ug', name: 'Microgram (μg)', factor: 0.000000001 },
      { id: 'lb', name: 'Pound (lb)', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce (oz)', factor: 0.028349523125 },
      { id: 'stone', name: 'Stone (st)', factor: 6.35029318 },
      { id: 'ton_us', name: 'US Ton (ton)', factor: 907.18474 },
      { id: 'ton_uk', name: 'Imperial Ton (ton)', factor: 1016.0469088 }
    ],
    temperature: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'k', name: 'Kelvin (K)', factor: 1 }
    ],
    time: [
      { id: 'year', name: 'Year (y)', factor: 31536000 },
      { id: 'month', name: 'Month (mo)', factor: 2592000 },
      { id: 'week', name: 'Week (wk)', factor: 604800 },
      { id: 'day', name: 'Day (d)', factor: 86400 },
      { id: 'hour', name: 'Hour (h)', factor: 3600 },
      { id: 'minute', name: 'Minute (min)', factor: 60 },
      { id: 'second', name: 'Second (s)', factor: 1 },
      { id: 'millisecond', name: 'Millisecond (ms)', factor: 0.001 },
      { id: 'microsecond', name: 'Microsecond (μs)', factor: 0.000001 },
      { id: 'nanosecond', name: 'Nanosecond (ns)', factor: 0.000000001 }
    ],
    speed: [
      { id: 'mps', name: 'Meter/second (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometer/hour (km/h)', factor: 0.277777778 },
      { id: 'mph', name: 'Mile/hour (mph)', factor: 0.44704 },
      { id: 'fps', name: 'Foot/second (ft/s)', factor: 0.3048 },
      { id: 'knot', name: 'Knot (kn)', factor: 0.514444444 }
    ],
    data: [
      { id: 'bit', name: 'Bit (bit)', factor: 1 / 8 },
      { id: 'byte', name: 'Byte (B)', factor: 1 },
      { id: 'kb', name: 'Kilobyte (KB)', factor: 1024 },
      { id: 'mb', name: 'Megabyte (MB)', factor: 1048576 },
      { id: 'gb', name: 'Gigabyte (GB)', factor: 1073741824 },
      { id: 'tb', name: 'Terabyte (TB)', factor: 1099511627776 },
      { id: 'pb', name: 'Petabyte (PB)', factor: 1125899906842624 }
    ]
  };

  // Initialize default units
  useEffect(() => {
    const category = categories[activeTab].id;
    if (units[category] && units[category].length >= 2) {
      setFromUnit(units[category][0].id);
      setToUnit(units[category][1].id);
      convert(1, units[category][0].id, units[category][1].id, category);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value && !isNaN(value) && fromUnit && toUnit) {
      convert(parseFloat(value), fromUnit, toUnit, categories[activeTab].id);
    } else {
      setResult('');
      setFormula('');
    }
  };

  const handleFromUnitChange = (e) => {
    const newFromUnit = e.target.value;
    setFromUnit(newFromUnit);

    if (inputValue && !isNaN(inputValue) && newFromUnit && toUnit) {
      convert(parseFloat(inputValue), newFromUnit, toUnit, categories[activeTab].id);
    }
  };

  const handleToUnitChange = (e) => {
    const newToUnit = e.target.value;
    setToUnit(newToUnit);

    if (inputValue && !isNaN(inputValue) && fromUnit && newToUnit) {
      convert(parseFloat(inputValue), fromUnit, newToUnit, categories[activeTab].id);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);

    if (inputValue && !isNaN(inputValue)) {
      convert(parseFloat(inputValue), toUnit, temp, categories[activeTab].id);
    }
  };

  const convert = (value, from, to, category) => {
    if (category === 'temperature') {
      // Temperature needs special handling
      convertTemperature(value, from, to);
    } else {
      // Other units use factor conversion
      const fromUnitData = units[category].find(u => u.id === from);
      const toUnitData = units[category].find(u => u.id === to);

      if (fromUnitData && toUnitData) {
        const baseValue = value * fromUnitData.factor;
        const convertedValue = baseValue / toUnitData.factor;

        setResult(convertedValue.toLocaleString('en-US', {
          maximumFractionDigits: 10,
          useGrouping: true
        }));

        setFormula(`${value} ${fromUnitData.name} = ${convertedValue.toLocaleString('en-US', {
          maximumFractionDigits: 10,
          useGrouping: true
        })} ${toUnitData.name}`);
      }
    }
  };

  const convertTemperature = (value, from, to) => {
    let tempResult;
    let tempFormula;

    // Convert to Celsius first
    let celsius;
    switch (from) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5/9;
        tempFormula = `(${value}°F - 32) × 5/9 = ${celsius.toFixed(4)}°C`;
        break;
      case 'k':
        celsius = value - 273.15;
        tempFormula = `${value}K - 273.15 = ${celsius.toFixed(4)}°C`;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to the target unit
    switch (to) {
      case 'c':
        tempResult = celsius;
        if (!tempFormula) tempFormula = `${value}°C = ${tempResult.toFixed(4)}°C`;
        break;
      case 'f':
        tempResult = celsius * 9/5 + 32;
        if (!tempFormula) tempFormula = `${value}°C × 9/5 + 32 = ${tempResult.toFixed(4)}°F`;
        else tempFormula += ` → ${celsius.toFixed(4)}°C × 9/5 + 32 = ${tempResult.toFixed(4)}°F`;
        break;
      case 'k':
        tempResult = celsius + 273.15;
        if (!tempFormula) tempFormula = `${value}°C + 273.15 = ${tempResult.toFixed(4)}K`;
        else tempFormula += ` → ${celsius.toFixed(4)}°C + 273.15 = ${tempResult.toFixed(4)}K`;
        break;
      default:
        tempResult = celsius;
    }

    setResult(tempResult.toLocaleString('en-US', {
      maximumFractionDigits: 6,
      useGrouping: true
    }));
    setFormula(tempFormula);
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
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Unit Converter Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Perform fast and accurate conversions between different units.
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {categories.map((category, index) => (
              <Tab key={category.id} label={category.name} />
            ))}
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Input Value"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                InputProps={{ inputProps: { step: 'any' } }}
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  value={fromUnit}
                  label="From"
                  onChange={handleFromUnitChange}
                >
                  {units[categories[activeTab].id]?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton
                color="primary"
                onClick={swapUnits}
                sx={{
                  backgroundColor: '#f0f7ff',
                  '&:hover': { backgroundColor: '#e1f0ff' }
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Result"
                value={result}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <FormControl fullWidth>
                <InputLabel>To</InputLabel>
                <Select
                  value={toUnit}
                  label="To"
                  onChange={handleToUnitChange}
                >
                  {units[categories[activeTab].id]?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {formula && (
            <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="primary">Conversion Formula</Typography>
                <IconButton
                  onClick={() => copyToClipboard(formula)}
                  color="primary"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="body1">
                {formula}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

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