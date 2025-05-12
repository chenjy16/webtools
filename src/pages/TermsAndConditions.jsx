import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Terms and Conditions
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using this website and its tools, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            Our website provides various online tools for users to perform different tasks such as image generation, code formatting, data conversion, and more. These tools are provided on an "as is" and "as available" basis.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            3. User Conduct
          </Typography>
          <Typography variant="body1" paragraph>
            You agree to use our services only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited activities include but are not limited to:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Using the service for any illegal purpose</li>
            <li>Attempting to gain unauthorized access to our systems</li>
            <li>Transmitting malware, viruses, or other harmful code</li>
            <li>Interfering with or disrupting the integrity of our services</li>
            <li>Collecting user information without their consent</li>
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            4. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of the website owner or its content suppliers and is protected by international copyright laws.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            5. User-Generated Content
          </Typography>
          <Typography variant="body1" paragraph>
            When you submit, upload, or otherwise make available any content through our tools, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute such content for the purpose of providing our services.
          </Typography>
          <Typography variant="body1" paragraph>
            You are solely responsible for the content you provide and must ensure it does not violate any third-party rights or any laws.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            6. Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Your use of our website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            7. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, resulting from:
          </Typography>
          <Typography component="ul" sx={{ pl: 4 }}>
            <li>Your access to or use of or inability to access or use the services</li>
            <li>Any conduct or content of any third party on the services</li>
            <li>Any content obtained from the services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            8. Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </Typography>
          <Typography variant="body1" paragraph>
            We do not guarantee that our services will be uninterrupted, secure, or error-free, or that defects will be corrected.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after any changes indicates your acceptance of the modified terms.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            10. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the website owner operates, without regard to its conflict of law provisions.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            11. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms and Conditions, please contact us through the contact information provided on our website.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;