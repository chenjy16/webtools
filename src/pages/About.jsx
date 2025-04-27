import { Box, Typography, Button, Stack, Container, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Tool.blog
        </Typography>
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography paragraph>
            Tool.blog is dedicated to providing developers and designers with a collection of high-quality, easy-to-use online tools. Our goal is to simplify daily development workflows and improve work efficiency.
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 4, mb: 4, bgcolor: '#f5f5f5' }}>
          <Typography variant="h5" gutterBottom align="center">
            Support Us
          </Typography>
          <Typography paragraph align="center">
            If you find these tools helpful, please consider supporting us to continue developing and maintaining them.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FavoriteIcon />}
              href="https://www.buymeacoffee.com/chenjianyu"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ minWidth: 200 }}
            >
              Buy me a coffee
            </Button>
          </Stack>
        </Paper>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography paragraph>
            Email: support@tool.blog
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
