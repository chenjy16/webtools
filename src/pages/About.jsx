import { Box, Typography, Button, Stack, Container, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#2e7d32',
            mb: 4,
            fontFamily: 'monospace'
          }}
        >
          About Tool.blog
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#1b5e20', fontWeight: 600 }}>
            Our Mission
          </Typography>
          <Typography paragraph sx={{ color: '#424242', lineHeight: 1.75 }}>
            Tool.blog is dedicated to providing developers and designers with a collection of high-quality,
            easy-to-use online tools. Our goal is to simplify daily development workflows and improve work efficiency.
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            backgroundColor: '#f0fdf4',
            border: '1px solid #c8e6c9'
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ color: '#2e7d32', fontWeight: 600 }}
          >
            Support Us
          </Typography>
          <Typography paragraph align="center" sx={{ color: '#4e4e4e', maxWidth: 500, mx: 'auto' }}>
            If you find these tools helpful, please consider supporting us to continue developing and maintaining them.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<FavoriteIcon />}
              href="https://www.buymeacoffee.com/chenjianyu"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: 200,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)'
              }}
            >
              Buy me a coffee
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#fafafa',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#1b5e20', fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography paragraph sx={{ color: '#424242' }}>
            Email: <a href="mailto:chenjianyu944@hotmail.com" style={{ color: '#2e7d32', textDecoration: 'none' }}>chenjianyu944@hotmail.com</a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
