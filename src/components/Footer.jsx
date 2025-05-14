import { Box, Typography, Stack, Container } from '@mui/material';
import { Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Free Online Tools | <MuiLink href="/terms-and-conditions" style={{ color: 'inherit', textDecoration: 'none', marginLeft: '10px' }}>Terms & Conditions</MuiLink>
          </Typography>
          <Typography variant="caption" color="text.disabled">
            © Tool.blog {new Date().getFullYear()} | <MuiLink href="/about" color="inherit" underline="hover">About Us</MuiLink>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}