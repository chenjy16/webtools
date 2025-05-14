import React from 'react';
import { Box, Typography, Container, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '8px', 
            background: theme.palette.primary.main 
          }} 
        />
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="left" 
          sx={{ 
            mt: 2, 
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Terms and Conditions
        </Typography>
        
        <Divider sx={{ mb: 4, mt: 2 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, textAlign: 'justify' }}>
            By accessing and using this website and its tools, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Description of Service
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Our website provides various online tools for users to perform different tasks such as image generation, code formatting, data conversion, and more. These tools are provided on an "as is" and "as available" basis.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            User Conduct
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            You agree to use our services only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited activities include but are not limited to:
          </Typography>
          <Typography component="ul" sx={{ pl: 4, listStyleType: 'none', textAlign: 'justify' }}>
            <li>Using the service for any illegal purpose</li>
            <li>Attempting to gain unauthorized access to our systems</li>
            <li>Transmitting malware, viruses, or other harmful code</li>
            <li>Interfering with or disrupting the integrity of our services</li>
            <li>Collecting user information without their consent</li>
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of the website owner or its content suppliers and is protected by international copyright laws.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            User-Generated Content
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            When you submit, upload, or otherwise make available any content through our tools, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute such content for the purpose of providing our services.
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            You are solely responsible for the content you provide and must ensure it does not violate any third-party rights or any laws.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Your use of our website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, resulting from:
          </Typography>
          <Typography component="ul" sx={{ pl: 4, listStyleType: 'none', textAlign: 'justify' }}>
            <li>Your access to or use of or inability to access or use the services</li>
            <li>Any conduct or content of any third party on the services</li>
            <li>Any content obtained from the services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            We do not guarantee that our services will be uninterrupted, secure, or error-free, or that defects will be corrected.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after any changes indicates your acceptance of the modified terms.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Governing Law
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the website owner operates, without regard to its conflict of law provisions.
          </Typography>
        </Box>
      
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom align="left">
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
            If you have any questions about these Terms and Conditions, please contact us through the contact information provided on our website.
          </Typography>
        </Box>
        
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
              mt: 4, 
              pt: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              fontStyle: 'italic'
            }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;