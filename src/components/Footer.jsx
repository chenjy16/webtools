import { Box, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        bgcolor: 'background.paper',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        borderRadius: { xs: '16px 16px 0 0', md: '24px 24px 0 0' },
        textAlign: 'center',
        maxWidth: 800,
        mx: 'auto'
      }}
    >
    <Stack spacing={1} sx={{ textAlign: 'center', mt: 4, mb: 2 }}> {/* Added alignment and margin */}
        <Typography variant="body2" color="text.secondary">
          Free Online Tools | Your Daily Helper for Developers
        </Typography>
        <Typography variant="caption" color="text.disabled">
          © Tool.blog {new Date().getFullYear()} | <Link href="/about" color="inherit" underline="hover">About Us</Link>
        </Typography>
    </Stack>
    </Box>
  );
}