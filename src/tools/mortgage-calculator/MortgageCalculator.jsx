import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Slider, // Keep Slider if you still want it as an alternative input
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
  Divider,
  InputAdornment,
  Alert // For displaying notes/disclaimers
} from '@mui/material';
import AdBanner from '../../components/AdBanner'; // Assuming AdBanner component exists

export default function MortgageCalculator() {
  // --- State Variables ---
  const [homePrice, setHomePrice] = useState(360000);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [downPayment, setDownPayment] = useState(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [monthlyPAndI, setMonthlyPAndI] = useState(0); // Principal & Interest only
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [isUpdatingDownPayment, setIsUpdatingDownPayment] = useState(false);
  const [isUpdatingPercent, setIsUpdatingPercent] = useState(false);

  // State-specific variables (US)
  const [selectedState, setSelectedState] = useState('CA'); // Default to California
  const [propertyTax, setPropertyTax] = useState(0); // Annual Property Tax Amount
  const [homeInsurance, setHomeInsurance] = useState(1200); // Annual Home Insurance Premium
  const [monthlyPITI, setMonthlyPITI] = useState(0); // Total monthly payment (Principal, Interest, Tax, Insurance)

  // --- US State Data (Approximate Average Rates) ---
  // Source: Needs verification/update from reliable sources (e.g., Freddie Mac, Tax Foundation)
  const stateData = {
    'AL': { name: 'Alabama', avgRate: 4.42, propertyTaxRate: 0.41 },
    'AK': { name: 'Alaska', avgRate: 4.48, propertyTaxRate: 1.19 },
    'AZ': { name: 'Arizona', avgRate: 4.37, propertyTaxRate: 0.62 },
    'AR': { name: 'Arkansas', avgRate: 4.46, propertyTaxRate: 0.62 },
    'CA': { name: 'California', avgRate: 4.50, propertyTaxRate: 0.76 },
    'CO': { name: 'Colorado', avgRate: 4.41, propertyTaxRate: 0.51 },
    'CT': { name: 'Connecticut', avgRate: 4.44, propertyTaxRate: 2.14 },
    'DE': { name: 'Delaware', avgRate: 4.43, propertyTaxRate: 0.57 },
    'FL': { name: 'Florida', avgRate: 4.40, propertyTaxRate: 0.83 },
    'GA': { name: 'Georgia', avgRate: 4.41, propertyTaxRate: 0.92 },
    'HI': { name: 'Hawaii', avgRate: 4.52, propertyTaxRate: 0.28 },
    'ID': { name: 'Idaho', avgRate: 4.39, propertyTaxRate: 0.69 },
    'IL': { name: 'Illinois', avgRate: 4.45, propertyTaxRate: 2.27 },
    'IN': { name: 'Indiana', avgRate: 4.44, propertyTaxRate: 0.85 },
    'IA': { name: 'Iowa', avgRate: 4.43, propertyTaxRate: 1.53 },
    'KS': { name: 'Kansas', avgRate: 4.45, propertyTaxRate: 1.41 },
    'KY': { name: 'Kentucky', avgRate: 4.44, propertyTaxRate: 0.86 },
    'LA': { name: 'Louisiana', avgRate: 4.47, propertyTaxRate: 0.55 },
    'ME': { name: 'Maine', avgRate: 4.46, propertyTaxRate: 1.36 },
    'MD': { name: 'Maryland', avgRate: 4.42, propertyTaxRate: 1.09 },
    'MA': { name: 'Massachusetts', avgRate: 4.44, propertyTaxRate: 1.23 },
    'MI': { name: 'Michigan', avgRate: 4.45, propertyTaxRate: 1.54 },
    'MN': { name: 'Minnesota', avgRate: 4.43, propertyTaxRate: 1.12 },
    'MS': { name: 'Mississippi', avgRate: 4.47, propertyTaxRate: 0.65 },
    'MO': { name: 'Missouri', avgRate: 4.44, propertyTaxRate: 0.97 },
    'MT': { name: 'Montana', avgRate: 4.45, propertyTaxRate: 0.84 },
    'NE': { name: 'Nebraska', avgRate: 4.44, propertyTaxRate: 1.73 },
    'NV': { name: 'Nevada', avgRate: 4.43, propertyTaxRate: 0.60 },
    'NH': { name: 'New Hampshire', avgRate: 4.45, propertyTaxRate: 2.18 },
    'NJ': { name: 'New Jersey', avgRate: 4.46, propertyTaxRate: 2.49 },
    'NM': { name: 'New Mexico', avgRate: 4.45, propertyTaxRate: 0.80 },
    'NY': { name: 'New York', avgRate: 4.48, propertyTaxRate: 1.72 },
    'NC': { name: 'North Carolina', avgRate: 4.41, propertyTaxRate: 0.84 },
    'ND': { name: 'North Dakota', avgRate: 4.44, propertyTaxRate: 0.98 },
    'OH': { name: 'Ohio', avgRate: 4.44, propertyTaxRate: 1.56 },
    'OK': { name: 'Oklahoma', avgRate: 4.46, propertyTaxRate: 0.90 },
    'OR': { name: 'Oregon', avgRate: 4.42, propertyTaxRate: 0.97 },
    'PA': { name: 'Pennsylvania', avgRate: 4.44, propertyTaxRate: 1.58 },
    'RI': { name: 'Rhode Island', avgRate: 4.45, propertyTaxRate: 1.63 },
    'SC': { name: 'South Carolina', avgRate: 4.42, propertyTaxRate: 0.57 },
    'SD': { name: 'South Dakota', avgRate: 4.45, propertyTaxRate: 1.32 },
    'TN': { name: 'Tennessee', avgRate: 4.43, propertyTaxRate: 0.71 },
    'TX': { name: 'Texas', avgRate: 4.41, propertyTaxRate: 1.80 },
    'UT': { name: 'Utah', avgRate: 4.40, propertyTaxRate: 0.66 },
    'VT': { name: 'Vermont', avgRate: 4.47, propertyTaxRate: 1.90 },
    'VA': { name: 'Virginia', avgRate: 4.41, propertyTaxRate: 0.80 },
    'WA': { name: 'Washington', avgRate: 4.41, propertyTaxRate: 0.98 },
    'WV': { name: 'West Virginia', avgRate: 4.46, propertyTaxRate: 0.58 },
    'WI': { name: 'Wisconsin', avgRate: 4.44, propertyTaxRate: 1.85 },
    'WY': { name: 'Wyoming', avgRate: 4.45, propertyTaxRate: 0.61 },
    'DC': { name: 'District of Columbia', avgRate: 4.43, propertyTaxRate: 0.56 }
    // Note: These rates are illustrative and may be outdated. Use real-time data sources for production.
  };

  // --- Input Handlers ---

  const handleStateChange = (event) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);
    // Optionally set the interest rate to the state average when state changes
    setInterestRate(stateData[stateCode].avgRate);
  };

  const handleHomePriceChange = useCallback((value) => {
    setHomePrice(value);
    const newDownPayment = Math.round((value * downPaymentPercent) / 100);
    setDownPayment(newDownPayment);
    setLoanAmount(value - newDownPayment);
  }, [downPaymentPercent]);

  const handleDownPaymentChange = useCallback((value) => {
    if (isUpdatingPercent || value > homePrice) return;
    setIsUpdatingDownPayment(true);
    setDownPayment(value);
    const newPercent = homePrice > 0 ? (value / homePrice) * 100 : 0;
    setDownPaymentPercent(parseFloat(newPercent.toFixed(2)));
    setLoanAmount(homePrice - value);
    requestAnimationFrame(() => setIsUpdatingDownPayment(false));
  }, [homePrice, isUpdatingPercent]);

  const handleDownPaymentPercentChange = useCallback((percent) => {
    if (isUpdatingDownPayment) return;
    setIsUpdatingPercent(true);
    setDownPaymentPercent(percent);
    const newDownPayment = Math.round((homePrice * percent) / 100);
    setDownPayment(newDownPayment);
    setLoanAmount(homePrice - newDownPayment);
    requestAnimationFrame(() => setIsUpdatingPercent(false));
  }, [homePrice, isUpdatingDownPayment]);

  const handleLoanAmountChange = useCallback((value) => {
    if (value > homePrice) value = homePrice;
    setLoanAmount(value);
    const newDownPayment = homePrice - value;
    setDownPayment(newDownPayment);
    const newPercent = homePrice > 0 ? (newDownPayment / homePrice) * 100 : 0;
    setDownPaymentPercent(parseFloat(newPercent.toFixed(2)));
  }, [homePrice]);

  // --- Calculation Logic ---

  const calculateMortgage = useCallback(() => {
    const principal = loanAmount;
    const annualRate = interestRate;
    const termYears = loanTerm;
    const currentHomePrice = homePrice; // Use current value for tax calculation
    const stateCode = selectedState;
    const annualInsurance = homeInsurance;

    if (principal <= 0 || annualRate < 0 || termYears <= 0) {
      setMonthlyPAndI(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setPropertyTax(0);
      setMonthlyPITI(0);
      setAmortizationSchedule([]);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = termYears * 12;

    // Calculate Principal & Interest (P&I)
    let monthlyPI = 0;
    if (monthlyRate === 0) {
      monthlyPI = principal / numberOfPayments;
    } else {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    setMonthlyPAndI(monthlyPI);

    const totalPaid = monthlyPI * numberOfPayments;
    const totalInt = totalPaid - principal;
    setTotalPayment(totalPaid);
    setTotalInterest(totalInt > 0 ? totalInt : 0);

    // Calculate Property Tax (T)
    const taxRate = stateData[stateCode]?.propertyTaxRate || 0; // Default to 0 if state not found
    const annualTax = currentHomePrice * (taxRate / 100);
    setPropertyTax(annualTax);
    const monthlyTax = annualTax / 12;

    // Calculate Home Insurance (I)
    const monthlyInsurance = annualInsurance / 12;

    // Calculate Total Monthly Payment (PITI)
    setMonthlyPITI(monthlyPI + monthlyTax + monthlyInsurance);

    // Generate Amortization Schedule (based on P&I only)
    generateAmortizationSchedule(principal, annualRate, termYears, monthlyPI);

  }, [loanAmount, interestRate, loanTerm, homePrice, selectedState, homeInsurance]); // Include all dependencies

  // Generate Amortization Schedule (Yearly Summary)
  const generateAmortizationSchedule = (principal, annualRate, years, monthlyPayment) => {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    const schedule = [];
    let balance = principal;
    let cumulativeInterest = 0;

    if (principal <= 0 || monthlyRate < 0) {
      setAmortizationSchedule([]);
      return;
    }

    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPaid = balance * monthlyRate;
      const principalPaid = monthlyPayment - interestPaid;
      balance -= principalPaid;
      cumulativeInterest += interestPaid;
      yearlyPrincipal += principalPaid;
      yearlyInterest += interestPaid;

      if (i % 12 === 0 || i === numberOfPayments) {
        schedule.push({
          year: Math.ceil(i / 12),
          payment: monthlyPayment * 12, // Annual P&I Payment
          principalPaid: yearlyPrincipal,
          interest: yearlyInterest,
          totalInterest: cumulativeInterest, // Cumulative Interest (P&I only)
          balance: Math.max(0, balance)
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }
    setAmortizationSchedule(schedule);
  };

  // --- Formatting ---
  const formatCurrency = (value) => {
    if (isNaN(value) || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // --- Effects ---
  useEffect(() => {
    calculateMortgage(); // Recalculate whenever dependencies change
  }, [calculateMortgage]);

  // --- Render ---
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        US Mortgage Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        Estimate your monthly mortgage payment (including PITI) and total costs based on state averages.
      </Typography>

      <AdBanner slot="1122334455" /> {/* Placeholder Ad */}

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>

              {/* State Selector */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  value={selectedState}
                  onChange={handleStateChange}
                  label="State"
                >
                  {Object.keys(stateData).sort((a, b) => stateData[a].name.localeCompare(stateData[b].name)).map((stateCode) => (
                    <MenuItem key={stateCode} value={stateCode}>
                      {stateCode} - {stateData[stateCode].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Home Price */}
              <TextField
                fullWidth
                label="Home Price"
                value={homePrice}
                onChange={(e) => handleHomePriceChange(Math.max(0, Number(e.target.value) || 0))}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                margin="normal"
              />

              {/* Down Payment Inputs */}
              <Grid container spacing={2} sx={{ mt: 0.5 }}> {/* Reduced top margin */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Down Payment"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Math.max(0, Number(e.target.value) || 0))}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Down Payment %"
                    value={downPaymentPercent}
                    onChange={(e) => handleDownPaymentPercentChange(Math.max(0, Number(e.target.value) || 0))}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      step: "0.1"
                    }}
                  />
                </Grid>
              </Grid>

              {/* Loan Amount (Derived but editable) */}
              <TextField
                fullWidth
                label="Loan Amount"
                value={loanAmount}
                onChange={(e) => handleLoanAmountChange(Math.max(0, Number(e.target.value) || 0))}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                margin="normal"
                sx={{ backgroundColor: 'action.hover' }}
              />

              {/* Interest Rate */}
              <TextField
                fullWidth
                label="Interest Rate"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value) || 0))}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  step: "0.01"
                }}
                margin="normal"
                helperText={`Avg. for ${selectedState}: ${stateData[selectedState]?.avgRate.toFixed(2)}%`}
              />

              {/* Loan Term */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="loan-term-label">Loan Term</InputLabel>
                <Select
                  labelId="loan-term-label"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  label="Loan Term"
                >
                  <MenuItem value={30}>30 Years</MenuItem>
                  <MenuItem value={20}>20 Years</MenuItem>
                  <MenuItem value={15}>15 Years</MenuItem>
                  <MenuItem value={10}>10 Years</MenuItem>
                </Select>
              </FormControl>

              {/* Home Insurance */}
              <TextField
                fullWidth
                label="Annual Home Insurance"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(Math.max(0, Number(e.target.value) || 0))}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                margin="normal"
                helperText="Estimated annual premium"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculation Results
              </Typography>

              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Payment Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Principal & Interest:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(monthlyPAndI)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Property Tax:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(propertyTax / 12)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Home Insurance:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(homeInsurance / 12)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Monthly Payment:
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {formatCurrency(monthlyPITI)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Loan Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Loan Amount:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(loanAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Down Payment:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(downPayment)} ({downPaymentPercent.toFixed(1)}%)
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Interest Paid:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(totalInterest)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Payments:
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(totalPayment)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAmortization(!showAmortization)}
                fullWidth
                sx={{ mt: 1 }}
              >
                {showAmortization ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
              </Button>

              {showAmortization && (
                <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell align="right">Principal Paid</TableCell>
                        <TableCell align="right">Interest Paid</TableCell>
                        <TableCell align="right">Remaining Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {amortizationSchedule.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell component="th" scope="row">{row.year}</TableCell>
                          <TableCell align="right">{formatCurrency(row.principalPaid)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.interest)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="body2">
            This calculator provides estimates based on the information you enter. Actual loan terms and rates may vary based on your credit score, loan type, and current market conditions.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}