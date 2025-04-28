import { Box, Typography, Link, Stack, Container } from '@mui/material';

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
            Free Online Tools | Your Daily Helper for Developers
          </Typography>
          <Typography variant="caption" color="text.disabled">
            © Tool.blog {new Date().getFullYear()} | <Link href="/about" color="inherit" underline="hover">About Us</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}