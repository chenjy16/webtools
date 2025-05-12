import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button, Divider, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const Pricing = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Choose the Right Plan for You
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          We offer multiple flexible pricing plans to meet your different needs
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Free Plan */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Free Plan
            </Typography>
            
            <Typography variant="h2" component="p" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              $<span style={{ fontSize: '4rem' }}>0</span>
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">10 Credits</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Valid for 1 month</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Access to [schnell] model</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                variant="outlined" 
                fullWidth
                sx={{ mt: 2 }}
              >
                One-time Payment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Basic Plan */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '2px solid #1976d2',
              position: 'relative'
            }}
          >
            <Chip 
              label="Most Popular" 
              color="primary" 
              sx={{ 
                position: 'absolute', 
                top: -16, 
                left: '50%', 
                transform: 'translateX(-50%)',
                fontWeight: 'bold'
              }} 
            />
            
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Basic Plan
            </Typography>
            
            <Typography variant="h2" component="p" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              $<span style={{ fontSize: '4rem' }}>9.99</span>
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">200 Credits</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Valid for 1 month</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Unlimited models</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Select private models</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Maximum 20 Flux.1 Pro images</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Maximum 25 Flux 1.1 Pro images</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ mt: 2 }}
              >
                One-time Payment
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Professional Plan */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Professional Plan
            </Typography>
            
            <Typography variant="h2" component="p" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              $<span style={{ fontSize: '4rem' }}>19.99</span>
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">400 Credits</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Valid for 2 months</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Unlimited models</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Select private models</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Maximum 50 Flux.1 Pro images</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">Maximum 65 Flux 1.1 Pro images</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button 
                variant="outlined" 
                fullWidth
                sx={{ mt: 2 }}
              >
                One-time Payment
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                What are Credits?
              </Typography>
              <Typography variant="body1">
                Credits are the virtual currency of our platform, used for accessing various premium features and services. Different features may consume different amounts of Credits.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                How do I purchase a plan?
              </Typography>
              <Typography variant="body1">
                Click the "One-time Payment" button under the plan you want, then follow the instructions to complete the payment process. We support multiple payment methods.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Can I get a refund?
              </Typography>
              <Typography variant="body1">
                Yes, we offer a 14-day money-back guarantee. If you are not satisfied with your purchase, you can contact our customer support team within 14 days of purchase to request a refund.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                What happens when my plan expires?
              </Typography>
              <Typography variant="body1">
                After your plan expires, you will no longer be able to use the premium features provided by that plan, but your account and basic features will remain unchanged. You can renew or upgrade your plan at any time.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Pricing;